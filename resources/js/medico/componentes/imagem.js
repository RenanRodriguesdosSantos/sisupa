import React,{Component} from 'react';

export default class Imagem extends Component{
    constructor(){
        super();
        this.state = {
            exames: [false,false,false,false],
            descricao: ["","","",""]
        };
        this.handleChage = this.handleChage.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(e){
        var exames  = this.state.exames;
        exames[e.target.id] = e.target.checked;
        this.setState({exames: exames});
        var descricao = this.state.descricao;
        for(var i = 0; i < 3; i++){
            if(exames[i]){
                alert("a")
                $("#descricao0").removeClass("d-none");
            }
            else{
                descricao[i] = "";
                $("#descricao"+i).addClass("d-none");
            }
        }
    }

    handleChage(e){
        
    }

    cancelar(e){
        e.preventDefault();
        if(confirm("Deseja realmente cancelar?\nAs informações dos exames de imagens poderão ser perdidas!")){
            $("#imagem").modal("toggle");
        }
    }

    render(){
        return(
            <div>
                <div className="modal fade" id="imagem" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Solicitação de Exames de Imagem</h5>
                                </div>
                            <div className="modal-body">
                                <form className="form">
                                    <div className="form-group row">
                                        <div className="col-md-6 text-left">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="0" onChange={this.handleSelect} checked={this.state.exames[0]}/>
                                                <label className="form-check-label" htmlFor="0">
                                                    Raio X
                                                </label>
                                                <div className="d-none" id="descricao0">
                                                    <textarea className="form-control text-uppercase" id="descricaoRaioX"></textarea>
                                                </div>
                                            </div>
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