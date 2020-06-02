import React,{Component} from 'react';
import axios from 'axios';
import {redirect, salvo} from '../../components/mensagens';

export default class Atestado extends Component{
    constructor(props){
        super(props);
        this.state = {
            tipoAtividadesAtestado: "",
            tempoAtestado: "",
            cid: "",
        };

        this.api = "/consulta/";

        this.handleChage = this.handleChage.bind(this);
    }

    handleChage(e){
        this.setState({[e.target.id]: e.target.value});
    }

    salvar(e){
        e.preventDefault();

        if(!this.state.tempoAtestado){
            preencha("tempo de atestado","#tempoAtestado")
        }
        else if(!this.state.tipoAtividadesAtestado){
            preencha("tipo de atividade","#tipoAtividade")
        }
        else{
            var atestado = {
                tempoAtestado: this.state.tempoAtestado,
                tipoAtividadesAtestado: this.state.tipoAtividadesAtestado,
                cid: this.state.cid,
                medico: this.props.medico,
                consulta: this.props.consulta
            }
            if(!this.state.id){
                axios.post(this.api + "atestado/store",atestado)
                .then(e => {salvo()})
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.api + "atestado/update/"+ this.state.id, atestado)
                .then(e => {salvo()})
                .catch(e => redirect(e));
            }
        }
    }

    abrir(e){
        e.preventDefault();
        axios.get(this.api + "atestado/edit/" + this.props.consulta)
        .then(response =>{
            this.setState({
                id: response.data.id?response.data.id:"",
                tipoAtividadesAtestado: response.data.tipoAtividadesAtestado?response.data.tipoAtividadesAtestado:"",
                tempoAtestado: response.data.tempoAtestado?response.data.tempoAtestado:"",
                cid: response.data.cid?response.data.cid:""
            });
        })
        .catch(e => redirect(e));
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" onClick={e => this.abrir(e)} type="button" data-toggle="modal" data-target="#atestado">Atestado</button>
                <div className="modal fade selecionado" id="atestado" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-md"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Atestado Médico</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="form-group row">
                                            <label htmlFor="tipoAtividadeAtestado" className="col-form-label col-md-4">Tipo de Atividades: </label>
                                            <div className="col-md-8">
                                                <select id="tipoAtividadesAtestado" className="form-control" onChange={this.handleChage} value={this.state.tipoAtividadesAtestado}>
                                                    <option value="0">SELECIONE</option>
                                                    <option value="1">LABORAIS</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="tempoAtestado" className="col-form-label col-md-4">Duração: </label>
                                            <div className="col-md-8">
                                                <input id="tempoAtestado" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.tempoAtestado} placeholder="Duração do Atestado"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="cid" className="col-form-label col-md-4">Cid: </label>
                                            <div className="col-md-8">
                                                <input id="cid" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.cid} placeholder="CID"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="button" className="btn btn-warning border" id="cancelar" data-dismiss="modal">Cancelar</button>
                                        <button id="btnSalvar" type="button" className="btn btn-primary border" onClick={e => this.salvar(e)}>Atestado de Comparecimento</button>
                                        <button id="btnSalvar" type="button" className="btn btn-primary border" onClick={e => this.salvar(e)}>Salvar Atestado</button>
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