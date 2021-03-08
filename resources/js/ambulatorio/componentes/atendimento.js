import React, { Component } from "react";
import axios from 'axios';
import Cancel from '../../imagens/cancel.png';
import { redirect, cancelarEdicao, salvo} from "../../components/mensagens";

export default class Atendimento extends Component{
    constructor(props){
        super(props);
        this.state ={
            id: this.props.match.params.prescricao,
            paciente: "",
            medico: "",
            prescricao: [],
            materiais: [],
            item: {id: "", quantidade: "", material: ""},
            itens: [],
            itensSalvo: [],
            observacao: ""
        }
        this.api = "/ambulatorio/";
        this.handleChage = this.handleChage.bind(this);

        $(document).ready(function(){
            $("#header").addClass("d-none");
        })

        axios.get(this.api + "materiais/lista")
        .then(response => {
            this.setState({materiais: response.data});
        })
        .catch((e) => redirect(e));

        axios.get(this.api + "materiais/salvos/"+ this.state.id)
        .then(response => {
            var observacao = response.data.prescricao.observacao?response.data.prescricao.observacao:"";
            this.setState({itensSalvo: response.data.materiais, observacao: observacao});
        })
        .catch((e) => redirect(e));

        axios.get(this.api + "prescricao/dados/" + this.state.id)
        .then(response => {
            this.setState({prescricao: response.data.prescricaos, paciente: response.data.dados[0].paciente, medico: response.data.dados[0].medico})
        })
        .catch(e => redirect());
    }

    handleChage(e){
        e.preventDefault();
        var campo = e.target.id;
        var value = e.target.value;
        if(campo != "observacao"){
            var item = this.state.item;
            item[campo] = value;
            this.setState({item: item});
        }
        else{
            this.setState({observacao: value});
        }

    }

    cancelItem(e,id){
        e.preventDefault();
        var itens = this.state.itens;
        itens.splice(id-1,1);

        for(var i = 0; i < itens.length; i++){
            itens[i].id = i + 1;
        }
        this.setState({itens: itens});
    }

    getPosologia(id){
        switch (id) {
            case 1:
                return "2 em 2 Horas";
                break;
            case 2:
                return "4 em 4 Horas";
                break;
            case 3:
                return "6 em 6 Horas";
                break;
            case 4:
                return "8 em 8 Horas";
                break;
            case 5:
                return "10 em 10 Horas";
                break;
            case 6:
                return "12 em 12 Horas";
                break;
        }
    }

    getApresentacao(id){
        switch (id) {
            case 1:
                return "Via Oral";
                break;
            case 2:
                return "Via Intravenosa";
                break;
            case 3:
                return "Via Intramuscular";
                break;
        }
    }

    adicionar(e){
        e.preventDefault();
        var item = this.state.item;
        if(!item.quantidade){
            preencha("quantidade","#quantidade");
        }
        else if(!item.material){
            preencha("material","#material");
        }
        else{
            var itens = this.state.itens;
            item.id = itens.length + 1;
            itens.push(item);
            this.setState({itens: itens,item: {id: "",quantidade: "", material: ""}});
        }
    }

    getMaterial(id){
        var materiais = this.state.materiais;
        for (let i = 0; i < materiais.length; i++) {
            if(materiais[i].id == id){
                return materiais[i].nome;
            }
        }
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Atendimento Ambulatorial")
        .then(response => {
            if(response){
                window.location.replace("/ambulatorio/lista");
            }
        });
    }

    salvar(e){
        e.preventDefault();
        var prescricao = {
            prescricao: this.state.id,
            observacao: this.state.observacao,
            tecnico: $("#userId").val(),
            materiais: this.state.itens
        }

        axios.post(this.api + "store",prescricao)
        .then(e => {
            salvo(); 
            window.location.replace("/ambulatorio/lista");
        })
        .catch(e => redirect(e));
    }

    render(){
        return(
            <div>
                <h3 className="text-center">Prescrição Médica</h3>
                <div className="row">
                    <div className="col-md-6">
                        Paciente: <h5>{this.state.paciente}</h5>
                    </div>
                    <div className="col-md-6">
                        Médico(a): <h5>{this.state.medico}</h5>
                    </div>
                </div>
                <div className="table-responsive" id="tabela">
                    <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                        <thead>
                            <tr scope="row">
                                <th scope="col">Quantidade</th>
                                <th scope="col">Prescrição</th>
                                <th scope="col">Posologia</th>
                                <th scope="col">Apresentação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.prescricao.map(
                                    row => 
                                    <tr key={row.idPrescricaoMedicamento}>
                                        <td>{row.quantidade}</td>
                                        <td>{row.medicamento}</td>
                                        <td>{this.getPosologia(row.posologia)}</td>
                                        <td>{this.getApresentacao(row.apresentacao)}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <h3 className="text-center"> Listagem de Material</h3>
                <div className="form-group row">
                    <div className="col-md-3">
                        <label htmlFor="quantidade" className=" col-form-label">Quantidade</label><br/>
                        <input type="text" id="quantidade" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.item.quantidade} placeholder="Quantidade Pedida" />
                    </div>
                    <div className="col-md-7">
                        <label htmlFor="material" className="col-form-label">Material</label><br/>
                        <select id="material" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.material}>
                            {
                                this.state.materiais.map(row => 
                                    <option value={row.id} key={row.id}>{row.nome}</option>
                                )
                            }
                        </select>
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
                                    <th scope="col">Material</th>
                                    <th scope="col">&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.itensSalvo.map(
                                        row => 
                                        <tr key={row.id}>
                                            <td>{row.quantidade}</td>
                                            <td>{this.getMaterial(row.material)}</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    )
                                }
                                {
                                    this.state.itens.map(
                                        row => 
                                        <tr key={row.id}>
                                            <td>{row.quantidade}</td>
                                            <td>{this.getMaterial(row.material)}</td>
                                            <td><button onClick={e => this.cancelItem(e,row.id)} className="btn btn-danger"><img src={Cancel}/></button></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="observacao" className="col-form-label">Observação</label>
                        <textarea className="form-control col-md-12" id="observacao" onChange={this.handleChage} value={this.state.observacao} placeholder="Observação"></textarea>
                    </div>
                </div>
                <br/><br/>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button type="button" className="btn btn-warning col-md-3 border" onClick={e => this.cancelar(e)}>Cancelar</button>
                        <button type="button" className="btn btn-primary col-md-3 border" onClick={e => this.salvar(e)}>Salvar</button>
                    </div>
                </div>
            </div>
        );
    }
}