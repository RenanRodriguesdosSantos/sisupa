import React,{Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';

export default class Atendidos extends Component{
    constructor(){
        super();
        this.state = {
            atendimento: [],
            atendimentos: [],
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: {paciente: "",mae: "",nascimento: "",datainicial: "", datafinal: ""},
            paciente: []
        };
        this.api = "/recepcao/";
        this.handleChange = this.handleChange.bind(this);
        axios.get(this.api + 'atendimento/0/0/0/0/0')
        .then((response) => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
            $("#tabela").removeClass("d-none");
            $("#spinner").addClass("d-none");
        })
        .catch((e) => this.redirectToHome(e));

        $(document).ready(function(){
            $('.nome').mask('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',{translation: {
                'a': {pattern: /[a-zA-Z ]/}
              }});
        });
    }
    
    buscar(e){
        e.preventDefault();
        $("#spinner").removeClass("d-none");
        $("#tabela").addClass("d-none");

        var filtros = {paciente: this.state.filtros.paciente,mae: this.state.filtros.mae,nascimento: this.state.filtros.nascimento,datainicial: this.state.filtros.datainicial,datafinal: this.state.filtros.datafinal};
        filtros.paciente = !filtros.paciente?"0":filtros.paciente.trim();
        filtros.mae = !filtros.mae?"0":filtros.mae.trim();
        filtros.nascimento = !filtros.nascimento?"0":filtros.nascimento;
        filtros.datainicial = !filtros.datainicial?"0":filtros.datainicial;
        filtros.datafinal = !filtros.datafinal?"0":filtros.datafinal;

        axios.get(this.api + 'atendimento/'+filtros.paciente+"/"+filtros.mae+"/"+filtros.nascimento + "/" + filtros.datainicial + "/" + filtros.datafinal)
        .then((response) => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
            $("#spinner").addClass("d-none");
            $("#tabela").removeClass("d-none");
        })
        //.catch((e) => this.redirectToHome(e));    
    }

    handleChange(e){
        var filtros = this.state.filtros;
        var valor = e.target.value;
        valor = valor.toUpperCase();
        valor = valor.replace(/\s{1,20}/g," ");
        var campo = e.target.id;
        filtros[campo] = valor;

        this.setState({
            filtros: filtros
        });
    }

    handlePageChange(pageNumber){
        $("#spinner").removeClass("d-none");
        $("#tabela").addClass("d-none");

        var filtros = {paciente: this.state.filtros.paciente,mae: this.state.filtros.mae,nascimento: this.state.filtros.nascimento,datainicial: this.state.filtros.datainicial,datafinal: this.state.filtros.datafinal};
        filtros.paciente = !filtros.paciente?"0":filtros.paciente;
        filtros.mae = !filtros.mae?"0":filtros.mae;
        filtros.nascimento = !filtros.nascimento?"0":filtros.nascimento;
        filtros.datainicial = !filtros.datainicial?"0":filtros.datainicial;
        filtros.datafinal = !filtros.datafinal?"0":filtros.datafinal;

        axios.get(this.api + 'atendimento/'+filtros.paciente+"/"+filtros.mae+"/"+filtros.nascimento + "/" + filtros.datainicial + "/" + filtros.datafinal + "?page="+pageNumber)
        .then((response)=>{
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            });
            $("#spinner").addClass("d-none");
            $("#tabela").removeClass("d-none");
        })
        .catch((e) => this.redirectToHome(e));
    }

    redirectToHome(e){
        if (e.response || e.request) {
            alert("OCORREU UM ERRO DE CONEXÃO \n Você será redirecionado à página HOME!\nStatus do Erro" + e.response.status );
            window.location.replace("/");
        } 
    }

    render(){
        return(
            <div>
                <h2 className="text-center">PACIENTES ATENDIDOS</h2>
                <br/><br/>
                <div  className="form-group row">
                    <div className="col-md-7">
                        <div className="form-group row">
                            <label htmlFor="paciente" className="col-sm-2 col-form-label "> Paciente: </label>
                            <div className="col-sm-10">
                                <input onChange={this.handleChange} value={this.state.filtros.paciente} type="text" className="form-control text-uppercase nome" id="paciente" placeholder="Nome do paciente"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="mae" className="col-sm-2 col-form-label"> Mãe: </label>
                            <div className="col-sm-10">
                                <input onChange={this.handleChange} value={this.state.filtros.mae} type="text" className="form-control text-uppercase nome" id="mae" placeholder="Nome da mãe"/>
                            </div>
                        </div>
                        <div className="form-group row align-text-middle">
                            <label htmlFor="datainicial" className="col-sm-2 col-form-label">Entre: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.filtros.datainicial} type="date" className="form-control" id="datainicial" />
                            </div>
                            E
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.filtros.datafinal} type="date" className="form-control" id="datafinal" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group row">
                            <label htmlFor="nascimento" className="col-sm-3 col-form-label"> Nascimento: </label>
                            <div className="col-sm-7">
                                <input onChange={this.handleChange} value={this.state.filtros.nascimento} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                            </div>
                        </div>
                        <br/><br/>
                        <div className="form-group row">
                            <div className="col-12 text-center">
                                <button className="btn btn-primary col-md-7" onClick={e => this.buscar(e)}>Buscar</button>
                            </div>
                        </div>
                    </div>
                </div> 
                <center>
                    <div className="spinner-border " id="spinner" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </center>
                <br/>
                <div className="col-md-12 d-none" id="tabela">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col" colSpan="3"> Paciente </th>
                                    <th scope="col" colSpan="3"> Mãe </th>
                                    <th scope="col"> Nascimento </th>
                                    <th scope="col">Bairro</th>
                                    <th scope="col">Município</th>
                                    <th scope="col"> Data e Hora </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.atendimentos.map(
                                    row =>
                                    <tr key= {row.id}>
                                        <td colSpan="3"> {row.paciente} </td>
                                        <td colSpan="3"> {row.mae} </td>
                                        <td> {new Date(row.nascimento).toLocaleDateString()} </td>
                                        <td> {row.bairro} </td>
                                        <td> {row.municipio}-{row.uf} </td>
                                        <td> {new Date(row.created_at).toLocaleString()}</td>
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