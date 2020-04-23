import React,{Component} from 'react';
import axios from 'axios';

export default class Registrar extends Component{
    constructor(){
        super();
        this.state = {
            user: {id: "", name: "", email: "", password: "", confirmar: "", tipo: "", conselho: ""},
            users: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.api = "/administrador/";

        $(document).ready(function(){
            $('.nome').mask('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',{translation: {
                'a': {pattern: /[a-zA-Z ]/}
              }});
        });
    }

    handleChange(e){
        e.preventDefault();
        var user = this.state.user;
        user[e.target.id] = e.target.value;
        if(e.target.id == "name" || e.target.id == "conselho"){
            user[e.target.id] = e.target.value.toUpperCase();
        }
        this.setState({user: user});
    }
    
    handleSelect(e){
        e.preventDefault();
        var user = this.state.user;
        var users = this.state.users;
        for(var i = 0; i < users.length; i++){
            if(e.target.value == users[i].id){
                user.id = users[i].id;
                user.name = users[i].name;
                user.tipo = users[i].tipo;
                user.conselho = !users[i].conselho?"":users[i].conselho;
                user.email = users[i].email;
                break;
            }
        }
        this.setState({user: user});
    }

    registrarUsuario(e){
        e.preventDefault();
        var user = this.state.user;
        if(!user.name){
            alert("Informe um nome de usuário.");
            $("nome").focus();
        }
        else if(!user.email){
            alert("Informe um email de usuário.");
            $("email").focus();
        }
        else if(!user.tipo || user.tipo == 0){
            alert("Informe um tipo de usuário.");
            $("tipo").focus();
        }
        else if(!user.password){
            alert("Informe uma senha.");
            $("tipo").focus();
        } 
        else if(user.password != user.confirmar){
            alert("Senhas diferentes");
            $("tipo").focus();
        }
        else{
            if(!user.id){
                axios.post(this.api + "registrarUsuario",user);
            }
            else{
                axios.put(this.api + "atualizarUsuario/"+user.id,user);
            }
            this.setState({user: {id: "", name: "", email: "", password: "", confirmar: "", tipo: "", conselho: ""}})
        }
    }
    editarUsuarios(e){
        e.preventDefault();
        axios.get(this.api + "getUsuarios")
        .then(response => {
            this.setState({users: response.data});
            $("#user").removeClass('d-none');
        });
    }
    render(){
        return(
            <div>
                <form className="col-md-8">
                    <h2 className="text-center">Cadastro de Novos Usuários</h2>
                    <br/>
                    <div className="form-group row">
                        <div className="col-md-12 text-center">
                            <button onClick={e => this.editarUsuarios(e)} className="btn btn-primary col-md-4">
                                Editar Usuários.
                            </button>
                        </div>
                        <br/>
                        <div className="col-md-12">
                            <select id="user" className="form-control d-none" onChange={this.handleSelect} value={this.state.user.id}>
                                {
                                    this.state.users.map(
                                        row =>
                                    <option value={row.id} key={row.id}>{row.name + " | " +row.email}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-md-2 col-form-label ">NOME:</label>
                        <div className="col-md-10">
                            <input id="name" type="text" className="form-control text-uppercase nome" onChange={this.handleChange} value={this.state.user.name} placeholder="Nome"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="tipo" className="col-md-2 col-form-label ">TIPO:</label>
                        <div className="col-md-10">
                            <select id="tipo" className="form-control" onChange={this.handleChange} value={this.state.user.tipo}>
                                <option value='0'>SELECIONE</option>
                                <option value='1'>ADMINISTRADOR</option>
                                <option value='2'>RECEPCIONISTA</option>
                                <option value='3'>ENFERMEIRO</option>
                                <option value='4'>MÉDICO</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="coren" className="col-md-2 col-form-label ">Conselho:</label>
                        <div className="col-md-10">
                            <input id="conselho" type="text" className="form-control" onChange={this.handleChange} value={this.state.user.conselho} placeholder="COREN/CRM"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="email" className="col-md-2 col-form-label ">E-Mail:</label>
                        <div className="col-md-10">
                            <input id="email" type="email" className="form-control" name="email" onChange={this.handleChange} value={this.state.user.email} placeholder="E-mail"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="password" className="col-md-2 col-form-label ">Senha</label>
                        <div className="col-md-10">
                            <input id="password" type="password" className="form-control" onChange={this.handleChange} value={this.state.user.password} placeholder="Senha"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="confirmar" className="col-md-2 col-form-label ">Confirmar Senha</label>
                        <div className="col-md-10">
                            <input id="confirmar" type="password" className="form-control" onChange={this.handleChange} value={this.state.user.confirmar} placeholder="Confirmar Senha"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-12 text-right">
                            <button onClick={e => this.registrarUsuario(e)} className="btn btn-primary col-md-4">
                                Registrar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}