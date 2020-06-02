import React,{Component} from 'react';
import axios from 'axios';
import { redirect, continuarAtender, preencha, salvo } from '../../components/mensagens';

export default class Atendimento extends Component{
    constructor(props){
        super(props);
        this.state = {
            cor: "",
            classificacao: "Cor",
            fluxograma: [], 
            discriminador: [],
            paciente: "",
            atendimento: {id: this.props.match.params.atendimento,descricao: "", hgt: "", fc: "", saturacao: "", pa: "", tax: "", glasgow: "",peso: "", fluxograma: "", discriminador: "", classificacao: "", enfermeiro: ""}
        };

        $(document).ready(function(){
            $('.nome').mask('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',{translation: {
                'a': {pattern: /[a-zA-Z ]/}
              }});
            $('#pa').mask('000X000');
            $('#saturacao').mask('000');
            $('#fc').mask('000');
            $('#glasgow').mask("00");
            $('#tax').mask("##.00");
            $('.float').mask("##0.00", {reverse: true});
        });
        
        this.api = "/triagem/";
        this.handleChange = this.handleChange.bind(this);
        this.preencherFluxograma();

        axios.get("/user")
        .then(response => {
            var atendimento = this.state.atendimento;
            atendimento.enfermeiro = response.data.id;
            this.setState({atendimento: atendimento})
        })
        .catch(e => {redirect(e)});

        axios.get(this.api + "atendimento/dados/" + this.state.atendimento.id)
        .then(response => {
            var atendimento = this.state.atendimento;
            atendimento.triagem = response.data.triagem;
            this.setState({paciente: response.data.nome, atendimento: atendimento});

            if(response.data.status == 2){
                continuarAtender("triagem");
            }

            else if(response.data.status == 3){
                axios.get(this.api + "atendimento/edit/"+response.data.triagem)
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

                    this.setState({atendimento: atendimento});

                    axios.get(this.api + "atendimento/classificacao/edit/"+atendimento.classificacao)
                    .then(response => {
                        var atendimento = this.state.atendimento;
                        atendimento.fluxograma = response.data.classificacao.nomeFluxograma;
                        atendimento.discriminador = response.data.classificacao.nomeDiscriminador;
                        this.setState({atendimento: atendimento, "discriminador" : response.data.discriminadores})
                        $(document).ready(function() {
                            $('#discriminador').prop('disabled',false);
                        });
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
                    })
                    .catch(e => {redirect(e)});
                });
            }
        })
        .catch(e =>{ redirect(e)});

    }
    
    handleChange(e){
        var atendimento = this.state.atendimento;
        var valor = e.target.value;
        var campo = e.target.id;
        atendimento[campo] = valor.toUpperCase();
        this.setState({atendimento: atendimento});
    }

    preencherFluxograma(){ // Busca no Banco os dados para preenchimento do ComboBox Fluxograma;
        axios.get(this.api + "fluxograma")
        .then(response => {this.setState({fluxograma: response.data})})
        .catch(e =>{ redirect(e)});
    }

    //obtem o código do fluxograma e preenche o combobox do discriminador
    fluxograma(e){
        $(document).ready(function() {
            $('#discriminador').prop('disabled',true);
            $('#discriminador').val('');
        });
        this.setState({classificacao: 'Cor', cor: '#ffffff'});
        var fluxograma = e.target.value;
        var atendimento = this.state.atendimento;
        atendimento.discriminador = "";
        atendimento.fluxograma = fluxograma;
        this.setState({atendimento: atendimento});

        for(var i = 0; i < this.state.fluxograma.length; i++){
            if(fluxograma == this.state.fluxograma[i].nome){
                fluxograma = this.state.fluxograma[i].id;
                break;
            }
        }
        if(typeof fluxograma === "number"){
            axios.get(this.api + "discriminador/"+fluxograma)
            .then((response) => {
                this.setState({discriminador: response.data});
                $(document).ready(function(){
                    $('#discriminador').prop('disabled',false);
                });
            })
            .catch(e =>{ redirect(e)});
        }
    }

    //obtem o código da classificação
    discriminador(e){
        var atendimento = this.state.atendimento;
        atendimento.discriminador = e.target.value;
        this.setState({atendimento: atendimento});
        for(var i = 0; i < this.state.discriminador.length; i++){
            if(e.target.value == this.state.discriminador[i].nome){
                atendimento.classificacao = this.state.discriminador[i].id;
                atendimento.discriminador = e.target.value;
                this.setState({atendimento: atendimento});
                switch(this.state.discriminador[i].cor){
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
                break;
            }
            else{
                atendimento.classificacao = "";
                this.setState({atendimento: atendimento});
            }
        }
    }

    salvar(e){
        e.preventDefault();
        if(!this.state.atendimento.descricao){
            preencha("descrição","#descricao")
        }
        else if(!this.state.atendimento.classificacao){
            preencha("fluxograma e o campo discrimindaor","#fluxograma");
        }
        else{
            axios.put(this.api + "atendimento/store/" + this.state.atendimento.triagem,this.state.atendimento)
            .then((response)=>{
                salvo();
                window.location.replace("/triagem/lista");
            })
            .catch(e =>{ redirect(e)});
        }
    }

    render(){
        return(
            <div>
                <h2 className="text-center">Atendimento da Triagem</h2>
                <form className="row" autoComplete="off">
                    <div className="col-md-6 border border-dark">
                        <h5 className="text-center">Descrição</h5>
                        <div className="form-group row">
                            <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                            <div className="col-sm-10">
                                <textarea rows="4" onChange={this.handleChange}  value={this.state.atendimento.descricao} className="form-control text-uppercase" id="descricao" placeholder="Queixa/Situação"/>
                            </div>
                        </div>
                        <h5 className="text-center">Sinais Vitais</h5>
                        <div className="form-group row">
                            <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.saturacao} type="text" className="form-control text-uppercase" id="saturacao" placeholder="Oxigênio"/>
                            </div>
                            <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.glasgow} type="text" className="form-control text-uppercase" id="glasgow" placeholder="Glasgow"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.tax} type="text" className="form-control text-uppercase" id="tax" placeholder="Tax"/>
                            </div>
                            <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.hgt} type="text" className="form-control text-uppercase float" id="hgt" placeholder="HGT"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.pa} type="text" className="form-control text-uppercase" id="pa" placeholder="Pressão Arterial"/>
                            </div>
                            <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.fc} type="text" className="form-control text-uppercase" id="fc" placeholder="FC"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                            <div className="col-sm-4">
                                <input onChange={this.handleChange} value={this.state.atendimento.peso} type="text" className="form-control text-uppercase float" id="peso" placeholder="Peso"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 border border-dark">
                        <h5 className="text-center">{this.state.paciente}</h5>
                        <br/><br/>
                        <h5 className="text-center">Classificação de Risco</h5>
                        <div className="form-group row">
                            <label htmlFor="fluxograma" className="col-sm-12 col-form-label text-center"> Fluxograma: </label>
                            <div className="col-sm-12">
                                <input className="form-control text-uppercase" type="text" id="fluxograma" list="cbFluxograma" onChange={e => this.fluxograma(e)} value={this.state.atendimento.fluxograma} placeholder="Fluxograma"/>
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
                                <input className="form-control text-uppercase" disabled type="text" id="discriminador" list="cbDiscriminador" onChange={e => this.discriminador(e)} value={this.state.atendimento.discriminador} placeholder="Discriminador"/>
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
                        <div className="form-group row">
                            <div  className="col-md-12 text-center mt-1">
                                <button className="btn col-md-3 btn-warning">Cancelar</button>&nbsp;
                                <button className="btn col-md-3 btn-primary" onClick={e => this.salvar(e)} > Salvar </button>&nbsp;
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}