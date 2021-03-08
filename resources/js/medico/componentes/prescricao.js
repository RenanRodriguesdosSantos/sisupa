import React,{Component} from 'react';
import Cancel from '../../imagens/cancel.png';
import axios from 'axios';
import {salvo, redirect, cancelarEdicao, preencha, deletarPrescricao, excluidoSucesso} from '../../components/mensagens';

export default class Prescricao extends Component{
    constructor(props){
        super(props);
        this.state = {
            item: {id:"",quantidade: "",prescricao: "", apresentacao: "", posologia: "", observacao: ""},
            prescricao: [],
            prescricaos: [],
            medicamentos: []
        };
        this.api = "/consulta/";
        this.handleChage = this.handleChage.bind(this);
        $(document).ready(function () {
            $("#btn-prescricao").attr("disabled", true);
        });

    }

    handleChage(e){
        var item  = this.state.item;
        item[e.target.id] = e.target.value.toUpperCase();
        this.setState({item: item});
    }

    adicionar(e){
        e.preventDefault();
        var item = this.state.item;
        if(!item.prescricao){
            preencha("prescrição","#prescricao");
        }
        else{
            var prescricao = this.state.prescricao;
            item.id = prescricao.length + 1;
            prescricao.push(item);
            this.setState({prescricao: prescricao,item: {id: "",quantidade: "", prescricao: "", apresentacao: "", posologia: "", observacao: ""}});
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
        cancelarEdicao("Prescrição")
        .then(response => {
            if(response){
                this.modalLista();
            }
        });
    }

    novaPrescricao(e){
        e.preventDefault();
        this.modalPrescricao();
    }

    abrirPrescricao(e){
        e.preventDefault();
        axios.get(this.api + "prescricao/lista/" + this.props.consulta)
        .then(response => {
            this.setState({prescricaos: response.data});
        })
        .catch((e) => redirect(e));

        axios.get(this.api + "medicamentos/lista")
        .then(response => {
            this.setState({medicamentos: response.data});
        })
        .catch((e) => redirect(e));
    }

    modalLista(){
        $(document).ready(function () {
            $("#listaPrescricao").removeClass("d-none");
            $("#btnNovaPrescricao").removeClass("d-none");
            $("#novaPrescricao").addClass("d-none");
            $("#btnSalvarPrescricao").addClass("d-none");
            $("#btnPrescricaoCancelar").addClass("d-none");
            $("#btnPrescricaoSair").removeClass("d-none");
        });
    }

    modalPrescricao(){
        $(document).ready(function () {
            $("#listaPrescricao").addClass("d-none");
            $("#btnNovaPrescricao").addClass("d-none");
            $("#novaPrescricao").removeClass("d-none");
            $("#btnSalvarPrescricao").removeClass("d-none");
            $("#btnPrescricaoCancelar").removeClass("d-none");
            $("#btnPrescricaoSair").addClass("d-none");
        });
    }

    getMedicamento(id){
        var medicamentos = this.state.medicamentos;
        for (let i = 0; i < medicamentos.length; i++) {
            if(medicamentos[i].id == id){
                return medicamentos[i].nome;
            }
        }
    }

    deletar(e, id){
        e.preventDefault();
        deletarPrescricao()
        .then(e =>{
            if(e){
                axios.put(this.api + "prescricao/delete/"+ id, {medico: $("#userId").val()})
                .then(e => excluidoSucesso())
                .catch( e => redirect(e));
            }
        })
    }

    salvar(e){
        e.preventDefault();

        var prescricao = this.state.prescricao;

        if(prescricao.length == 0){
            preencha("prescrição","#prescricao");
        }
        else{
            var parametros = {
                medico: $("#userId").val(),
                consulta: this.props.consulta,
                prescricao: prescricao
            };

            axios.post(this.api + "prescricao/store", parametros)
            .then(e => {
                salvo(); 
                axios.get(this.api + "prescricao/lista/" + this.props.consulta)
                .then(response => {
                    this.setState({prescricaos: response.data});
                })
                .catch((e) => redirect(e));
                this.modalLista();
            })
            .catch(e => redirect(e));
        }
    }

    getPosologia(id){
        switch (id) {
            case '1':
                return "2 em 2 Horas";
                break;
            case '2':
                return "4 em 4 Horas";
                break;
            case '3':
                return "6 em 6 Horas";
                break;
            case '4':
                return "8 em 8 Horas";
                break;
            case '5':
                return "10 em 10 Horas";
                break;
            case '6':
                return "12 em 12 Horas";
                break;
        }
    }

    getApresentacao(id){
        switch (id) {
            case '1':
                return "Via Oral";
                break;
            case '2':
                return "Via Intravenosa";
                break;
            case '3':
                return "Via Intramuscular";
                break;
        }
    }

    render(){
        return(
            <div className="p-0 m-0">
                <button className="btn btn-success col-md-12" id="btn-prescricao" type="button" data-toggle="modal" data-target="#prescricao"  onClick={e => this.abrirPrescricao(e)} >Prescrição</button>
                <div className="modal fade selecionado" id="prescricao" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Prescrição Médica</h5>
                                </div>
                            <div className="modal-body">
                                <div id="listaPrescricao">
                                    <div className="text-right">
                                        <button id="btnNovaPrescricao" className="btn btn-success" onClick={e => this.novaPrescricao(e)}>Adcionar Prescrição</button>
                                    </div>
                                    <div>
                                        <div className="table-responsive" >
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr scope="row">
                                                        <th scope="col" colSpan="3"> Data / Hora </th>
                                                        <th scope="col"> Médico </th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.prescricaos.map(
                                                        row =>
                                                        <tr key= {row.id}>
                                                            <td> {new Date(row.created_at).toLocaleTimeString()}</td>
                                                            <td colSpan="3"> {row.nomeMedico} </td>
                                                            <td> <button type="button" className="btn btn-danger" onClick={e => this.deletar(e, row.id)}>Excluir</button> </td>
                                                        </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-none" id="novaPrescricao">
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            <label htmlFor="quantidade" className=" col-form-label">Quantidade</label><br/>
                                            <input type="text" id="quantidade" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.item.quantidade} placeholder="Quantidade Pedida" />
                                        </div>
                                        <div className="col-md-9">
                                            <label htmlFor="prescricao" className="col-form-label">Prescrição</label><br/>
                                            <select id="prescricao" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.prescricao}>
                                                {
                                                    this.state.medicamentos.map(row => 
                                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            <label htmlFor="posologia" className="col-form-label">Posologia</label>
                                            <select id="posologia" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.posologia} >
                                                <option value="0">Selecione</option>
                                                <option value="1">2 em 2 Horas</option>
                                                <option value="2">4 em 4 Horas</option>
                                                <option value="3">6 em 6 Horas</option>
                                                <option value="4">8 em 8 Horas</option>
                                                <option value="5">10 em 10 Horas</option>
                                                <option value="6">12 em 12 Horas</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="apresentacao" className="col-form-label">Apresentação</label>
                                            <select type="text" id="apresentacao" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.apresentacao} >
                                                <option value="0">Selecione</option>
                                                <option value="1">Via Oral</option>
                                                <option value="2">Via Intravenosa</option>
                                                <option value="3">Via Intramuscular</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="observacao" className="col-form-label">Observação</label>
                                            <input type="text" id="observacao" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.observacao} placeholder="Observação"/>
                                        </div>
                                        <div className="col-md-2">
                                            <label className="col-form-label">&nbsp;</label>
                                            <button className="btn btn-success col-md-12 text-center" onClick={e => this.adicionar(e)}>Adicionar</button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="table-responsive" id="tabela">
                                            <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                                                <thead>
                                                    <tr scope="row">
                                                        <th scope="col">Quantidade</th>
                                                        <th scope="col">Prescrição</th>
                                                        <th scope="col">Posologia</th>
                                                        <th scope="col">Apresentação</th>
                                                        <th scope="col">Observação</th>
                                                        <th scope="col">&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.prescricao.map(
                                                            row => 
                                                            <tr key={row.prescricao}>
                                                                <td>{row.quantidade}</td>
                                                                <td>{this.getMedicamento(row.prescricao)}</td>
                                                                <td>{this.getPosologia(row.posologia)}</td>
                                                                <td>{this.getApresentacao(row.apresentacao)}</td>
                                                                <td>{row.observacao}</td>
                                                                <td><button onClick={e => this.cancelItem(e,row.id)} className="btn btn-danger"><img src={Cancel}/></button></td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary col-md-2" id="btnPrescricaoSair" data-dismiss="modal">Fechar</button>
                                <button type="button" className="btn btn-warning col-md-2 d-none" id="btnPrescricaoCancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                <button id="btnSalvarPrescricao" type="button" className="btn btn-primary col-md-2 d-none" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}