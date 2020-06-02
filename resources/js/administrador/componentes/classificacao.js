import React,{Component} from 'react';
import axios from 'axios';
import { redirect, preencha, salvo } from '../../components/mensagens';

export default class Classificacao extends Component{
    constructor(){
        super();
        this.state = {
            idFluxograma: "",
            idDiscriminador: "",
            fluxogramas: [], 
            discriminadores: [], 
            cor: "1", 
            fluxograma: "", 
            discriminador: "", 
            fluxogramaD: "", 
            discriminadorF: "",
        }
        this.url = "/administrador/";
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.preencher();

        $(document).ready(function(){
            $('.nome').mask('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',{translation: {
                'a': {pattern: /[a-zA-Z ]/}
              }});
        });
    }

    handleChange(e){
        e.preventDefault();
        var campo = e.target.id;
        var valor = e.target.value.toUpperCase();
        this.setState({[campo]: valor});
    }

    handleSelect(e){
        e.preventDefault();
        var campo = e.target.id;
        var valor = e.target.value;
        this.setState({[campo]: valor});
        if(campo == 'idFluxograma'){
            var fluxogramas = this.state.fluxogramas;
            for(var i = 0; i < fluxogramas.length; i++){
                if(fluxogramas[i].id == valor){
                    this.setState({fluxograma: fluxogramas[i].nome});
                    break;
                }
            }
        }
        else{
            var discriminadores = this.state.discriminadores;
            for(var i = 0; i < discriminadores.length; i++){
                if(discriminadores[i].id == valor){
                    this.setState({discriminador: discriminadores[i].nome});
                    break;
                }
            }
        }
        valor = e.target.value.toUpperCase();
        this.setState({[campo]: valor});
    }

    editarFluxogramas(e){
        e.preventDefault();
        $("#idFluxograma").toggleClass("d-none");
        this.setState({['idFluxograma']: ""});
    }

    editarDiscriminadores(e){
        e.preventDefault();
        $("#idDiscriminador").toggleClass('d-none');
        this.setState({['idDiscriminador']: ""});
    }

    preencher(){
        axios.get(this.url + "fluxograma")
        .then(response => {this.setState({fluxogramas: response.data})})
        .catch(e => redirect(e));

        axios.get(this.url + "discriminador")
        .then(response => {this.setState({discriminadores: response.data})})
        .catch(e => redirect(e));
    }

    salvarFluxograma(e){
        e.preventDefault();
        if(!this.state.fluxograma){
            preencha("fluxograma","#fluxograma");
        }
        else{
            var fluxograma = {
                nome: this.state.fluxograma
            }
            if(!this.state.idFluxograma){
                axios.post(this.url + "fluxograma/store",fluxograma)
                .then(e => {
                    salvo();
                    axios.get(this.url + "fluxograma")
                    .then(response => {this.setState({fluxogramas: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.url + "fluxograma/update/"+ this.state.idFluxograma,fluxograma)
                .then(e => {
                    salvo();
                    axios.get(this.url + "fluxograma")
                    .then(response => {this.setState({fluxogramas: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            this.setState({fluxograma: "", idFluxograma: ""});
        }
    }

    salvarDiscriminador(e){
        e.preventDefault();
        
        if(!this.state.discriminador){
            preencha("discriminador","#discriminador");
        }
        else{
            var discriminador = {
                nome: this.state.discriminador
            }
            if(!this.state.idDiscriminador){
                axios.post(this.url + "discriminador/store",discriminador)
                .then(e => {  
                    salvo();
                    axios.get(this.url + "discriminador")
                    .then(response => {this.setState({discriminadores: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.url + "discriminador/update/" + this.state.idDiscriminador ,discriminador)
                .then(e => {  
                    salvo();
                    axios.get(this.url + "discriminador")
                    .then(response => {this.setState({discriminadores: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            this.setState({discriminador: "", idDiscriminador: ""});
        }
    }

    salvarClassificacao(e){
        e.preventDefault();
        var fluxograma = this.state.fluxogramaD;
        var discriminador = this.state.discriminadorF;
        for(var i = 0; i < this.state.fluxogramas.length; i++){
            if(fluxograma == this.state.fluxogramas[i].nome){
                fluxograma = this.state.fluxogramas[i].id;
                break;
            }
        }

        for(var i = 0; i < this.state.discriminadores.length; i++){
            if(discriminador == this.state.discriminadores[i].nome){
                discriminador = this.state.discriminadores[i].id;
                break;
            }
        }

        var fluxogramaDiscriminador ={
            fluxograma: fluxograma,
            discriminador: discriminador,
            cor: this.state.cor
        }
    
        if(typeof fluxogramaDiscriminador.fluxograma === "number" && typeof fluxogramaDiscriminador.discriminador === "number"){
            axios.post(this.url + "classificacao/store",fluxogramaDiscriminador)
            .then(e => {salvo()})
            .catch(e => redirect(e));
            this.setState({fluxogramaD: "", discriminadorF: ""});
        }
        else{
            preencha(" fluxograma e o campo discriminador da classificação","#fluxogramaD");
        }
    }
    render(){
        return(
            <div>
                <form>
                    <h2 className="text-center">Cadastro de Classificação de Risco</h2>
                    <br/>
                    <div className="form-group row ">
                        <div className="col-md-12 text-center">
                            <button className="btn btn-primary col-md-3" onClick={e => this.editarFluxogramas(e)}>Editar Fluxogramas</button>
                            <div className="col-md-10">
                                <select id="idFluxograma" className="d-none form-control" onChange={this.handleSelect} value={this.state.idFluxograma}>   
                                    {
                                        this.state.fluxogramas.map(
                                            row =>
                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="fluxograma" className="col-md-2 col-form-label"> Fluxograma: </label>
                        <div className="col-md-8">
                            <input onChange={this.handleChange} value={this.state.fluxograma} type="text" className="form-control text-uppercase" id="fluxograma" placeholder="Fluxograma"/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary col-md-12" onClick={e => this.salvarFluxograma(e)}>Salvar Fluxograma</button>
                        </div>
                    </div>
                    <div className="form-group row ">
                        <div className="col-md-12 text-center">
                            <button className="btn btn-primary col-md-3" onClick={e => this.editarDiscriminadores(e)}>Editar Discriminadores</button>
                            <div className="col-md-10">
                                <select id="idDiscriminador" className="d-none form-control" onChange={this.handleSelect} value={this.state.idDiscriminador}>   
                                    {
                                        this.state.discriminadores.map(
                                            row =>
                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="discriminador" className="col-md-2 col-form-label"> Discriminador: </label>
                        <div className="col-md-8">
                            <input onChange={this.handleChange} value={this.state.discriminador} type="text" className="form-control text-uppercase" id="discriminador" placeholder="Discriminador"/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary col-md-12" onClick={e => this.salvarDiscriminador(e)}>Salvar Discriminador</button>
                        </div>
                    </div>
                    <div className="border border-dark p-2">
                        <div className="form-group row">
                            <label htmlFor="fluxogramaD" className="col-md-2 col-form-label"> Fluxograma: </label>
                            <div className="col-md-10">
                                <input className="form-control text-uppercase" id="fluxogramaD" list="cbFluxograma" onChange={this.handleChange} value={this.state.fluxogramaD} placeholder="Fluxograma"/>
                                <datalist id="cbFluxograma">   
                                    {
                                        this.state.fluxogramas.map(
                                            row =>
                                            <option value={row.nome} key={row.id}></option>
                                        )
                                    }
                                </datalist>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="discriminadorF" className="col-md-2 col-form-label"> Discriminador: </label>
                            <div className="col-md-10">
                                <input className="form-control text-uppercase" id="discriminadorF" list="cbDiscriminador" onChange={this.handleChange} value={this.state.discriminadorF} placeholder="Discriminador"/>
                                <datalist id="cbDiscriminador">   
                                    {
                                        this.state.discriminadores.map(
                                            row =>
                                            <option value={row.nome} key={row.id}></option>
                                        )
                                    }
                                </datalist>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="cor" className="col-md-2 col-form-label"> Cor: </label>
                            <div className="col-md-10">
                                <select className="form-control custom-select my-1 mr-sm-2" id="cor" placeholder="Cor" onChange={this.handleChange} value={this.state.cor}>
                                    <option value="1">VERMELHO</option>
                                    <option value="2">LARANJA</option>
                                    <option value="3">AMARELO</option>
                                    <option value="4">VERDE</option>
                                    <option value="5">AZUL</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-12 text-right">
                                <button className="btn btn-primary" onClick={e => this.salvarClassificacao(e)}>Salvar Classificação</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}