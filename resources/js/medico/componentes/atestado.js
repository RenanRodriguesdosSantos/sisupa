import React,{Component} from 'react';

export default class Atestado extends Component{
    constructor(){
        super();
        this.state = {
            dias: "",
            tipo: ""
        };
        this.handleChage = this.handleChage.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChage(e){
        this.setState({[e.target.id]: e.target.value});
    }

    handleSelect(e){
        if(e.target.value == 0){
            alert("Selecione um tipo de Atestado");
        }
        else if(e.target.value == 1){
            this.setState({tipo: "1", dias: ""});
            $("#formdias").addClass("d-none");
        }
        else{
            this.setState({tipo: "2"});
            $("#formdias").removeClass("d-none");
        }
    }

    render(){
        return(
            <div>
                <div className="modal fade selecionado" id="atestado" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-md"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Atestado Médico</h5>
                                </div>
                            <div className="modal-body">
                                <form className="form">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="form-group row">
                                                <label htmlFor="tipo" className="col-form-label col-md-4">Tipo: </label>
                                                <div className="col-md-8">
                                                    <select id="tipo" className="form-control" onChange={this.handleSelect} value={this.state.tipo}>
                                                        <option value="0">SELECIONE</option>
                                                        <option value="1">ATESTADO DE COMPARECIMENTO</option>
                                                        <option value="2">ATESTADO COMUM</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row d-none" id="formdias">
                                                <label htmlFor="dias" className="col-form-label col-md-4">Total de Dias:</label>
                                                <div className="col-md-8 ">
                                                    <input type="text" id="dias" className="form-control" onChange={this.handleChage} value={this.state.dias} placeholder="QUANTIDADE DE DIAS DE ATESTADO" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelar" data-dismiss="modal">Cancelar</button>
                                    <button id="btnSalvar" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}