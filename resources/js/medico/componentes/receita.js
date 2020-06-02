import React,{Component} from 'react';
import Edit from "../../imagens/edit.png";
import axios from 'axios';
import { preencha, redirect, salvo } from '../../components/mensagens';

export default class Receita extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            descricao: "",
            receitas: []
        };
        this.handleChage = this.handleChage.bind(this);
        this.api = "/consulta/";

    }


    handleChage(e){
        this.setState({descricao: e.target.value});
    }

    novaReceita(e){
        e.preventDefault();
        this.modalReceita();
    }

    editar(e,row){
        e.preventDefault();

        this.setState({id: row.id, descricao: row.descricao});
        this.modalReceita();
    }

    salvar(e){
        e.preventDefault();

        var receita = {
            descricao: this.state.descricao,
            medico: this.props.medico,
            consulta: this.props.consulta,
        }

        if(!receita.descricao){
            preencha("receita","#descricao")
        }
        else{
            if(!this.state.id){
                axios.post(this.api + "receita/store",receita)
                .then(e => salvo())
                .catch((e) => redirect(e));
            }
            else{
                axios.put(this.api + "receita/update/"+ this.state.id, receita)
                .then(e => salvo())
                .catch((e) => redirect(e));
            }
            axios.get(this.api + "receita/lista/" + this.props.consulta)
            .then(response => {
                this.setState({receitas: response.data});
            })
            .catch((e) => redirect(e));

            this.setState({descricao: "", id: ""});
            this.modalLista();
        }
    }


    abrirReceitas(e){
        e.preventDefault();
        axios.get(this.api + "receita/lista/" + this.props.consulta)
        .then(response => {
            this.setState({receitas: response.data});
        })
        .catch((e) => redirect(e));
    }
    
    modalLista(){
        $(document).ready(function () {
            $("#listaReceita").removeClass("d-none");
            $("#btnNovaReceita").removeClass("d-none");
            $("#novaReceita").addClass("d-none");
            $("#btnSalvarReceita").addClass("d-none");
            $("#btnReceitaCancelar").addClass("d-none");
            $("#btnReceitaSair").removeClass("d-none");
        });
    }

    modalReceita(){
        $(document).ready(function () {
            $("#listaReceita").addClass("d-none");
            $("#btnNovaReceita").addClass("d-none");
            $("#novaReceita").removeClass("d-none");
            $("#btnSalvarReceita").removeClass("d-none");
            $("#btnReceitaCancelar").removeClass("d-none");
            $("#btnReceitaSair").addClass("d-none");
        });
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Receita")
        .then(response => {
            if(response){
                this.setState({descricao: "", id: ""});
                this.modalLista();
            }
        });
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" type="button" onClick={e => this.abrirReceitas(e)} data-toggle="modal" data-target="#receita">Receita</button>
                <div className="modal fade selecionado" id="receita" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Receita Médica</h5>
                                </div>
                            <div className="modal-body">
                                <div className="text-right">
                                    <button id="btnNovaReceita" className="btn btn-success" onClick={e => this.novaReceita(e)}>Adcionar Receita</button>
                                </div>
                                <div id="listaReceita">
                                    <div>
                                        <div className="table-responsive" >
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr scope="row">
                                                        <th scope="col"> Data / Hora </th>
                                                        <th scope="col"> Médico </th>
                                                        <th scope="col"> Editar </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.receitas.map(
                                                        row =>
                                                        <tr key= {row.id}>
                                                            <td> {new Date(row.updated_at).toLocaleString()}</td>
                                                            <td> {row.medico} </td>
                                                            <td><button type="button" className="btn btn-warning" onClick={e => this.editar(e, row)}><img src={Edit} /></button></td>
                                                        </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-none" id="novaReceita">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <textarea className="form-control" rows="10" onChange={this.handleChage} value={this.state.descricao}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="btnReceitaSair" data-dismiss="modal">Sair</button>
                                    <button type="button" className="btn btn-warning d-none" id="btnReceitaCancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvarReceita" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}