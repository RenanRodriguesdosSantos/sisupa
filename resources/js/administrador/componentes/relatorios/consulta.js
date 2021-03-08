import axios from 'axios';
import React,{Component} from 'react';
import Pagination from 'react-js-pagination';
import { redirect } from '../../../components/mensagens';
import {UpaImg} from '../../../imagens/upa.png';

export default class Consulta extends Component{
    constructor(){
        super();
        this.state ={
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: {paciente: "", dataInicial: "", dataFinal: "",medico: "", diagnostico: "", conduta: ""},
            atendimentos: [],
            atendimento: {resultados: "", sintomas: "", diagnostico: "", cid: ""}
        }
        this.url = "/administrador/";
        this.handleChange = this.handleChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handleChange(e){
        e.preventDefault();
        var campo = e.target.id;
        var valor = e.target.value.toUpperCase();
        var filtros = this.state.filtros;
        filtros[campo] = valor;
        this.setState({filtros: filtros});
    }

    buscar(e){
        e.preventDefault();
        $(document).ready(function(){
            $("#tabelaConsulta").addClass("d-none");
            $("#spinnerConsulta").removeClass("d-none");
        });
        axios.post(this.url + "relatorios/consulta",this.state.filtros)
        .then(response => this.closeLoading(response))
        .catch(e =>{
            redirect(e);
        })
    }

    handlePageChange(pageNumber){
        $(document).ready(function(){
            $("#tabelaConsulta").addClass("d-none");
            $("#spinnerConsulta").removeClass("d-none");
        });

        axios.post(this.url + "relatorios/consulta?page="+pageNumber,this.state.filtros)
        .then(response => this.closeLoading(response))
        .catch(e => {redirect(e)});

    }

    closeLoading(response){
        this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
        });
        $(document).ready(function() {
            $("#tabelaConsulta").removeClass("d-none");
            $("#spinnerConsulta").addClass('d-none');
        })
    }

    imprimir(e){
        e.preventDefault();
        var atendimentos = this.state.atendimentos;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='5'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>PACIENTES ATENDIDOS</b></td></tr>";
        table = table + "<tr><td colspan='6' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr><td><center><b>Registro</b></center></td><td><center><b>Paciente</b></center></td><td><center><b>Data e Hora</b></center></td><td><center><b>Médico</b></center></td><td><center><b>Diagnóstico Inicial</b></center></td></tr>";
        
        atendimentos.map(e => {
            table = table + "<tr><td><center>"+ e.id + "</center></td><td >" + e.paciente + "</td><td>"+ new Date(e.created_at).toLocaleString() +"</td><td >"+ e.medico +"<td >"+ e.diagnostico +"</td>"+ "</td><tr>";
        })
        
        table = table + "</table";
        var style = "<style> table{width: 100%; font: 17px Calibri;} img{max-width: 80px;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;}</style>";
        var head = "<head><title>Atendimento </title> "+ style +" </head>";
        var body = "<body>"+table+"<body>";
        var win = window.open("","","height=700,width=700");
        win.document.write("<html>");
        win.document.write(head);
        win.document.write(body);
        win.document.write("</html>");
        var img = win.document.getElementById("imagem");
    
        img.onload = function () {
            win.print();
            win.close();
        }
    }

    verConsulta(e, row){
        e.preventDefault();
        axios.get(this.url + "relatorios/consulta/dados/"+ row.consulta)
                .then(response => {
                    var atendimento = this.state.atendimento;
                    atendimento.sintomas = !response.data.sintomas?"":response.data.sintomas;
                    atendimento.conduta = !response.data.conduta?"":response.data.conduta;
                    atendimento.resultados = !response.data.resultados?"":response.data.resultados;
                    atendimento.diagnostico = !response.data.diagnostico?"":response.data.diagnostico;
                    atendimento.conduta = !response.data.conduta?"":response.data.conduta;
                    atendimento.conduta = !response.data.conduta?"":response.data.conduta;
                    atendimento.cid = !response.data.cid?"":response.data.cid;
                    atendimento.encaminhamento = !response.data.encaminhamento?"":response.data.encaminhamento;
                    atendimento.paciente = row.paciente;
                    atendimento.medico = row.medico;
                    atendimento.data = row.created_at;
                    atendimento.registro = row.id;
                    this.setState({atendimento: atendimento});
                    $("#spinnerConsultaVer").addClass('d-none');
                    $("#dadosConsultaVer").removeClass('d-none');
                })
    }

    imprimirRow(e){
        e.preventDefault();
        var atendimento = this.state.atendimento;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='6'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>PACIENTES ATENDIDOS - CONSULTA MÉDICA</b></td></tr>";
        table = table + "<tr><td colspan='7' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        
        table += "<tr><td> Registro </td><td colspan='2'>" + atendimento.registro +"</td><td>Data e Hora</td><td colspan='3'>" + new Date(atendimento.data).toLocaleString() +"</td></tr>";
        table += "<tr><td>Paciente</td><td colspan='6'>" + atendimento.paciente + "</td></tr>";
        table += "<tr><td>Medico</td><td colspan='6'>" + atendimento.medico + "</td></tr>";
        table += "<tr><td class='center' colspan='7'>Principais Sinais de Sintomas Clínicos</td></tr>";
        table += "<tr><td colspan='7'>" + atendimento.sintomas + "</td></tr>";
        table += "<tr><td class='center' colspan='7'>Principais Resultados de Provas Diagnósticas</td></tr>";
        table += "<tr><td colspan='7'>" + atendimento.resultados + "</td></tr>";
        table += "<tr><td class='center' colspan='7'>Conduta Terapéutica</td></tr>";
        table += "<tr><td colspan='7'>" + atendimento.conduta + "</td></tr>";
        table += "<tr><td class='center' colspan='7'>Diagnóstico Inicial</td></tr>";
        table += "<tr><td colspan='7'>" + atendimento.diagnostico + "</td></tr>";
        table += "<tr><td>CID</td><td colspan='6'>" + atendimento.cid + "</td></tr>";
        table += "<tr><td>Encaminhamento</td><td colspan='6'>" + this.getEncaminhamento(atendimento.encaminhamento) + "</td></tr>";
        
        table = table + "</table";
        var style = "<style> table{width: 100%; font: 17px Calibri;} img{max-width: 80px;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} td{width: 100px; padding-left: 2px;} .center{text-align: center;}</style>";
        var head = "<head><title>Atendimento </title> "+ style +" </head>";
        var body = "<body>"+table+"<body>";
        var win = window.open("","","height=700,width=700");
        win.document.write("<html>");
        win.document.write(head);
        win.document.write(body);
        win.document.write("</html>");
        var img = win.document.getElementById("imagem");
    
        img.onload = function () {
            win.print();
            win.close();
        }
    }

    getEncaminhamento(id){
        switch (id) {
            case 1:
                return "Para Serviço mais Complexo";
                break;
            case 2:
                return "Observação Hospitalar";
                break;
            case 3:
                return "Ambulatório Rede Pública";
                break;
            case 4:
                return "Iternação";
                break;
            case 5:
                return "Retorno";
                break;
            case 6:
                return "Alta";
                break;
        
        }
        return "";
    }
    
    render(){
        return(
            <div>
                <h3 className="text-center">Relatório Consulta</h3>
                <div className="form-group row">
                    <label htmlFor="paciente" className="col-md-1 col-form-label"> Paciente: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" onChange={this.handleChange} value={this.state.filtros.paciente} id="paciente" placeholder="Nome do paciente"/>
                    </div>
                    <label htmlFor="dataInicial" className="col-md-1 col-form-label"> Entre: </label>
                    <div className="col-md-2">
                        <input type="date" className="form-control" onChange={this.handleChange} value={this.state.filtros.dataInicial} id="dataInicial"/>
                    </div>
                    <label>-</label>
                    <div className="col-md-2">
                        <input type="date" className="form-control" onChange={this.handleChange} value={this.state.filtros.dataFinal} id="dataFinal"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="diagnostico" className="col-md-2 col-form-label"> Diagnóstico: </label>
                    <div className="col-md-8">
                        <input type="text" className="form-control text-uppercase" id="diagnostico" onChange={this.handleChange} value={this.state.filtros.diagnostico} placeholder="Diagnóstico Inicial"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="medico" className="col-md-1 col-form-label"> Médico: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" id="medico" onChange={this.handleChange} value={this.state.filtros.medico} placeholder="Nome do Médico"/>
                    </div>
                    <div className="col-md-1">

                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary form-control" onClick={e=> this.buscar(e)}>BUSCAR</button>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-success form-control" id="imprimir" onClick={e=> this.imprimir(e)}>IMPRIMIR</button>
                    </div>
                </div>
                <hr/>
                <div className="row text-center">
                    <div className="col-md-12">
                        <center>
                            <div className="spinner-border d-none text-center" id="spinnerConsulta" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="col-md-12 d-none" id="tabelaConsulta">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col"> Registro </th>
                                    <th scope="col"> Paciente </th>
                                    <th scope="col"> Data e Hora </th>
                                    <th scope="col"> Médico </th>
                                    <th scope="col"> Diagnóstico Inicial</th>
                                    <th scope="col"> Ver </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.atendimentos.map(
                                    row =>
                                    <tr key={row.id}>
                                        <td> {row.id} </td>
                                        <td> {row.paciente} </td>
                                        <td> {new Date(row.created_at).toLocaleString()}</td>
                                        <td> {row.medico} </td>
                                        <td> {row.diagnostico} </td>
                                        <td><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalConsulta" onClick={e => this.verConsulta(e,row)}> Ver </button></td>
                                    </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-12">
                        <center>
                            <div className="col-md-3">
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemsCountPerPage}
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={5}
                                    onChange={e => this.handlePageChange(e)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>
                        </center>
                    </div>
                </div>
                <div className="row">
                    <div className="modal fade" id="modalConsulta" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Consulta</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <div className="spinner-border text-center" id="spinnerConsultaVer" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row d-none" id="dadosConsultaVer">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-6 border border-dark">
                                                    <h5 className="text-center">Laudo Técnico e Justificativa de Atendimento</h5>
                                                    <div className="form-group row ">
                                                        <label htmlFor="sintomas" className="col-md-12 col-form-label"> Principais Sinais de Sintomas Clínicos: </label>
                                                        <div className="col-md-12">
                                                            <textarea rows="4" disabled value={this.state.atendimento.sintomas} className="form-control text-uppercase" id="sintomas" placeholder="Principais Sinais de Sintomas Clínicos"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="resultados" className="col-md-12 col-form-label"> Principais Resultados de Provas Diagnósticas: </label>
                                                        <div className="col-md-12">
                                                            <textarea rows="3" disabled value={this.state.atendimento.resultados} className="form-control text-uppercase" id="resultados" placeholder="Principais Resultados de Provas Diagnóstcas"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="conduta" className="col-md-12 col-form-label"> Conduta Terapeutica: </label>
                                                        <div className="col-md-12">
                                                            <textarea rows="3" disabled value={this.state.atendimento.conduta} className="form-control text-uppercase" id="conduta" placeholder="Conduta Terapeutica"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 border border-dark">
                                                    <h6 className="text-center">Registro: {this.state.atendimento.registro}</h6>
                                                    <h6 className="text-center">Paciente: {this.state.atendimento.paciente}</h6>
                                                    <h6 className="text-center">Médico: {this.state.atendimento.medico}</h6>
                                                    <h6 className="text-center">Data e Hora:{new Date(this.state.atendimento.data).toLocaleString()}</h6>
                                                    <div className="form-group row">
                                                        <label htmlFor="diagnostico" className="col-md-12 col-form-label"> Diagnóstico Inicial: </label>
                                                        <div className="col-md-12">
                                                            <input disabled  value={this.state.atendimento.diagnostico} className="form-control text-uppercase" id="diagnostico" placeholder="Diagnóstico Inicial"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="cid" className="col-md-12 col-form-label"> CID: </label>
                                                        <div className="col-md-12">
                                                            <input disabled  value={this.state.atendimento.cid} className="form-control text-uppercase" id="cid" placeholder="CID"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="encaminhamento" className="col-md-12 col-form-label"> Encaminhamento: </label>
                                                        <div className="col-md-12">
                                                            <select disabled  value={this.state.atendimento.encaminhamento} className="form-control text-uppercase" id="encaminhamento">
                                                                <option value="0">Selecione</option>
                                                                <option value="1">Para Serviço mais Complexo</option>
                                                                <option value="2">Observação Hospitalar</option>
                                                                <option value="3">Ambulatório Rede Pública</option>
                                                                <option value="4">Internção</option>
                                                                <option value="5">Retorno</option>
                                                                <option value="6">Alta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Sair</button>
                                    <button type="button" className="btn btn-success" onClick={e => this.imprimirRow(e)}>Imprimir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}