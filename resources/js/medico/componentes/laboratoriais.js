import React,{Component} from 'react';
import axios from 'axios';
import {redirect, salvo, cancelarEdicao, selecioneExame}from '../../components/mensagens';

export default class Laboratoriais extends Component{
    constructor(props){
        super(props);
        this.state = {
            prioridade: "2",
            exames: [],
            coluna1: [],
            coluna2: [],
            coluna3: []
        };
        this.api = "/consulta/";
        this.handleChage = this.handleChage.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }

    handleChage(e){
        var exames  = this.state.exames;
        exames[e.target.id.substring(8,e.target.id.length)].checked = e.target.checked;
        this.setState({exames: exames});
    }

    handleRadio(e){
        this.setState({prioridade: e.target.value});
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Exames Laboratoriais")
        .then(response => {
            if(response){
                $(document).ready(function() {
                    $("#laboratoriais").modal("toggle");
                })
            }
        });
    }

    abrir(e){
        e.preventDefault();
        axios.get(this.api + "exames/show")
        .then(response => {
            var exames =  response.data;
            var col1 = [];
            var col2 = [];
            var col3 = [];
            var finalCol1 = 0;
            var finalCol2 = 0;

            switch (exames.length % 3) {
                case 0:
                        finalCol1 = exames.length/3;
                        finalCol2 = (exames.length/3) * 2;
                    break;
                case 1:
                        finalCol1 = ((exames.length - 1)/3) + 1;
                        finalCol2 = (((exames.length -1 )/3) * 2) + 1;
                    break;
                case 2:
                        finalCol1 = ((exames.length -2 )/3) + 1;
                        finalCol2 = (((exames.length - 2)/3) * 2) + 2;
                    break;
            }

            for(var i = 0; i < finalCol1; i++){
                var item = {id: exames[i].id, nome: exames[i].nome, index: i};
                exames[i].checked = false;
                col1.push(item);
            }
            
            for(var i = finalCol1; i < finalCol2; i++){
                var item = {id: exames[i].id, nome: exames[i].nome, index: i};
                exames[i].checked = false;
                col2.push(item);
            }
            
            for(var i = finalCol2; i < exames.length; i++){
                var item = {id: exames[i].id, nome: exames[i].nome, index: i};
                exames[i].checked = false;
                col3.push(item);
            }
            this.setState({coluna1: col1, coluna2: col2, coluna3: col3, exames: exames});
        })
        .catch(e => redirect(e));
      
       axios.get(this.api+"exames/edit/"+this.props.consulta)
        .then(response =>{
            var exames = this.state.exames;
            for(var i = 0; i < exames.length; i++){
                for(var j = 0; j < response.data.length; j++){
                    if(exames[i].id == response.data[j].exame){
                        exames[i].checked = true;
                        exames[i].disabled = "disabled";
                        break;
                    }
                }
            }
            var prioridade = response.data.length == 0?"2":response.data[response.data.length - 1].prioridade;
            this.setState({exames: exames, prioridade: prioridade});
        })
        .catch(e => redirect(e));
        
    }

    salvar(e){
        e.preventDefault();
        var exames = {id: [], medico: this.props.medico, consulta: this.props.consulta, prioridade: this.state.prioridade};
        var umSelecionado = false;
        this.state.exames.map(row => {
            if(row.checked){
                exames.id.push(row.id);
                umSelecionado = true;
            }
        });

        if(umSelecionado){
            axios.post(this.api + "exames/store",exames)
            .then(e => {salvo();})
            .catch(e =>{redirect(e)});
            
        }
        else{
            selecioneExame();
        }
    }

    outrosExames(e){
        e.preventDefault();
        $(document).ready(function () {
            $("#returnForm").val("laboratoriais");
            $("#laboratoriais").modal("toggle");
            $("#outrosexames").modal("toggle");
        });
    }

    render(){
        return(
            <div>
                <button className="btn btn-success col-md-12" onClick={e => this.abrir(e)} type="button" data-toggle="modal" data-target="#laboratoriais">Exames Laboratoriais</button>
                <div className="modal fade selecionado" id="laboratoriais" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Solicitação de Exames Laboratoriais</h5>
                                </div>
                            <div className="modal-body">
                                <div className="form-group row border border-dark">
                                    <div className="col-md-4 text-left">
                                        {
                                            this.state.coluna1.map(
                                                row => 
                                                    <div className="form-check" key={row.id}>
                                                        <input className="form-check-input" type="checkbox" id={"exameLab" + row.index} onChange={this.handleChage} checked={this.state.exames[row.index].checked} disabled={this.state.exames[row.index].disabled}/>
                                                        <label className="form-check-label" htmlFor={"exameLab" + row.index}>{row.nome}</label>
                                                    </div>
                                            )
                                        }
                                        
                                    </div>
                                    <div className="col-md-4 text-left">
                                        {
                                            this.state.coluna2.map(
                                                row => 
                                                    <div className="form-check" key={row.id}>
                                                        <input className="form-check-input" type="checkbox" id={"exameLab" + row.index} onChange={this.handleChage} checked={this.state.exames[row.index].checked} disabled={this.state.exames[row.index].disabled}/>
                                                        <label className="form-check-label" htmlFor={"exameLab" + row.index}>{row.nome}</label>
                                                    </div>
                                            )
                                        }
                                    </div>
                                    <div className="col-md-4 text-left">
                                        {
                                            this.state.coluna3.map(
                                                row => 
                                                    <div className="form-check" key={row.id}>
                                                        <input className="form-check-input" type="checkbox" id={"exameLab" + row.index}  onChange={this.handleChage} checked={this.state.exames[row.index].checked} disabled={this.state.exames[row.index].disabled}/>
                                                        <label className="form-check-label" htmlFor={"exameLab" + row.index}>{row.nome}</label>
                                                    </div>
                                            )
                                        }
                                        
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12 text-center">
                                        <b>Prioridade: </b>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" onChange={this.handleRadio} checked={this.state.prioridade == 1}/>
                                            <label className="form-check-label" htmlFor="inlineRadio1">Urgência</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" onChange={this.handleRadio} checked={this.state.prioridade == 2} />
                                            <label className="form-check-label" htmlFor="inlineRadio2">Rotina</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <button className="btn btn-success" onClick={e => this.outrosExames(e)}>Outros Exames</button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-warning col-md-2" id="btnCancelareExames" onClick={e => this.cancelar(e)}>Cancelar</button>
                                <button id="btnSalvarExames" type="button" className="btn btn-primary col-md-2" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}