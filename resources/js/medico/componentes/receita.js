import React,{Component} from 'react';
import Edit from "../../imagens/edit.png";
import axios from 'axios';
import { preencha, redirect, salvo, cancelarEdicao } from '../../components/mensagens';

export default class Receita extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            descricao: "",
            receitas: []
        };
        this.handleChage = this.handleChage.bind(this);
        this.api = "/consulta/";
        $(document).ready(function () {
            $("#btn-receita").attr("disabled", true);
        });
    }


    handleChage(e){
        this.setState({descricao: e.target.value.toUpperCase()});
    }

    novaReceita(e){
        e.preventDefault();
        this.modalReceita();
    }

    editar(e,row){
        e.preventDefault();

        this.setState({id: row.id, descricao: row.descricao});
        this.modalReceita();
    }

    salvar(e){
        e.preventDefault();

        var receita = {
            descricao: this.state.descricao,
            medico: $("#userId").val(),
            consulta: this.props.consulta
        }

        if(!receita.descricao){
            preencha("receita","#descricao")
        }
        else{
            if(!this.state.id){
                axios.post(this.api + "receita/store",receita)
                .then(e =>{salvo(); this.imprimir(e.data); this.setState({descricao: "", id: ""});})
                .catch((e) => redirect(e));
            }
            else{
                axios.put(this.api + "receita/update/"+ this.state.id, receita)
                .then(e => {
                    salvo(); this.imprimir(e.data);
                    this.setState({descricao: "", id: ""});
                    axios.get(this.api + "receita/lista/" + this.props.consulta)
                    .then(response => {
                        this.setState({receitas: response.data});
                        this.modalLista();
                    })
                    .catch((e) => redirect(e));
                })
                .catch((e) => redirect(e));
            }
        }
    }


    abrirReceitas(){
        axios.get(this.api + "receita/lista/" + this.props.consulta)
        .then(response => {
            this.setState({receitas: response.data});
        })
        .catch((e) => redirect(e));
    }
    
    modalLista(){
        $(document).ready(function () {
            $("#listaReceita").removeClass("d-none");
            $("#btnNovaReceita").removeClass("d-none");
            $("#novaReceita").addClass("d-none");
            $("#btnSalvarReceita").addClass("d-none");
            $("#btnReceitaCancelar").addClass("d-none");
            $("#btnReceitaSair").removeClass("d-none");
        });
        this.abrirReceitas();
    }

    modalReceita(){
        $(document).ready(function () {
            $("#listaReceita").addClass("d-none");
            $("#btnNovaReceita").addClass("d-none");
            $("#novaReceita").removeClass("d-none");
            $("#btnSalvarReceita").removeClass("d-none");
            $("#btnReceitaCancelar").removeClass("d-none");
            $("#btnReceitaSair").addClass("d-none");
        });
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Receita")
        .then(response => {
            if(response){
                this.setState({descricao: "", id: ""});
                this.modalLista();
            }
        });
    }

    imprimir(e){
        var data = new Date(e).toLocaleDateString();

        var table = "<table><tr><td><div class='cabecalho center'><img id='imagem' src='/images/upa2.png'></div><div class='center cabecalho'><h1>Receituário Médico</h1></div></td></tr>";
        table += "<tr><td><div id='body'><br/><h3 class='center'>"+ this.props.paciente +"</h3><br/>"+ this.state.descricao.replace(/(?:\r\n|\r|\n)/g, '<br />') +"</div><div class='espaco0 center'><div id='data'>"+ data +"</div><br/><h4>DR(A) "+ $("#userName").val() +" </h4>Médico</div><br/></td></tr>";
        table += "<table>";

        var style = "<style>table{width: 100%; font: 17px Calibri;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;} #data{text-align: right; margin-right: 40px;} img{max-width: 130px;}  .espaco0{line-height: 0px;} .espaco{line-height: 30px;} #body{height: 500px; padding: 15px;} .cabecalho{display: inline-block; float: left;width: 335px; padding-top: 10px; padding-bottom: 10px;} h1{margin: 0px;}</style>";
        var head = "<head><title>Atendimento </title> "+ style +" </head>";
        var body = "<body>"+table+"<body>";
        var win = window.open("","","height=700,width=700");
        win.document.write("<html>");
        win.document.write(head);
        win.document.write(body);
        win.document.write("</html>");

        var img = win.document.getElementById("imagem");
    
        img.onload = function () {
            win.print();
            win.close();
        }
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" type="button" id="btn-receita" onClick={e => this.abrirReceitas()} data-toggle="modal" data-target="#receita">Receita</button>
                <div className="modal fade selecionado" id="receita" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Receita Médica</h5>
                                </div>
                            <div className="modal-body">
                                <div className="text-right">
                                    <button id="btnNovaReceita" className="btn btn-success" onClick={e => this.novaReceita(e)}>Adcionar Receita</button>
                                </div>
                                <div id="listaReceita">
                                    <div>
                                        <div className="table-responsive" >
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr scope="row">
                                                        <th scope="col"> Data / Hora </th>
                                                        <th scope="col"> Médico </th>
                                                        <th scope="col"> Editar </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.receitas.map(
                                                        row =>
                                                        <tr key= {row.id}>
                                                            <td> {new Date(row.updated_at).toLocaleString()}</td>
                                                            <td> {row.medico} </td>
                                                            <td><button type="button" className="btn btn-warning" onClick={e => this.editar(e, row)}><img src={Edit} /></button></td>
                                                        </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-none" id="novaReceita">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <textarea className="form-control text-uppercase" rows="10" onChange={this.handleChage} value={this.state.descricao}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="btnReceitaSair" data-dismiss="modal">Sair</button>
                                    <button type="button" className="btn btn-warning d-none" id="btnReceitaCancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvarReceita" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}