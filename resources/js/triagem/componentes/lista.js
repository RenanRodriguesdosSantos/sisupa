import React,{Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import Aceitar from '../../imagens/accept.png';
import { Link } from 'react-router-dom';

export default class Lista extends Component{
    constructor(){
        super();
        this.state = {
            atendimentos: [],
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
        };

        this.api = "/triagem/";
        axios.get(this.api + 'atendimentos/dados/lista')
        .then(response => {
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

        Echo.private('triagem')
        .listen('NovaRecepcao', (response) => {
            this.setState({
                atendimentos: response.atendimentos.data,
                activePage: response.atendimentos.current_page,
                itemsCountPerPage: response.atendimentos.per_page,
                totalItemsCount: response.atendimentos.total
            });
        });
    }

    handlePageChange(pageNumber){
        $("#spinner").removeClass("d-none");
        $("#tabela").addClass("d-none");

        axios.get(this.api + 'atendimentos/dados/lista'+pageNumber)
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
                <h2 className="text-center">Lista de Pacientes para a Triagem</h2>
                <div className="col-md-12 d-none" id="tabela">
                    <div className="table-responsive" >
                        <table className="table table-striped">
                            <thead>
                                <tr scope="row">
                                    <th scope="col" colSpan="3"> Paciente </th>
                                    <th scope="col" colSpan="3"> Mãe </th>
                                    <th scope="col"> Nascimento </th>
                                    <th scope="col"> Bairro</th>
                                    <th scope="col"> Hora </th>
                                    <th scope="col"></th>
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
                                        <td> {new Date(row.created_at).toLocaleTimeString()}</td>
                                        <td><Link  to={"/triagem/atendimento/" + row.id} className="btn btn-primary"><img src={Aceitar}/></Link></td>
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