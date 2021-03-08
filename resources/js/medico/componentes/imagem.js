import React,{Component} from 'react';
import {cancelarEdicao, preencha, selecioneExame, salvo, redirect} from '../../components/mensagens';
import axios from 'axios';

export default class Imagem extends Component{
    constructor(){
        super();
        this.state = {
            exames: [false,false,false,false],
            descricao: ["","","",""],
            disabled: [false,false,false,false],
            prioridade: "2"
        };
        this.api = "/consulta/";
        this.handleChage = this.handleChage.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        $(document).ready(function () {
            $("#btn-imagem").attr("disabled", true);
        });
    }

    handleSelect(e){
        var exames  = this.state.exames;
        var campo = e.target.id;
        campo = campo.substring(9,10);
        var value = e.target.checked;
        exames[campo] = value;
        this.setState({exames: exames});
        if(campo != 3){
            if(value){
                $(document).ready(function() {
                    $("#descricao" + campo).removeClass("d-none");
                });
            }
            else{
                $(document).ready(function() {
                    $("#descricao" + campo).addClass("d-none");
                });
                var descricao = this.state.descricao;
                descricao[campo] = "";
                this.setState({descricao: descricao});
            }
        }
    }

    handleRadio(e){
        this.setState({prioridade: e.target.value});
    }

    handleChage(e){
        e.preventDefault();
        var descricao  = this.state.descricao;
        var campo = e.target.id;
        campo = campo.substring(14,15);
        var value = e.target.value;
        descricao[campo] = value;
        this.setState({descricao: descricao});
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Exames de Imagem")
        .then(response => {
            if(response){
                var exames = this.state.exames;
                var descricao = this.state.descricao;

                for(var i = 0; i < 3; i++){
                    exames[i] = false;
                    descricao[i] = "";
                }

                exames[3] = false;

                this.setState({exames: exames, descricao: descricao, prioridade: "2"});
                $(document).ready(function() {
                    $("#imagem").modal("toggle");
                });
            }
        });
    }

    abrir(e){
        e.preventDefault();
        axios.get(this.api + "examesimagem/edit/"+ this.props.consulta)
        .then(response => {
            var exames = this.state.exames;
            var descricao = this.state.descricao;
            var disabled = this.state.disabled;
            response.data.map(row =>{
                switch (row.exame) {
                    case 1:
                            exames[0] = true;
                            descricao[0] = row.descricao;
                            disabled[0] = true;
                            $(document).ready(function() {
                                $("#descricao0").removeClass("d-none");
                            });
                        break;
                    case 2:
                                exames[1] = true;
                                descricao[1] = row.descricao;
                                disabled[1] = true;
                                $(document).ready(function() {
                                    $("#descricao1").removeClass("d-none");
                                });
                        break;
                    case 3:
                            exames[2] = true;
                            descricao[2] = row.descricao;
                            disabled[2] = true;
                            $(document).ready(function() {
                                $("#descricao2").removeClass("d-none");
                            });
                        break;
                    case 4:
                            exames[3] = true;
                            disabled[3] = true;
                        break;
                }
            });
            this.setState({exames: exames, descricao: descricao ,disabled: disabled});
        })
        .catch(e => redirect(e));
    }

    salvar(e){
        e.preventDefault();

        var exames = this.state.exames;
        var descricao = this.state.descricao;

        if(exames[0] && !descricao[0]){
            preencha("descrição do Raio-X","#descricaoExame0");
        }
        else if(exames[1] && !descricao[1]){
            preencha("descrição da Tomografia Computadorizada","#descricaoExame1");
        }
        else if(exames[2] && !descricao[2]){
            preencha("descrição da Utrassonografia","#descricaoExame2");
        }
        else{
            var selecionado = false;
            for(var i = 0; i < 4; i++){
                if(exames[i]){
                    selecionado = true;
                }
            }

            if(selecionado){
                console.log(descricao)
                var parametros = {exames: exames, descricao: descricao, medico: $("#userId").val(), consulta: this.props.consulta, prioridade: this.state.prioridade};
                axios.post(this.api + "examesimagem/store",parametros)
                .then(e => {salvo(); $("#imagem").modal("toggle");})
                .catch(e =>{redirect(e)});
            }
            else{
                selecioneExame();
            }
        }
    }

    outrosExames(e){
        e.preventDefault();
        $(document).ready(function () {
            $("#returnForm").val("imagem");
            $("#imagem").modal("toggle");
            $("#outrosexames").modal("toggle");
        });
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" type="button" id="btn-imagem" data-toggle="modal" data-target="#imagem" onClick={e => this.abrir(e)}>Exames de Imagem</button>
                <div className="modal fade" id="imagem" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-center" id="headerModal">Solicitação de Exames de Imagem</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ExmImagem0" onChange={this.handleSelect} checked={this.state.exames[0]} disabled={this.state.disabled[0]}/>
                                            <label className="form-check-label" htmlFor="ExmImagem0">
                                                Raio X
                                            </label>
                                            <div className="d-none" id="descricao0">
                                                <textarea className="form-control text-uppercase" id="descricaoExame0" placeholder="Descricão do Raio-X" onChange={this.handleChage} value={this.state.descricao[0]}></textarea>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ExmImagem1" onChange={this.handleSelect} checked={this.state.exames[1]} disabled={this.state.disabled[1]}/>
                                            <label className="form-check-label" htmlFor="ExmImagem1">
                                                Tomografia Computadorizada
                                            </label>
                                            <div className="d-none" id="descricao1">
                                                <textarea className="form-control text-uppercase" id="descricaoExame1" placeholder="Descricão da Tomografia Computadorizada" onChange={this.handleChage} value={this.state.descricao[1]} ></textarea>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ExmImagem2" onChange={this.handleSelect} checked={this.state.exames[2]} disabled={this.state.disabled[2]}/>
                                            <label className="form-check-label" htmlFor="ExmImagem2">
                                                Ultrassonografia
                                            </label>
                                            <div className="d-none" id="descricao2">
                                                <textarea className="form-control text-uppercase" id="descricaoExame2" placeholder="Descricão da Ultrassonografia" onChange={this.handleChage} value={this.state.descricao[2]}></textarea>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="ExmImagem3" onChange={this.handleSelect} checked={this.state.exames[3]} disabled={this.state.disabled[3]}/>
                                            <label className="form-check-label" htmlFor="ExmImagem3">
                                                Eletrocardiograma
                                            </label>
                                        </div>
                                        <hr/>
                                        <div className="col-md-12 text-center">
                                            <button className="btn btn-success" onClick={e => this.outrosExames(e)}>Outros Exames</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12 text-center">
                                        <b>Prioridade: </b>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" onChange={this.handleRadio} checked={this.state.prioridade == 1}/>
                                            <label className="form-check-label" htmlFor="inlineRadio1">Urgência</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" onChange={this.handleRadio} checked={this.state.prioridade == 2} />
                                            <label className="form-check-label" htmlFor="inlineRadio2">Rotina</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-warning" id="cancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                <button id="btnSalvar" type="button" className="btn btn-primary" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}