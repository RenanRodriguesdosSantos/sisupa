import axios from 'axios';
import React,{Component} from 'react';
import Pagination from 'react-js-pagination';
import { redirect } from '../../../components/mensagens';
import {UpaImg} from '../../../imagens/upa.png';

export default class Triagem extends Component{
    constructor(){
        super();
        this.state ={
            discriminador: [],
            fluxograma: [],
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: {paciente: "", dataInicial: "", dataFinal: "", enfermeiro: "", cor:""},
            atendimentos: [],
            atendimento: {descricao: "", hgt: "", fc: "", saturacao: "", pa: "", tax: "", glasgow: "",peso: "", fluxograma: "", discriminador: "", classificacao: "", enfermeiro: "", paciente: "", enfermeiro: "", data: ""}
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
            $("#tabelaTriagem").addClass("d-none");
            $("#spinnerTriagem").removeClass("d-none");
        });
        axios.post(this.url + "relatorios/triagem",this.state.filtros)
        .then(response => this.closeLoading(response))
        .catch(e =>{
            redirect(e);
        })
    }

    handlePageChange(pageNumber){
        $(document).ready(function(){
            $("#tabelaTriagem").addClass("d-none");
            $("#spinnerTriagem").removeClass("d-none");
        });

        axios.post(this.url + "relatorios/triagem?page="+pageNumber,this.state.filtros)
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
            $("#tabelaTriagem").removeClass("d-none");
            $("#spinnerTriagem").addClass('d-none');
        })
    }

    imprimir(e){
        e.preventDefault();
        var atendimentos = this.state.atendimentos;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='6'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>PACIENTES ATENDIDOS - TRIAGEM</b></td></tr>";
        table = table + "<tr><td colspan='7' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr><td><center><b>Registro</b></center></td><td><center><b>Paciente</b></center></td><td><center><b>Data e Hora</b></center></td><td><center><b>Enfermeiro</b></center></td><td><center><b>Fluxograma</b></center></td><td><center><b>Discriminador</b></center></td><td><center><b>Cor</b></center></td></tr>";
        
        atendimentos.map(e => {
            table = table + "<tr><td><center>"+ e.id + "</center></td><td >" + e.paciente + "</td><td>"+ new Date(e.created_at).toLocaleString() +"</td><td >"+ e.enfermeiro +"<td >"+ e.fluxograma +"</td>"+ "</td><td >"+ e.discriminador +"</td><td >"+ this.getCor(e.cor) +"</td><tr>";
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

    imprimirRow(e){
        e.preventDefault();
        var atendimento = this.state.atendimento;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='6'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='7'><b>PACIENTES ATENDIDOS - TRIAGEM</b></td></tr>";
        table = table + "<tr><td colspan='7' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        
        table += "<tr><td> Registro </td><td colspan='2'>" + atendimento.registro +"</td><td>Data e Hora</td><td colspan='3'>" + new Date(atendimento.data).toLocaleString() +"</td></tr>";
        table += "<tr><td>Paciente</td><td colspan='6'>" + atendimento.paciente + "</td></tr>";
        table += "<tr><td>Enfermeiro</td><td colspan='6'>" + atendimento.enfermeiro + "</td></tr>";
        table += "<tr><td class='center' colspan='7'><h4>Descricação</h4></td></tr>";
        table += "<tr><td colspan='7'>" + atendimento.descricao + "</td></tr>";
        table += "<tr><td class='center' colspan='7'><h4>Classificação de Risco</h4></td></tr>";
        table += "<tr><td>Fluxograma</td><td colspan='6'>" + atendimento.fluxograma + "</td></tr>";
        table += "<tr><td>Discriminador</td><td colspan='6'>" + atendimento.discriminador + "</td></tr>";
        table += "<tr><td>Cor</td><td colspan='6'>" + this.state.classificacao + "</td></tr>";
        table += "<tr><td class='center' colspan='7'><h4>Sinais Vitais</h4></td></tr>";
        table += "<tr><td> Saturação </td><td colspan='2'>" + atendimento.saturacao +"</td><td> Glasgow </td><td colspan='3'>" + atendimento.glasgow +"</td></tr>";
        table += "<tr><td> Temperatura </td><td colspan='2'>" + atendimento.tax +"</td><td> Glicemia </td><td colspan='3'>" + atendimento.hgt +"</td></tr>";
        table += "<tr><td> P. Arterial </td><td colspan='2'>" + atendimento.pa +"</td><td> F. Cardiaca </td><td colspan='3'>" + atendimento.fc +"</td></tr>";
        table += "<tr><td>Peso</td><td colspan='6'>" + atendimento.peso + "</td></tr>";
        
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

    getCor(cor){
        switch (cor) {
            case 1:
                    return "Vermelho"
                break;
            case 2:
                    return "Laranja"
                break;
            case 3:
                    return "Amarelo"
                break;
            case 4:
                    return "Verde"
                break;
            case 5:
                    return "Azul"
                break;
        }
    }
    
    verTriagem(e, row){
        e.preventDefault();
        axios.get(this.url + "relatorios/triagem/dados/"+ row.triagem)
                .then(response => {
                    var atendimento = this.state.atendimento;
                    atendimento.descricao = !response.data.descricao?"":response.data.descricao;
                    atendimento.hgt = !response.data.hgt?"":response.data.hgt;
                    atendimento.fc = !response.data.fc?"":response.data.fc;
                    atendimento.saturacao = !response.data.saturacao?"":response.data.saturacao;
                    atendimento.tax = !response.data.tax?"":response.data.tax;
                    atendimento.pa = !response.data.pa?"":response.data.pa;
                    atendimento.glasgow = !response.data.glasgow?"":response.data.glasgow;
                    atendimento.peso = !response.data.peso?"":response.data.peso;
                    atendimento.classificacao = response.data.classificacao;
                    atendimento.paciente = row.paciente;
                    atendimento.enfermeiro = row.enfermeiro;
                    atendimento.data = row.created_at;
                    atendimento.registro = row.id;

                    this.setState({atendimento: atendimento});
                    console.log(atendimento)
                    axios.get(this.url + "relatorios/classificacao/dados/"+atendimento.classificacao)
                    .then(response => {
                        var atendimento = this.state.atendimento;
                        atendimento.fluxograma = response.data.classificacao.nomeFluxograma;
                        atendimento.discriminador = response.data.classificacao.nomeDiscriminador;
                        this.setState({atendimento: atendimento, "discriminador" : response.data.discriminadores})
                        switch(response.data.classificacao.cor){
                            case 1: 
                                this.setState({cor: '#ff0000',classificacao: "VERMELHO"})
                                break;
                            case 2: 
                                this.setState({cor: '#ff8c00',classificacao: "LARANJA"})
                                break;
                            case 3: 
                                this.setState({cor: '#ffff00',classificacao: "AMARELO"})
                                break;
                            case 4: 
                                this.setState({cor: '#008000',classificacao: "VERDE"})
                                break;
                            case 5: 
                                this.setState({cor: '#0000FF',classificacao: "AZUL"})
                                break;
                        }
                        $("#spinnerTriagemVer").addClass("d-none");
                        $("#dadosTriagemVer").removeClass("d-none");
                    });
                });
    }

    render(){
        return(
            <div>
                <h3 className="text-center">Relatório Triagem</h3>
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
                    <label htmlFor="enfermeiro" className="col-md-1 col-form-label"> Enfermeiro: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" id="enfermeiro" onChange={this.handleChange} value={this.state.filtros.enfermeiro} placeholder="Nome do Enfermeiro"/>
                    </div>
                    <label htmlFor="cor" className="col-md-1 col-form-label"> Cor: </label>
                    <div className="col-md-2">
                        <select className="form-control text-uppercase" id="cor" onChange={this.handleChange} value={this.state.filtros.cor}>
                            <option value="">Selecione</option>
                            <option value="1">Vermelho</option>
                            <option value="2">Laranja</option>
                            <option value="3">Amarelo</option>
                            <option value="4">Verde</option>
                            <option value="5">Azul</option>
                        </select>
                    </div>
                    <div className="col-md-2">
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
                            <div className="spinner-border d-none text-center" id="spinnerTriagem" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="col-md-12 d-none" id="tabelaTriagem">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col"> Registro </th>
                                    <th scope="col"> Paciente </th>
                                    <th scope="col"> Data e Hora </th>
                                    <th scope="col"> Enfermeiro </th>
                                    <th scope="col"> Fluxograma </th>
                                    <th scope="col"> Discriminador </th>
                                    <th scope="col"> Cor </th>
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
                                        <td> {row.enfermeiro} </td>
                                        <td> {row.fluxograma} </td>
                                        <td> {row.discriminador} </td>
                                        <td> {this.getCor(row.cor)} </td>
                                        <td><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalTriagem" onClick={e => this.verTriagem(e,row)}> Ver </button></td>
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
                    <div className="modal fade" id="modalTriagem" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Triagem</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <div className="spinner-border text-center" id="spinnerTriagemVer" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row d-none" id="dadosTriagemVer">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-6 border border-dark">
                                                    <h5 className="text-center">Descrição</h5>
                                                    <div className="form-group row">
                                                        <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                                                        <div className="col-sm-10">
                                                            <textarea rows="4" disabled  value={this.state.atendimento.descricao} disabled className="form-control text-uppercase" id="descricao" placeholder="Queixa/Situação"/>
                                                        </div>
                                                    </div>
                                                    <h5 className="text-center">Sinais Vitais</h5>
                                                    <div className="form-group row">
                                                        <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.saturacao} type="text" className="form-control text-uppercase" id="saturacao" placeholder="Oxigênio"/>
                                                        </div>
                                                        <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.glasgow} type="text" className="form-control text-uppercase" id="glasgow" placeholder="Glasgow"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.tax} type="text" className="form-control text-uppercase" id="tax" placeholder="Tax"/>
                                                        </div>
                                                        <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.hgt} type="text" className="form-control text-uppercase float" id="hgt" placeholder="HGT"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.pa} type="text" className="form-control text-uppercase" id="pa" placeholder="Pressão Arterial"/>
                                                        </div>
                                                        <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.fc} type="text" className="form-control text-uppercase" id="fc" placeholder="FC"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                                                        <div className="col-sm-4">
                                                            <input disabled value={this.state.atendimento.peso} type="text" className="form-control text-uppercase float" id="peso" placeholder="Peso"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 border border-dark">
                                                    <h6 className="text-center">Registro: {this.state.atendimento.registro}</h6>
                                                    <h6 className="text-center">Paciente: {this.state.atendimento.paciente}</h6>
                                                    <h6 className="text-center">Enfermeiro: {this.state.atendimento.enfermeiro}</h6>
                                                    <h6 className="text-center">Data e Hora:{new Date(this.state.atendimento.data).toLocaleString()}</h6>
                                                    <h5 className="text-center">Classificação de Risco</h5>
                                                    <div className="form-group row">
                                                        <label htmlFor="fluxograma" className="col-sm-12 col-form-label text-center"> Fluxograma: </label>
                                                        <div className="col-sm-12">
                                                            <input className="form-control text-uppercase" type="text" id="fluxograma" list="cbFluxograma" disabled value={this.state.atendimento.fluxograma} placeholder="Fluxograma"/>
                                                            <datalist id="cbFluxograma">   
                                                                {
                                                                    this.state.fluxograma.map(
                                                                        row =>
                                                                    <option value={row.nome} key={row.id}></option>
                                                                    )
                                                                }
                                                            </datalist>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="discriminador" className="col-sm-12 col-form-label text-center"> Discriminador: </label>
                                                        <div className="col-sm-12">
                                                            <input className="form-control text-uppercase" disabled type="text" id="discriminador" list="cbDiscriminador" disabled value={this.state.atendimento.discriminador} placeholder="Discriminador"/>
                                                            <datalist id="cbDiscriminador">   
                                                                {
                                                                    this.state.discriminador.map(
                                                                        row =>
                                                                        <option value={row.nome} key={row.id}></option>
                                                                    )
                                                                }
                                                            </datalist>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-md-12 text-center">
                                                            <div className="col-md-12 text-center">
                                                                <div className ="border text-center border-dark rounded p-2 m-0 h5 text-uppercase" style={{background: this.state.cor}}>{this.state.classificacao}</div>
                                                            </div>
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