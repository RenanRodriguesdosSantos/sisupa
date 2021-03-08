import React,{Component} from 'react';
import axios from 'axios';
import Upa2 from '../../imagens/upa2.png';
import {redirect, salvo, preencha} from '../../components/mensagens';

export default class Atestado extends Component{
    constructor(props){
        super(props);

        var data = new Date().toLocaleDateString();
        var data = data.substring(6,10) + '-' + data.substring(3,5) + '-' + data.substring(0,2);
        this.state = {
            tipoAtividadesAtestado: "",
            tempoAtestado: "",
            cid: "",
            apartir: data
        };

        this.api = "/consulta/";

        this.handleChage = this.handleChage.bind(this);
        $(document).ready(function () {
            $("#btn-atestado").attr("disabled", true);
        });
    }

    handleChage(e){
        this.setState({[e.target.id]: e.target.value});
    }

    imprimirComparecimento(e){
        e.preventDefault();

        var table = "<table><tr><td><div class='center cabecalho'><img id='imagem' src='/images/upa2.png'/></div><div class='center cabecalho'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI<br/>Secretaria Municipal de Saúde<br/> Unidade de Pronto Atendimento - UPA24h</b></div></td></tr>";
        table = table + "<tr><td><h2 class='center'>ATESTADO DE COMPARECIMENTO</h2><br/><br/><div class='espaco'>ATESTO PARA OS DEVIDOS FINS QUE <b>"+ this.props.paciente +"</b>, COMPARECEU A UNIDADE DE PRONTO ATENDIMENTO (UPA 24 HORAS), NO DIA <b>"+ new Date(this.props.dataConsulta).toLocaleDateString() +"</b>.</div><br/><br/><br/><br/><br/><div class='espaco0 center'><h3>DR(A) "+ $("#userName").val() +"</h3>MÉDICO(A)</div><br/></td></tr></table>";

        var style = "<style>table{width: 100%; font: 17px Calibri;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;} .cabecalho{display: inline-block; float: left;width: 330px; padding-top: 10px; padding-bottom: 10px;} .espaco0{line-height: 0px;} .espaco{line-height: 30px;}</style>";
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

        $("#atestado").modal("toggle");
        this.setState({tempoAtestado: "", cid: "", tipoAtividadesAtestado: ""});
    }

    getTipoAtividade(id){
        switch (id) {
            case '1':
                    return "Laborais";
                break;
        }
    }

    imprimirAtestado(e){

        var data = new Date(e).toLocaleDateString();
        var cid = this.state.cid?this.state.cid:"";
        var apartir = new Date(this.state.apartir).toLocaleDateString();
        var tempo = this.state.tempoAtestado;
        var atividade = this.getTipoAtividade(this.state.tipoAtividadesAtestado);

        var table = "<table><tr><td><img id='imagem' src='/images/upa2.png'/></td><td colspan='3' class='center'><b>UNIDADE DE PRONTO ATENDIMENTO <br/> UPA - 24Hs</b> <hr/> CPNPJ 25104902000107</td><td class='center' id='td-3'>Rua Getúlio Vargas, Nº 1824. Centro <b>Telefone: 3529-1695</b> Teófilo Otoni - MG</td></tr>";
        table += "<tr><td colspan='5' id='body' class='espaco'><br/><h1 class='center'><i> ATESTADO </i></h1> Atesto para os devidos fins que o(a) Sr(a) <b> "+ this.props.paciente +" </b>. Deve permanecer afastado de suas atividades <b>"+ atividade +"</b>. Por <b>" + tempo + " dias</b>, a partir de <b>" + apartir + "</b>. Por motivo de doença. <br/> CID: <b>"+ cid +"</b><br/> Teófilo Otoni - MG "+ data +" <br/><br/><br/><br/><br/><div class='espaco0 center'><h3>Dr(a) "+ $("#userName").val() +" </h3><br/> Assinatura do Médico/CRM</div><br/></td></tr>";
        table += "</table>";

        var style = "<style>table{width: 100%; font: 17px Calibri;} h1{font-family: Times} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;} td{width: 130px;} img{max-width: 130px;} #td-3{width: 145px;} .espaco0{line-height: 0px;} .espaco{line-height: 30px;} hr{border-top: 4px solid #000;border-bottom: 4px solid #000;color: #fff; background-color: #fff; height: 3px;} #body{padding: 15px;}</style>";
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

        $("#atestado").modal("toggle");
        this.setState({tempoAtestado: "", cid: "", tipoAtividadesAtestado: ""});
    }

    salvar(e){
        e.preventDefault();

        if(!this.state.tempoAtestado){
            preencha("tempo de atestado","#tempoAtestado")
        }
        else if(!this.state.tipoAtividadesAtestado){
            preencha("tipo de atividade","#tipoAtividade")
        }
        else{
            var atestado = {
                tempoAtestado: this.state.tempoAtestado,
                tipoAtividadesAtestado: this.state.tipoAtividadesAtestado,
                cid: this.state.cid,
                medico: $("#userId").val(),
                consulta: this.props.consulta,
                apartir: this.state.apartir
            }
            if(!this.state.id){
                axios.post(this.api + "atestado/store",atestado)
                .then(e => {salvo(); this.imprimirAtestado(e.data)})
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.api + "atestado/update/"+ this.state.id, atestado)
                .then(e => {salvo(); this.imprimirAtestado(e.data)})
                .catch(e => redirect(e));
            }
        }
    }

    abrir(e){
        e.preventDefault();
        axios.get(this.api + "atestado/edit/" + this.props.consulta)
        .then(response =>{
            this.setState({
                id: response.data.id?response.data.id:"",
                tipoAtividadesAtestado: response.data.tipoAtividadesAtestado?response.data.tipoAtividadesAtestado:"",
                tempoAtestado: response.data.tempoAtestado?response.data.tempoAtestado:"",
                cid: response.data.cid?response.data.cid:""
            });
        })
        .catch(e => redirect(e));
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" id="btn-atestado" onClick={e => this.abrir(e)} type="button" data-toggle="modal" data-target="#atestado">Atestado</button>
                <div className="modal fade selecionado" id="atestado" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-md"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Atestado Médico</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="form-group row">
                                            <label htmlFor="tipoAtividadeAtestado" className="col-form-label col-md-4">Tipo de Atividades: </label>
                                            <div className="col-md-8">
                                                <select id="tipoAtividadesAtestado" className="form-control" onChange={this.handleChage} value={this.state.tipoAtividadesAtestado}>
                                                    <option value="0">SELECIONE</option>
                                                    <option value="1">LABORAIS</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="tempoAtestado" className="col-form-label col-md-4">Duração: </label>
                                            <div className="col-md-8">
                                                <input id="tempoAtestado" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.tempoAtestado} placeholder="Duração do Atestado"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="cid" className="col-form-label col-md-4">Cid: </label>
                                            <div className="col-md-8">
                                                <input id="cid" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.cid} placeholder="CID"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="apartir" className="col-form-label col-md-4">Apartir de: </label>
                                            <div className="col-md-8">
                                                <input id="apartir" type="date" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.apartir}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="button" className="btn btn-warning border" id="cancelar" data-dismiss="modal">Cancelar</button>
                                        <button id="btnComparecimento" type="button" className="btn btn-primary border" onClick={e => this.imprimirComparecimento(e)}>Atestado de Comparecimento</button>
                                        <button id="btnSalvar" type="button" className="btn btn-primary border" onClick={e => this.salvar(e)}>Salvar Atestado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}