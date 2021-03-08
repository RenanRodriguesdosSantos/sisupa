import React,{Component} from 'react';
import axios from 'axios';
import {redirect, cancelarEdicao, salvo} from '../../components/mensagens';

export default class Laboratorio extends Component{
    constructor(props){
        super(props);
        this.state ={
            consulta: this.props.match.params.consulta,
            exames: [],
            paciente: "",
            mae: ""
        }

        this.api = "/ambulatorio/";

        axios.get(this.api + "exames/dados/lab/" + this.state.consulta)
        .then(response => {
            var exames = response.data;

            for(var i = 0; i < exames.length; i++){
                exames[i].index = i;
                exames[i].observacao = exames[i].observacao?exames[i].observacao:"";
            }

            this.setState({exames: exames, paciente: response.data[0].paciente, mae: response.data[0].mae});
        })
        .catch(e => redirect(e));

        this.handleChange = this.handleChange.bind(this);
    } 

    handleChange(e){
        var exames  = this.state.exames;
        exames[e.target.id.substring(3,e.target.id.length)].observacao = e.target.value;
        this.setState({exames: exames});
    }

    salvar(e){
        e.preventDefault();
        var exames = [];

        this.state.exames.map(row  =>{
            exames.push({id: row.id, observacao: row.observacao, tecnico: $("#userId").val()})
        });
        axios.post(this.api + "exames/lab/atendimento/store",{exames: exames})
        .then(e => {
            salvo();
            window.location.replace("/ambulatorio/exames");
        })
        .catch(e => redirect(e));
    }

    cancelar(e){
        e.preventDefault();
        cancelarEdicao("Exames de Laboratório")
        .then(response => {
            if(response){
                window.location.replace("/ambulatorio/exames");
            }
        });
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-6">
                        Paciente: <h5>{this.state.paciente}</h5>
                    </div>
                    <div className="col-md-6">
                        Mãe: <h5>{this.state.mae}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 border border-dark">
                        <h5 className="text-center">Exames de Laboratório</h5>
                        <div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr scope="row">
                                            <th scope="col"> Exame </th>
                                            <th scope="col"> Prioridade </th>
                                            <th scope="col"> Médico </th>
                                            <th scope="col" colSpan="2"> Observação </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.exames.map(
                                                row =>
                                                <tr key={row.id}>
                                                    <td>{row.exame}</td>
                                                    <td> <div className="pb-md-2" style={{background: row.prioridade == 1?"#FFFF00":"#008000"}}>&nbsp;&nbsp;&nbsp;{row.prioridade == 1?"Urgência":"Rotina"}</div></td>
                                                    <td> Dr(a) {row.medico} </td>
                                                    <td colSpan="2"><input type="text" id={"lab" + row.index} className="form-control" placeholder="Observação" onChange={this.handleChange} value={this.state.exames[row.index].observacao}/></td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
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