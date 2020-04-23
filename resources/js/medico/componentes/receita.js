import React,{Component} from 'react';

export default class Receita extends Component{
    constructor(){
        super();
        this.state = {
            dias: ""
        };
        this.handleChage = this.handleChage.bind(this);
    }

    handleChage(e){
        this.setState({[e.target.id]: e.target.value});
    }


    render(){
        return(
            <div>
                <div className="modal fade selecionado" id="receita" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Receita Médica</h5>
                                </div>
                            <div className="modal-body">
                                <form className="form">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <textarea className="form-control" rows="10" onChange={this.handleChage} value={this.state.receita}></textarea>
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