import React,{Component} from 'react';
import Image from '../imagens/usuarioEnfermagem.png';
export default class User extends Component{
    constructor(){
        super();
        this.state = {user: [], senhaAntiga: "", novaSenha: "", confirmar: ""};
        axios.get("/user")
        .then(response => {this.setState({user: response.data})});
        this.handleChange = this.handleChange.bind(this);
    }
    
    sair(e){
        e.preventDefault();
        document.getElementById('logout-form').submit();
    }

    alterarSenha(e){
        e.preventDefault();
        if(this.state.novaSenha == this.state.confirmar){
            axios.post("/api/reset",{senhaAntiga: this.state.senhaAntiga})
            .then(e =>{
                if(e.data == 0){
                    alert("Senha Alterada com Sucesso");
                }
                else{
                    alert("Não foi possivel atualizar a Senha");
                }
            });
        }
        else{
            alert("Senhas diferentes");
        }
    }

    handleChange(e){
        e.preventDefault();
        var campo = e.target.id;
        if(campo == "senhaAtual"){
            this.setState({senhaAntiga: e.target.value});
        }
        else if(campo == "novaSenha"){
            this.setState({novaSenha: e.target.value});
        }
        else {
            this.setState({confirmar: e.target.value});
        }
    }
    render(){
        return(
            <div className="col-md-2">
                <div className="dropdown">
                    <button className="btn btn-outline-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.user.name}
                    </button>
                    <div className="dropdown-menu pr-2 pl-2" aria-labelledby="dropdownMenuButton">
                        <form id="logout-form" action="/sair" method="GET" hidden>
                        </form>
                        <button className="btn btn-outline-primary  col-md-12" data-toggle="modal" data-target="#alterarSenha">Alterar Senha</button>
                        <button className="btn btn-outline-danger  col-md-12" onClick={e => this.sair(e)}>Sair</button>
                    </div>
                </div> 
                <div className="modal fade" id="alterarSenha" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="TituloModalLongoExemplo" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="TituloModalLongoExemplo">Alterar Senha</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Fechar">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        <div className="modal-body row">
                            <form className="col-md-12 text-left">
                                <div className="form-group row">
                                    <label htmlFor="senhaAtual" className="col-sm-4 col-form-label"> Senha Atual: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} value={this.state.senhaAtual} type="password" className="form-control" id="senhaAtual" placeholder="Senha Atual"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="novaSenha" className="col-sm-4 col-form-label"> Nova Senha: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} value={this.state.novaSenha} type="password" className="form-control" id="novaSenha" placeholder="Nova Senha"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="confirmarSenha" className="col-sm-4 col-form-label"> Confirmar Senha: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} value={this.state.confirmar} type="password" className="form-control" id="confirmarSenha" placeholder="Confirmar Senha"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                <button type="button" className="btn btn-primary" onClick={e => this.alterarSenha(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}