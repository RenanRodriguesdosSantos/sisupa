import axios from 'axios';
import React,{Component} from 'react';
import Pagination from 'react-js-pagination';
import { redirect } from '../../../components/mensagens';
import {UpaImg} from '../../../imagens/upa.png';

export default class Geral extends Component{
    constructor(){
        super();
        this.state ={
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: {paciente: "", dataInicial: "", dataFinal: "", recepcionista: "", enfermeiro: "", medico: ""},
            atendimentos: []
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
            $("#tabela").addClass("d-none");
            $("#spinner").removeClass("d-none");
        });
        axios.post(this.url + "relatorios",this.state.filtros)
        .then(response => this.closeLoading(response))
        .catch(e =>{
            redirect(e);
        })
    }

    handlePageChange(pageNumber){
        $(document).ready(function(){
            $("#tabela").addClass("d-none");
            $("#spinner").removeClass("d-none");
        });

        axios.post(this.url + "relatorios?page="+pageNumber,this.state.filtros)
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
            $("#tabela").removeClass("d-none");
            $("#spinner").addClass('d-none');
        })
    }

    imprimir(e){
        e.preventDefault();
        var atendimentos = this.state.atendimentos;
        var table = "<table><tr class='center'><td><img id='imagem' src='http://sisupa.com.br/images/upa.png'></td><td colspan='5'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='6'><b>PACIENTES ATENDIDOS</b></td></tr>";
        table = table + "<tr><td colspan='6' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr><td><center><b>Registro</b></center></td><td><center><b>Paciente</b></center></td><td><center><b>Data e Hora</b></center></td><td><center><b>Recepcionista</b></center></td><td><center><b>Enfermeiro</b></center></td><td><center><b>Médico</b></center></td></tr>";
        
        atendimentos.map(e => {
            table = table + "<tr><td><center>"+ e.id + "</center></td><td >" + e.paciente + "</td><td>"+ new Date(e.created_at).toLocaleString() +"</td><td >"+ e.recepcionista +"<td >"+ e.enfermeiro +"</td>"+ "</td><td >"+ e.medico +"</td><tr>";
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
    
    render(){
        return(
            <div>
                <h3 className="text-center">Relatório Geral</h3>
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
                    <label htmlFor="recepcionista" className="col-md-1 col-form-label"> Recep.: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" onChange={this.handleChange} value={this.state.filtros.recepcionista} id="recepcionista" placeholder="Nome do Recepcionista"/>
                    </div>
                    <label htmlFor="enfermeiro" className="col-md-1 col-form-label"> Enfermeiro: </label>
                    <div className="col-md-4">
                        <input type="text" className="form-control text-uppercase" id="enfermeiro" onChange={this.handleChange} value={this.state.filtros.enfermeiro} placeholder="Nome do Enfermeiro"/>
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
                            <div className="spinner-border d-none text-center" id="spinner" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="col-md-12 d-none" id="tabela">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col"> Registro </th>
                                    <th scope="col"> Paciente </th>
                                    <th scope="col"> Data e Hora </th>
                                    <th scope="col"> Recepcionista </th>
                                    <th scope="col"> Enfermeiro </th>
                                    <th scope="col"> Médico </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.atendimentos.map(
                                    row =>
                                    <tr key={row.id}>
                                        <td> {row.id} </td>
                                        <td> {row.paciente} </td>
                                        <td> {new Date(row.created_at).toLocaleString()}</td>
                                        <td> {row.recepcionista} </td>
                                        <td> {row.enfermeiro} </td>
                                        <td> {row.medico} </td>
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
            </div>
        );
    }
}