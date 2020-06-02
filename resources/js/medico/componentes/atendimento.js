import React, {Component} from 'react';
import Prescricao from './prescricao';
import Atestado from './atestado';
import Receita from './receita';
import Laboratoriais from './laboratoriais';
import Imagem from './imagem';
import axios from 'axios';
import Triagem from './triagem';
import Encaminhamento from './encaminhamento';
import OutrosExames from './outrosexames';
import {continuarAtender, redirect, salvo} from "../../components/mensagens";

export default class Atendimento extends Component{
    constructor(props){
        super(props);
        this.state ={
            paciente: "",
            atendimento: {id: this.props.match.params.atendimento, consulta: "", sintomas: "", consulta: "", diagnostico: "", cid: "", medico: "",triagem: ""}
        };
        $(document).ready(function(){
            $("#header").addClass("d-none");
        })
        this.api = "/consulta/";

        this.handleChange = this.handleChange.bind(this);

        axios.get("/user")
        .then(response => {
            var atendimento = this.state.atendimento;
            atendimento.medico = response.data.id;
            this.state({atendimento: atendimento});
        })
        .catch((e) => redirect(e));

        axios.get(this.api + "atendimento/dados/"+this.state.atendimento.id)
        .then(response => {
            var atendimento = this.state.atendimento;
            atendimento.consulta = response.data.consulta; 
            atendimento.triagem = response.data.triagem;
            this.setState({atendimento: atendimento, paciente: response.data.nome});
            
            if(response.data.status == 4){
                continuarAtender("consulta");
            }
            else if(response.data.status == 5){
                axios.get(this.api + "atendimento/edit/"+response.data.consulta)
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
                    this.setState({atendimento: atendimento});
                })
                .catch(e => redirect(e));
            }
        })
        .catch(e => redirect(e));
    }

    handleChange(e){
        var atendimento = this.state.atendimento;
        atendimento[e.target.id] = e.target.value;
        this.setState({atendimento: atendimento});
    }

    salvar(e){
        e.preventDefault();
    
        axios.put(this.api + "atendimento/store/" + this.state.atendimento.consulta,this.state.atendimento)
        .then((response) => {
            salvo();
        });
    }

    render(){
        return(
            <div>
                <form className="row" autoComplete="off">
                    <div className="col-md-6"><h5 className="text-center">{this.state.paciente}</h5></div>
                    <div className="col-md-6 text-center">
                        <Triagem triagem={this.state.atendimento.triagem}/>
                    </div>
                    <div className="col-md-6 border border-dark">
                        <h5 className="text-center">Laudo Técnico e Justificativa de Atendimento</h5>
                        <div className="form-group row ">
                            <label htmlFor="sintomas" className="col-md-12 col-form-label"> Principais Sinais de Sintomas Clínicos: </label>
                            <div className="col-md-12">
                                <textarea rows="4" onChange={this.handleChange}  value={this.state.atendimento.sintomas} className="form-control text-uppercase" id="sintomas" placeholder="Principais Sinais de Sintomas Clínicos"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="provadiagnostico" className="col-md-12 col-form-label"> Principais Resultados de Provas Diagnósticas: </label>
                            <div className="col-md-12">
                                <textarea rows="3" onChange={this.handleChange}  value={this.state.atendimento.provadiagnostico} className="form-control text-uppercase" id="provadiagnostico" placeholder="Principais Resultados de Provas Diagnóstcas"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="conduta" className="col-md-12 col-form-label"> Conduta Terapeutica: </label>
                            <div className="col-md-12">
                                <textarea rows="3" onChange={this.handleChange}  value={this.state.atendimento.conduta} className="form-control text-uppercase" id="conduta" placeholder="Conduta Terapeutica"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 border border-dark">
                        <div className="form-group row">
                            <label htmlFor="diagnostico" className="col-md-12 col-form-label"> Diagnóstico Inicial: </label>
                            <div className="col-md-12">
                                <input onChange={this.handleChange}  value={this.state.atendimento.diagnostico} className="form-control text-uppercase" id="diagnostico" placeholder="Diagnóstico Inicial"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="cid" className="col-md-12 col-form-label"> CID: </label>
                            <div className="col-md-12">
                                <input onChange={this.handleChange}  value={this.state.atendimento.cid} className="form-control text-uppercase" id="cid" placeholder="CID"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="encaminhamento" className="col-md-12 col-form-label"> Encaminhamento: </label>
                            <div className="col-md-12">
                                <select onChange={this.handleChange}  value={this.state.atendimento.encaminhamento} className="form-control text-uppercase" id="encaminhamento">
                                    <option value="0">Selecione</option>
                                    <option value="1">Para Serviço mais Complexo</option>
                                    <option value="2">Observação Hospitalar</option>
                                    <option value="3">Ambulátorio Rede Pública</option>
                                    <option value="4">Internção</option>
                                    <option value="5">Retorno</option>
                                    <option value="6">Alta</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-4 p-0 border"><Prescricao consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><Receita consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><Laboratoriais consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><Imagem consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><Atestado consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><Encaminhamento consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                            <div className="col-md-4 p-0 border"><OutrosExames consulta={this.state.atendimento.consulta} medico={this.state.atendimento.medico} /></div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-12 text-center">
                                <button className="btn btn-warning col-md-5 m-3" onClick={e => cancelar(e)}> Cancelar </button>
                                <button className="btn btn-primary col-md-5 m-3" onClick={e => this.salvar(e)}> Salvar </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}