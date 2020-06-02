import React,{Component} from 'react';

export default class Triagem extends Component{
    constructor(props){
        super(props);
        this.state = {
            atendimento: {descricao: "", hgt: "", fc: "", saturacao: "", pa: "", tax: "", glasgow: "",peso: "", fluxograma: "", discriminador: "", classificacao: "", enfermeiro: ""},
            discriminador: [],
            fluxograma: []
        };
        this.api = "/consulta/";
    }

    verDados(e){
        e.preventDefault();
        axios.get(this.api + "atendimento/triagem/dados/"+ this.props.triagem)
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

                    axios.get(this.api + "atendimento/classificacao/dados/"+atendimento.classificacao)
                    .then(response => {
                        var atendimento = this.state.atendimento;
                        atendimento.fluxograma = response.data.classificacao.nomeFluxograma;
                        atendimento.discriminador = response.data.classificacao.nomeDiscriminador;
                        this.setState({atendimento: atendimento, "discriminador" : response.data.discriminadores})
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
                    });
                });
    }

    render(){
        return(
            <div>
                <button className="btn btn-primary mb-1 border col-md-4" onClick={e => this.verDados(e)} type="button" data-toggle="modal" data-target="#triagem">Informes da Triagem</button>
                <div className="modal fade selecionado" id="triagem" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Informes da triagem</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-6 border border-dark">
                                                <h5 className="text-center">Descrição</h5>
                                                <div className="form-group row">
                                                    <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                                                    <div className="col-sm-10">
                                                        <textarea rows="4" disabled  value={this.state.atendimento.descricao} disabled className="form-control text-uppercase" id="descricao" placeholder="Queixa/Situação"/>
                                                    </div>
                                                </div>
                                                <h5 className="text-center">Sinais Vitais</h5>
                                                <div className="form-group row">
                                                    <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.saturacao} type="text" className="form-control text-uppercase" id="saturacao" placeholder="Oxigênio"/>
                                                    </div>
                                                    <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.glasgow} type="text" className="form-control text-uppercase" id="glasgow" placeholder="Glasgow"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.tax} type="text" className="form-control text-uppercase" id="tax" placeholder="Tax"/>
                                                    </div>
                                                    <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.hgt} type="text" className="form-control text-uppercase float" id="hgt" placeholder="HGT"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.pa} type="text" className="form-control text-uppercase" id="pa" placeholder="Pressão Arterial"/>
                                                    </div>
                                                    <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.fc} type="text" className="form-control text-uppercase" id="fc" placeholder="FC"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                                                    <div className="col-sm-4">
                                                        <input disabled value={this.state.atendimento.peso} type="text" className="form-control text-uppercase float" id="peso" placeholder="Peso"/>
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
                                                        <input className="form-control text-uppercase" type="text" id="fluxograma" list="cbFluxograma" disabled value={this.state.atendimento.fluxograma} placeholder="Fluxograma"/>
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
                                                        <input className="form-control text-uppercase" disabled type="text" id="discriminador" list="cbDiscriminador" disabled value={this.state.atendimento.discriminador} placeholder="Discriminador"/>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelar" data-dismiss="modal">Sair</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}