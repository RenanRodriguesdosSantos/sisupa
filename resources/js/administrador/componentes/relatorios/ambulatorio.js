import axios from 'axios';
import React,{Component} from 'react';
import Pagination from 'react-js-pagination';
import { redirect } from '../../../components/mensagens';
import {UpaImg} from '../../../imagens/upa.png';

export default class Ambulatorio extends Component{
    constructor(){
        super();
        this.state ={
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: {paciente: "", dataInicial: "", dataFinal: "", medico: "", tecnico: ""},
            atendimentos: [],
            prescricao: [],
            materiais: [],
            observacao: "",
            atendimento: {}
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
            $("#tabelaAmbulatorio").addClass("d-none");
            $("#spinnerAmbulatorio").removeClass("d-none");
        });
        axios.post(this.url + "relatorios/ambulatorio",this.state.filtros)
        .then(response => this.closeLoading(response))
        .catch(e =>{
            redirect(e);
        })
    }

    handlePageChange(pageNumber){
        $(document).ready(function(){
            $("#tabelaAmbulatorio").addClass("d-none");
            $("#spinnerAmbulatorio").removeClass("d-none");
        });

        axios.post(this.url + "relatorios/ambulatorio?page="+pageNumber,this.state.filtros)
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
            $("#tabelaAmbulatorio").removeClass("d-none");
            $("#spinnerAmbulatorio").addClass('d-none');
        })
    }

    imprimir(e){
        e.preventDefault();
        var atendimentos = this.state.atendimentos;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='5'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>PACIENTES ATENDIDOS</b></td></tr>";
        table = table + "<tr><td colspan='6' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr><td><center><b>Registro</b></center></td><td><center><b>Prescrição</b></center></td><td><center><b>Paciente</b></center></td><td><center><b>Data e Hora</b></center></td><td><center><b>Médico</b></center></td><td><center><b>T. Enfermagem</b></center></td></tr>";
        
        atendimentos.map(e => {
            table = table + "<tr><td><center>"+ e.id + "</center></td><td>" + e.prescricao + "</td><td>" + e.paciente + "</td><td>"+ new Date(e.created_at).toLocaleString() +"</td><td>"+ e.medico +"</td>"+ "</td><td >"+ e.tecnico +"</td><tr>";
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
    
    getPosologia(id){
        switch (id) {
            case 1:
                return "2 em 2 Horas";
                break;
            case 2:
                return "4 em 4 Horas";
                break;
            case 3:
                return "6 em 6 Horas";
                break;
            case 4:
                return "8 em 8 Horas";
                break;
            case 5:
                return "10 em 10 Horas";
                break;
            case 6:
                return "12 em 12 Horas";
                break;
        }
    }

    getApresentacao(id){
        switch (id) {
            case 1:
                return "Via Oral";
                break;
            case 2:
                return "Via Intravenosa";
                break;
            case 3:
                return "Via Intramuscular";
                break;
        }
    }

    verAmbulatorio(e, row){
        e.preventDefault();
        $("#spinnerAmbulatorioVer").removeClass("d-none");
        $("#dadosAmbulatorioVer").addClass("d-none");
        axios.get(this.url + "relatorios/prescricao/dados/" + row.prescricao)
        .then(response => {
            this.setState({prescricao: response.data.prescricaos})
        });
        axios.get(this.url + "relatorios/materiais/dados/" + row.prescricao)
        .then(response => {
            var observacao = response.data.prescricao.observacao?response.data.prescricao.observacao:"";
            this.setState({materiais: response.data.materiais, observacao: observacao});
            $("#spinnerAmbulatorioVer").addClass("d-none");
            $("#dadosAmbulatorioVer").removeClass("d-none");
        });

        this.setState({atendimento: row});
    }

    imprimirRow(e){
        e.preventDefault();
        var atendimento = this.state.atendimento;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='6'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>PACIENTES ATENDIDOS - CONSULTA MÉDICA</b></td></tr>";
        table = table + "<tr><td colspan='7' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        
        table += "<tr><td> Registro </td><td colspan='2'>" + atendimento.id +"</td><td>Data e Hora</td><td colspan='3'>" + new Date(atendimento.created_at).toLocaleString() +"</td></tr>";
        table += "<tr><td>Paciente</td><td colspan='6'>" + atendimento.paciente + "</td></tr>";
        table += "<tr><td>Medico</td><td colspan='6'>" + atendimento.medico + "</td></tr>";
        table += "<tr><td class='center' colspan='7'>PRESCRIÇÃO MÉDICA</td></tr>";
        table = table + "<tr><td><center><b>Quantidade</b></center></td><td colspan='4'><center><b>Prescrição</b></center></td><td><center><b>Posologia</b></center></td><td><center><b>Apresentação</b></center></td></tr>";

        this.state.prescricao.map(row =>{
            table += "<tr><td class='center'>"+ row.quantidade + "</td><td colspan='4'>" + row.medicamento + "</td><td>" + this.getPosologia(row.posologia) + "</td><td>" + this.getApresentacao(row.apresentacao) + "</td></tr>";
        });
        table += "<tr><td class='center' colspan='7'>LISTAGEM DE MATERIAIS</td></tr>";

        this.state.materiais.map(row => {
            table += "<tr><td class='center' colspan='2'>" + row.quantidade + "</td><td colspan='5'>" + row.material +"</td></tr>"
        });

        table += "<tr><td class='center' colspan='7'>OBSERVAÇÃO</td></tr>";
        table += "<tr><td colspan='7'>" + this.state.observacao + "</td></tr>";
        
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

    render(){
        return(
            <div>
                <h3 className="text-center">Relatório Ambulatório</h3>
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
                    <label htmlFor="tecnico" className="col-md-1 col-form-label"> Técnico: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" id="tecnico" onChange={this.handleChange} value={this.state.filtros.tecnico} placeholder="Nome do Técnico de Enfermagem"/>
                    </div>
                    <label htmlFor="medico" className="col-md-1 col-form-label"> Médico: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" id="medico" onChange={this.handleChange} value={this.state.filtros.medico} placeholder="Nome do Médico"/>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-5">

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
                            <div className="spinner-border d-none text-center" id="spinnerAmbulatorio" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="col-md-12 d-none" id="tabelaAmbulatorio">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col"> Registro </th>
                                    <th scope="col"> Prescrição </th>
                                    <th scope="col"> Paciente </th>
                                    <th scope="col"> Data e Hora </th>
                                    <th scope="col"> Médico </th>
                                    <th scope="col"> T. Enfermagem. </th>
                                    <th scope="col"> Ver </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.atendimentos.map(
                                    row =>
                                    <tr key={row.prescricao}>
                                        <td> {row.id} </td>
                                        <td> {row.prescricao} </td>
                                        <td> {row.paciente} </td>
                                        <td> {new Date(row.created_at).toLocaleString()}</td>
                                        <td> {row.medico} </td>
                                        <td> {row.tecnico} </td>
                                        <td><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalAmbulatorio" onClick={e => this.verAmbulatorio(e,row)}> Ver </button></td>
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
                    <div className="row">
                        <div className="modal fade" id="modalAmbulatorio" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                                <div className="spinner-border text-center" id="spinnerAmbulatorioVer" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row d-none" id="dadosAmbulatorioVer">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-6 border border-dark">
                                                        <h6 className="text-center">Registro: {this.state.atendimento.id}</h6>
                                                        <h6 className="text-center">Paciente: {this.state.atendimento.paciente}</h6>
                                                        <h6 className="text-center">Médico: {this.state.atendimento.medico}</h6>
                                                        <h6 className="text-center">Data e Hora:{new Date(this.state.atendimento.created_at).toLocaleString()}</h6>
                                                        <h5 className="text-center">Prescrição Médica</h5>
                                                        <div className="table-responsive" id="tabela">
                                                        <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                                                            <thead>
                                                                <tr scope="row">
                                                                    <th scope="col">Quantidade</th>
                                                                    <th scope="col">Prescrição</th>
                                                                    <th scope="col">Posologia</th>
                                                                    <th scope="col">Apresentação</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    this.state.prescricao.map(
                                                                        row => 
                                                                        <tr key={row.idPrescricaoMedicamento}>
                                                                            <td>{row.quantidade}</td>
                                                                            <td>{row.medicamento}</td>
                                                                            <td>{this.getPosologia(row.posologia)}</td>
                                                                            <td>{this.getApresentacao(row.apresentacao)}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    </div>
                                                    <div className="col-md-6 border border-dark">
                                                        <h5 className="text-center">Listagem de Material</h5>
                                                        <h6 className="text-center">Técnico: {this.state.atendimento.medico}</h6>
                                                        <div className="table-responsive" id="tabela">
                                                            <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                                                                <thead>
                                                                    <tr scope="row">
                                                                        <th scope="col">Quantidade</th>
                                                                        <th scope="col">Material</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        this.state.materiais.map(
                                                                            row => 
                                                                            <tr key={row.id}>
                                                                                <td>{row.quantidade}</td>
                                                                                <td>{row.material}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <label htmlFor="observacao" className="col-form-label">Observação</label>
                                                            <textarea className="form-control col-md-12" id="observacao" disabled value={this.state.observacao} placeholder="Observação"></textarea>
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
            </div>
        );
    }
}