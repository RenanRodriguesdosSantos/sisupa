import React,{Component} from 'react';
import axios from 'axios';
import {redirect, salvo, cancelarEdicao} from '../../components/mensagens';

export default class Outrosexames extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            nome: "exame",
            descricao: "",
            prioridade: "2"
        };

        this.api = "/consulta/";

        this.handleChage = this.handleChage.bind(this);
        this.handleRadio = this.handleRadio.bind(this);

    }

    handleChage(e){
        this.setState({[e.target.id]: e.target.value});
    }

    handleRadio(e){
        this.setState({prioridade: e.target.value});
    }


    salvar(e){
        e.preventDefault();

        if(!this.state.descricao){
            preencha("descrição dos Exames","#descricaoExames")
        }
        else{
            var exames = {
                nome: this.state.nome,
                descricao: this.state.descricao,
                prioridade: this.state.prioridade,
                medico: this.props.medico,
                consulta: this.props.consulta
            }

            if(!this.state.id){
                axios.post(this.api + "outrosexames/store",exames)
                .then(e => {salvo()})
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.api + "outrosexames/update/"+ this.state.id, exames)
                .then(e => {salvo()})
                .catch(e => redirect(e));
            }
        }
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Outros Exames")
        .then(response =>{
            if(response){
                $(document).ready(function() {
                    this.setState({descricao: ""});
                    var returnForm = $("#returnForm").val();
                    if(returnForm == "imagem"){
                        $("#imagem").modal("toggle");
                    }
                    else{
                        $("#laboratoriais").modal("toggle");
                    }
                    $("#outrosexames").modal("toggle");
                });
            }
        });
    }

    render(){
        return(
            <div>
                <input id="returnForm" type="text" className="d-none"/>
                <div className="modal fade selecionado" id="outrosexames" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-md"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-center" id="headerModal">Outros Exames</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="form-group row">
                                            <label htmlFor="descricao" className="col-form-label col-md-12">Descrição dos Exames: </label>
                                            <div className="col-md-12">
                                                <textarea id="descricao" className="form-control" onChange={this.handleChage} value={this.state.descricao}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <b>Prioridade: </b>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" onChange={this.handleRadio} checked={this.state.prioridade == '1'}/>
                                        <label className="form-check-label" htmlFor="inlineRadio1">Urgência</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" onChange={this.handleRadio} checked={this.state.prioridade == '2'} />
                                        <label className="form-check-label" htmlFor="inlineRadio2">Rotina</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-md-12">
                                        <button id="btnCancelarOutrosExames" type="button" className="btn btn-warning border" onClick={e => this.cancelar(e)}>Cancelar</button>
                                        <button id="btnSalvarOutrosExames" type="button" className="btn btn-primary border" onClick={e => this.salvar(e)}>Salvar</button>
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