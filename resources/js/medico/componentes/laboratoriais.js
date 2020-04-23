import React,{Component} from 'react';

export default class Laboratoriais extends Component{
    constructor(){
        super();
        this.state = {
            exames: [
                false,false,false,false,false,false,false,false,false,false,
                false,false,false,false,false,false,false,false,false,false,
                false,false,false,false,false,false,false,false,false,false
            ]
        };
        this.handleChage = this.handleChage.bind(this);
    }

    handleChage(e){
        var exames  = this.state.exames;
        exames[e.target.id] = e.target.checked;
        this.setState({exames: exames});
    }

    adicionar(e){
        e.preventDefault();
        var item = this.state.item;
        if(!item.prescricao){
            alert("Informe uma Prescrição");
        }
        else{
            var prescricao = this.state.prescricao;
            item.id = prescricao.length + 1;
            prescricao.push(item);
            this.setState({prescricao: prescricao,item: {id: "",quantidade: "", prescricao: "", apresentacao: ""}});
        }
    }

    cancelItem(e,id){
        e.preventDefault();
        var prescricao = this.state.prescricao;
        prescricao.splice(id-1,1);

        for(var i = 0; i < prescricao.length; i++){
            prescricao[i].id = i + 1;
        }
        this.setState({prescricao: prescricao});
    }

    cancelar(e){
        e.preventDefault();
        if(confirm("Deseja realmente cancelar?\nAs informações dos exames poderão ser perdidas!")){
            $("#laboratoriais").modal("toggle");
        }
    }

    render(){
        return(
            <div>
                <div className="modal fade selecionado" id="laboratoriais" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Solicitação de Exames Laboratoriais</h5>
                                </div>
                            <div className="modal-body">
                                <form className="form">
                                    <div className="form-group row">
                                        <div className="col-md-4 text-left">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="0" onChange={this.handleChage} checked={this.state.exames[0]}/>
                                                <label className="form-check-label" htmlFor="0">
                                                    Amilase
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="1" onChange={this.handleChage} checked={this.state.exames[1]}/>
                                                <label className="form-check-label" htmlFor="1">
                                                    Antigeno Autrália (Hbs Ag)
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="2" onChange={this.handleChage} checked={this.state.exames[2]}/>
                                                <label className="form-check-label" htmlFor="2">
                                                    Bilirrubinas Total e Frações
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="3" onChange={this.handleChage} checked={this.state.exames[3]}/>
                                                <label className="form-check-label" htmlFor="3">
                                                    Coagulograma Completo
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="4" onChange={this.handleChage} checked={this.state.exames[4]}/>
                                                <label className="form-check-label" htmlFor="4">
                                                    CK - Nac
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="5" onChange={this.handleChage} checked={this.state.exames[5]}/>
                                                <label className="form-check-label" htmlFor="5">
                                                    CK - MB
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="6" onChange={this.handleChage} checked={this.state.exames[6]}/>
                                                <label className="form-check-label" htmlFor="6">
                                                    Creatina
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="7" onChange={this.handleChage} checked={this.state.exames[7]}/>
                                                <label className="form-check-label" htmlFor="7">
                                                    Coombs Direto
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="8" onChange={this.handleChage} checked={this.state.exames[8]}/>
                                                <label className="form-check-label" htmlFor="8">
                                                    Coombs Indireto
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="9" onChange={this.handleChage} checked={this.state.exames[9]}/>
                                                <label className="form-check-label" htmlFor="9">
                                                    Gama Glutamil Transferase
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="10" onChange={this.handleChage} checked={this.state.exames[10]}/>
                                                <label className="form-check-label" htmlFor="10">
                                                    Glicose
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-left">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="11" onChange={this.handleChage} checked={this.state.exames[11]}/>
                                                <label className="form-check-label" htmlFor="11">
                                                    Grupo Sanguíneo e RH
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="12" onChange={this.handleChage} checked={this.state.exames[12]}/>
                                                <label className="form-check-label" htmlFor="12">
                                                    HIV
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="13" onChange={this.handleChage} checked={this.state.exames[13]}/>
                                                <label className="form-check-label" htmlFor="13">
                                                    HCV
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="14" onChange={this.handleChage} checked={this.state.exames[14]}/>
                                                <label className="form-check-label" htmlFor="14">
                                                    Hemograma
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="15" onChange={this.handleChage} checked={this.state.exames[15]}/>
                                                <label className="form-check-label" htmlFor="15">
                                                    Hemossedimentação
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="16" onChange={this.handleChage} checked={this.state.exames[16]}/>
                                                <label className="form-check-label" htmlFor="16">
                                                    Ionograma (Na,K, CI)
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="17" onChange={this.handleChage} checked={this.state.exames[17]}/>
                                                <label className="form-check-label" htmlFor="17">
                                                     Plaquetas
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="18" onChange={this.handleChage} checked={this.state.exames[18]}/>
                                                <label className="form-check-label" htmlFor="18">
                                                    Proteinas C Reativa (PCR)
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="19" onChange={this.handleChage} checked={this.state.exames[19]}/>
                                                <label className="form-check-label" htmlFor="19">
                                                    Potássio
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="20" onChange={this.handleChage} checked={this.state.exames[20]}/>
                                                <label className="form-check-label" htmlFor="20">
                                                    Proteinas Totais
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="21" onChange={this.handleChage} checked={this.state.exames[21]}/>
                                                <label className="form-check-label" htmlFor="21">
                                                    Proteinas Totais e Frações
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-left">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="22" onChange={this.handleChage} checked={this.state.exames[22]}/>
                                                <label className="form-check-label" htmlFor="22">
                                                    Sódio
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="23" onChange={this.handleChage} checked={this.state.exames[23]}/>
                                                <label className="form-check-label" htmlFor="23">
                                                    Tempo de Protonbina
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="24" onChange={this.handleChage} checked={this.state.exames[24]}/>
                                                <label className="form-check-label" htmlFor="24">
                                                    Tempo de Tromboplastina parcial Ativado
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="25" onChange={this.handleChage} checked={this.state.exames[25]}/>
                                                <label className="form-check-label" htmlFor="25">
                                                    Teste de Falsização
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="26" onChange={this.handleChage} checked={this.state.exames[26]}/>
                                                <label className="form-check-label" htmlFor="26">
                                                    Transaminase Oxalatica
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="27" onChange={this.handleChage} checked={this.state.exames[27]}/>
                                                <label className="form-check-label" htmlFor="27">
                                                     Transaminase Pirurvica
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="28" onChange={this.handleChage} checked={this.state.exames[28]}/>
                                                <label className="form-check-label" htmlFor="28">
                                                    Uréia
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <b>URINA:</b><br/>
                                                <input className="form-check-input" type="checkbox" id="29" onChange={this.handleChage} checked={this.state.exames[29]}/>
                                                <label className="form-check-label" htmlFor="29">
                                                    Cultura
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <b>Escarro:</b><br/>
                                                <input className="form-check-input" type="checkbox" id="30" onChange={this.handleChage} checked={this.state.exames[30]}/>
                                                <label className="form-check-label" htmlFor="30">
                                                    Baar
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-8 text-right">
                                            <b>Prioridade: </b>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1"/>
                                                <label className="form-check-label" htmlFor="inlineRadio1">Urgência</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2"/>
                                                <label className="form-check-label" htmlFor="inlineRadio2">Rotina</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-1">
                                            <label className="col-form-label">Outros:</label>
                                        </div>
                                        <div className="col-md-5">
                                            <textarea className="form-control text-uppercase"  placeholder="Outros Exames"></textarea>
                                        </div>
                                        <div className="col-md-1">
                                            <label className="col-form-label">Justificativa:</label>
                                        </div>
                                        <div className="col-md-5">
                                            <textarea className="form-control text-uppercase" placeholder="Justificativa"></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvar" type="button" className="btn btn-primary" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}