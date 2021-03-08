import React,{Component} from 'react';
import Edit from "../../imagens/edit.png";
import axios from 'axios';
import { preencha, redirect, salvo, cancelarEdicao } from '../../components/mensagens';

export default class Encaminhamento extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            encaminhamento: {servico: "", entidade: "0", historia: "", exames: "", hd: ""},
            encaminhamentos: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.api = "/consulta/";
        $(document).ready(function () {
            $("#btn-encaminhamento").attr("disabled", true);
        });
    }

    handleChange(e){
        var encaminhamento = this.state.encaminhamento;
        encaminhamento[e.target.id] = e.target.value;
        this.setState({encaminhamento: encaminhamento});
    }

    novaEncaminhamento(e){
        e.preventDefault();
        this.modalEncaminhamento();
    }

    editar(e,row){
        e.preventDefault();

        this.setState({id: row.id, encaminhamento: {servico: row.servico?row.servico:"", entidade: row.entidade, historia: row.historia, exames: row.exames?row.exames:"",hd: row.hd?row.hd:""}});
        this.modalEncaminhamento();
    }

    salvar(e){
        e.preventDefault();

        var encaminhamento = {
            servico: this.state.encaminhamento.servico,
            entidade: this.state.encaminhamento.entidade,
            historia: this.state.encaminhamento.historia,
            exames: this.state.encaminhamento.exames,
            hd: this.state.encaminhamento.hd,
            medico: $("#userId").val(),
            consulta: this.props.consulta,
        }

        if(!encaminhamento.entidade || encaminhamento.entidade == '0'){
            preencha("Encaminhamento para","#entidade");
        }
        else if(!encaminhamento.historia){
            preencha("História Clínica","#historia");
        }
        else{
            if(!this.state.id){
                axios.post(this.api + "encaminhamento/store",encaminhamento)
                .then(e => {salvo(); this.imprimir(e.data[0])})
                .catch((e) => redirect(e));
            }
            else{
                axios.put(this.api + "encaminhamento/update/"+ this.state.id, encaminhamento)
                .then(e => {salvo(); this.imprimir(e.data[0])})
                .catch((e) => redirect(e));
            }
            axios.get(this.api + "encaminhamento/lista/" + this.props.consulta)
            .then(response => {
                this.setState({encaminhamentos: response.data});
            })
            .catch((e) => redirect(e));
            
        }
    }

    getEntidade(id){
        switch (id) {
            case '1':
                   return "UBS";
                break;
            case '2':
                   return "POLICLÍNICA";
                break;
            case '3':
                   return "PSF";
                break;
            case '4':
                   return "HMRG";
                break;
            case '5':
                   return "CAPS";
                break;
            case '6':
                   return "HSR";
                break;
            case '7':
                   return "HBS";
                break;
            case '8':
                   return "H. FILADÉLFIA";
                break;
            case '9':
                   return "CVV";
                break;
            case '10':
                   return "CTA";
                break;
            case '11':
                   return "OUTROS";
                break;
        }
    }

    idade(nascimento) {
        var d = new Date();
        
            var ano_atual = d.getFullYear();
            var mes_atual = d.getMonth() + 1;
            var dia_atual = d.getDate();
    
            var ano_aniversario = nascimento.getFullYear();
            var mes_aniversario = nascimento.getMonth() + 1;
            var dia_aniversario = nascimento.getDate() + 1;
    
            var quantos_anos = ano_atual - ano_aniversario;
    
        if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
            quantos_anos--;
        }
        
        return (quantos_anos < 0 ? 0 : quantos_anos);
    }

    imprimir(dados){
        
        var encaminhamento = this.state.encaminhamento;
        var servico = encaminhamento.servico?encaminhamento.servico:"";
        var entidade = this.getEntidade(encaminhamento.entidade);
        var historia = encaminhamento.historia;
        var exames = encaminhamento.exames?encaminhamento.exames:"";
        var hd = encaminhamento.hd?encaminhamento.hd:"";
        
        var paciente = dados.paciente;
        var idade = this.idade(new Date(dados.nascimento));
        var municipio = dados.municipio;
        var cns = dados.cns?dados.cns:"";

        
        var table = "<table class='espaco'><tr><td class='center'><img id='imagem' src='/images/upa2.png'</td><td id='td-cabecalho' colspan='4' class='center'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br/> SECRETARIA MUNICIPAL DE SAÚDE - SUS/MG <br/> Encaminhamento de Atendimento UPA-24Hs</b></td></tr>";
        table += "<tr><td colspan='5'>Serviço de: <b> "+ servico + " </b><br>Nome: <b>"+ paciente +"</b> &nbsp;  &nbsp;  &nbsp; Idade: <b> "+ idade +" anos</b>  &nbsp;  &nbsp;  &nbsp; Municipio: <b> "+ municipio +" </b></td></tr>";
        table += "<tr><td colspan='5'>Cartão SUS: <b>"+ cns +"</b></td></tr>";
        table += "<tr><td colspan='5'>Encaminhamento para: <b>" + entidade + "</b></td></tr>";
        table += "<tr><td colspan='5'><div id='hc'>Historia Clínica:  "+ historia + "</div></td></tr>";
        table += "<tr><td colspan='5'><div id='er'>Exames Realizados:  "+ exames +"</div></td></tr>";
        table += "<tr><td colspan='5'><div id='hd'>HD:  "+ hd +"</div></td></tr>";
        table += "<tr><td colspan='5'><div class='center'><br/><br/><b>Teófilo Otoni, 09/07/2020</b><br/><br/><br/><br/><div class='espaco0'><h4>DR(A) MÉDICO </h4> Médico </div><br/></div></td></tr>";

        table += "</table>";

        var style = "<style>table{width: 100%; font: 17px Calibri;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} td{width: 135px;} .center{text-align: center;} img{max-width: 130px;}  .espaco0{line-height: 0px;} .espaco{line-height: 30px;}  #td-cabecalho{font-family: Times;} #hc{height: 200px;} #er{height: 150px} #hd{height: 100px;}</style>";
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

        this.setState({id: "", encaminhamento: {servico: "", entidade: "0", historia: "", exames: "",hd: ""}});
        this.modalLista();
        this.abrirEncaminhamentos(e);
    }

    abrirEncaminhamentos(e){
        e.preventDefault();
        axios.get(this.api + "encaminhamento/lista/" + this.props.consulta)
        .then(response => {
            this.setState({encaminhamentos: response.data});
        })
    }
    
    modalLista(){
        $(document).ready(function() {
            $("#listaEncaminhamento").removeClass("d-none");
            $("#btnNovaEncaminhamento").removeClass("d-none");
            $("#novaEncaminhamento").addClass("d-none");
            $("#btnSalvarEncaminhamento").addClass("d-none");
            $("#btnEncaminhamentoCancelar").addClass("d-none");
            $("#btnEncaminhamentoSair").removeClass("d-none");
        })
    }

    modalEncaminhamento(){
        $(document).ready(function() {
            $("#listaEncaminhamento").addClass("d-none");
            $("#btnNovaEncaminhamento").addClass("d-none");
            $("#novaEncaminhamento").removeClass("d-none");
            $("#btnSalvarEncaminhamento").removeClass("d-none");
            $("#btnEncaminhamentoCancelar").removeClass("d-none");
            $("#btnEncaminhamentoSair").addClass("d-none");
        })
    }

    cancelar(e){
        e.preventDefault();
       cancelarEdicao("Encaminhamento")
       .then(response => {
           if(response){
               var encaminhamento = {servico: "", entidade: "0", historia: "", exames: "", hd: ""};
               this.setState({encaminhamento: encaminhamento, id: ""});
               this.modalLista();
           }
       });
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" type="button" id="btn-encaminhamento" onClick={e => this.abrirEncaminhamentos(e)} data-toggle="modal" data-target="#encaminhamentoM">Encaminhamento</button>
                <div className="modal fade selecionado" id="encaminhamentoM" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Encaminhamento Médico</h5>
                                </div>
                            <div className="modal-body">
                                <div className="text-right">
                                    <button id="btnNovaEncaminhamento" className="btn btn-success" onClick={e => this.novaEncaminhamento(e)}>Adcionar Encaminhamento</button>
                                </div>
                                <div id="listaEncaminhamento">
                                    <div>
                                        <div className="table-responsive" >
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr scope="row">
                                                        <th scope="col">Encaminhamento Para</th>
                                                        <th scope="col"> Data / Hora </th>
                                                        <th scope="col"> Médico </th>
                                                        <th scope="col"> Editar </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.encaminhamentos.map(
                                                        row =>
                                                        <tr key= {row.id}>
                                                            <td> {this.getEntidade(row.entidade)} </td>
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
                                <div className="d-none" id="novaEncaminhamento">
                                    <div className="form-group row">
                                        <div className="col-md-6 border border-dark">
                                            <div className="form-group row">
                                                <label htmlFor="servico" className="col-md-12 col-form-label"> Serviço de: </label>
                                                <div className="col-md-12">
                                                    <input onChange={this.handleChange}  value={this.state.encaminhamento.servico} className="form-control text-uppercase" id="servico" placeholder="Tipo de Serviço"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="entidade" className="col-md-12 col-form-label"> Encaminhamento para: </label>
                                                <div className="col-md-12">
                                                    <select onChange={this.handleChange}  value={this.state.encaminhamento.entidade} className="form-control text-uppercase" id="entidade">
                                                        <option value="0">SELECIONE</option>
                                                        <option value="1">UBS</option>
                                                        <option value="2">POLICLÍNICA</option>
                                                        <option value="3">PSF</option>
                                                        <option value="4">HMRG</option>
                                                        <option value="5">CAPS</option>
                                                        <option value="6">HSR</option>
                                                        <option value="7">HBS</option>
                                                        <option value="8">H. FILADÉLFIA</option>
                                                        <option value="9">CVV</option>
                                                        <option value="10">CTA</option>
                                                        <option value="11">OUTROS</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 border border-dark">
                                            <div className="form-group row">
                                                <label htmlFor="historia" className="col-md-12 col-form-label"> HISTORIA CLÍNICA: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.historia} className="form-control text-uppercase" id="historia" placeholder="Historia Clínica"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="exames" className="col-md-12 col-form-label"> Exames Realizados: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.exames} className="form-control text-uppercase" id="exames" placeholder="Exames Realizados"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="hd" className="col-md-12 col-form-label"> HD: </label>
                                                <div className="col-md-12">
                                                    <textarea onChange={this.handleChange}  value={this.state.encaminhamento.hd} className="form-control text-uppercase" id="hd" placeholder="HD"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="btnEncaminhamentoSair" data-dismiss="modal">Sair</button>
                                    <button type="button" className="btn btn-warning d-none" id="btnEncaminhamentoCancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvarEncaminhamento" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}