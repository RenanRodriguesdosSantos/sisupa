import React,{Component} from 'react';
import Edit from "../../imagens/edit.png";
import axios from 'axios';
import { preencha, redirect, salvo, cancelarEdicao } from '../../components/mensagens';

export default class Encaminhamento extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            encaminhamento: {servico: "", entidade: "0", historia: "", exames: "", hd: ""},
            encaminhamentos: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.api = "/consulta/";

    }

    handleChange(e){
        var encaminhamento = this.state.encaminhamento;
        encaminhamento[e.target.id] = e.target.value;
        this.setState({encaminhamento: encaminhamento});
    }

    novaEncaminhamento(e){
        e.preventDefault();
        this.modalEncaminhamento();
    }

    editar(e,row){
        e.preventDefault();

        this.setState({id: row.id, descricao: row.descricao});
        this.modalEncaminhamento();
    }

    salvar(e){
        e.preventDefault();

        var encaminhamento = {
            descricao: this.state.descricao,
            medico: this.props.medico,
            consulta: this.props.consulta,
        }

        if(!encaminhamento.descricao){
            preencha("encaminhamento","#descricao")
        }
        else{
            if(!this.state.id){
                axios.post(this.api + "encaminhamento/store",encaminhamento)
                .then(e => salvo())
                .catch((e) => redirect(e));
            }
            else{
                axios.put(this.api + "encaminhamento/update/"+ this.state.id, encaminhamento)
                .then(e => salvo())
                .catch((e) => redirect(e));
            }
            axios.get(this.api + "encaminhamento/lista/" + this.props.consulta)
            .then(response => {
                this.setState({encaminhamentos: response.data});
            })
            .catch((e) => redirect(e));
            this.setState({descricao: "", id: ""});
            this.modalLista();
        }
    }

    abrirEncaminhamentos(e){
        e.preventDefault();
        axios.get(this.api + "encaminhamento/lista/" + this.props.consulta)
        .then(response => {
            this.setState({encaminhamentos: response.data});
        })
    }
    
    modalLista(){
        $(document).ready(function() {
            $("#listaEncaminhamento").removeClass("d-none");
            $("#btnNovaEncaminhamento").removeClass("d-none");
            $("#novaEncaminhamento").addClass("d-none");
            $("#btnSalvarEncaminhamento").addClass("d-none");
            $("#btnEncaminhamentoCancelar").addClass("d-none");
            $("#btnEncaminhamentoSair").removeClass("d-none");
        })
    }

    modalEncaminhamento(){
        $(document).ready(function() {
            $("#listaEncaminhamento").addClass("d-none");
            $("#btnNovaEncaminhamento").addClass("d-none");
            $("#novaEncaminhamento").removeClass("d-none");
            $("#btnSalvarEncaminhamento").removeClass("d-none");
            $("#btnEncaminhamentoCancelar").removeClass("d-none");
            $("#btnEncaminhamentoSair").addClass("d-none");
        })
    }

    cancelar(e){
        e.preventDefault();
       cancelarEdicao("Encaminhamento")
       .then(response => {
           if(response){
               var encaminhamento = {servico: "", entidade: "0", historia: "", exames: "", hd: ""};
               this.setState({encaminhamento: encaminhamento, id: ""});
               this.modalLista();
           }
       });
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" type="button" onClick={e => this.abrirEncaminhamentos(e)} data-toggle="modal" data-target="#encaminhamentoM">Encaminhamento</button>
                <div className="modal fade selecionado" id="encaminhamentoM" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Encaminhamento Médico</h5>
                                </div>
                            <div className="modal-body">
                                <div className="text-right">
                                    <button id="btnNovaEncaminhamento" className="btn btn-success" onClick={e => this.novaEncaminhamento(e)}>Adcionar Encaminhamento</button>
                                </div>
                                <div id="listaEncaminhamento">
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
                                                    {this.state.encaminhamentos.map(
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
                                <div className="d-none" id="novaEncaminhamento">
                                    <div className="form-group row">
                                        <div className="col-md-6 border border-dark">
                                            <div className="form-group row">
                                                <label htmlFor="servico" className="col-md-12 col-form-label"> Serviço de: </label>
                                                <div className="col-md-12">
                                                    <input onChange={this.handleChange}  value={this.state.encaminhamento.servico} className="form-control text-uppercase" id="servico" placeholder="Tipo de Serviço"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="entidade" className="col-md-12 col-form-label"> Encaminhamento para: </label>
                                                <div className="col-md-12">
                                                    <select onChange={this.handleChange}  value={this.state.encaminhamento.entidade} className="form-control text-uppercase" id="entidade">
                                                        <option value="0">SELECIONE</option>
                                                        <option value="1">UBS</option>
                                                        <option value="2">POLICLÍNICA</option>
                                                        <option value="3">PSF</option>
                                                        <option value="4">HMRG</option>
                                                        <option value="5">CAPS</option>
                                                        <option value="6">HSR</option>
                                                        <option value="7">HBS</option>
                                                        <option value="8">H. FILADÉLFIA</option>
                                                        <option value="9">CVV</option>
                                                        <option value="10">CTA</option>
                                                        <option value="11">OUTROS</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 border border-dark">
                                            <div className="form-group row">
                                                <label htmlFor="historia" className="col-md-12 col-form-label"> HISTORIA CLÍNICA: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.historia} className="form-control text-uppercase" id="historia" placeholder="Historia Clínica"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="exames" className="col-md-12 col-form-label"> Exames Realizados: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.exames} className="form-control text-uppercase" id="exames" placeholder="Exames Realizados"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="hd" className="col-md-12 col-form-label"> HD: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.hd} className="form-control text-uppercase" id="hd" placeholder="HD"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="btnEncaminhamentoSair" data-dismiss="modal">Sair</button>
                                    <button type="button" className="btn btn-warning d-none" id="btnEncaminhamentoCancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvarEncaminhamento" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}