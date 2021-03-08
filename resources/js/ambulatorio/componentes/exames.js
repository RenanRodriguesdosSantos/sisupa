import React,{Component} from 'react';
import axios from 'axios';
import Aceitar from '../../imagens/accept.png';
import {redirect} from '../../components/mensagens';
import { Link } from 'react-router-dom';

export default class Exames extends Component{
    constructor(){
        super();
        this.state ={
            exames: [],
            examesImagem: [],
            examesOutros: []
        }
        this.api = "/ambulatorio/";
        axios.get(this.api + "exames/solicitados/imagem")
        .then(respose => {
            this.setState({examesImagem: respose.data})
        })
        .catch(e => redirect(e));
        axios.get(this.api + "exames/solicitados/laboratorio")
        .then(respose => {
            this.setState({exames: respose.data})
        })
        .catch(e => redirect(e));
        axios.get(this.api + "exames/solicitados/outros")
        .then(respose => {
            this.setState({examesOutros: respose.data})
        })
        .catch(e => redirect(e));

    }

    render(){
        return(
            <div >
                <h3 className="text-center">Exames Solicitados</h3>
                <div className="row">
                    <div className="col-md-12 border border-dark">
                        <h5 className="text-center">Exames de Imagem</h5>
                        <div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr scope="row">
                                            <th scope="col"> Paciente </th>
                                            <th scope="col"> Nascimento </th>
                                            <th scope="col"> Mãe </th>
                                            <th scope="col"> Prioridade </th>
                                            <th scope="col">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.examesImagem.map(
                                                row =>
                                                <tr key={row.id}>
                                                    <td>{row.paciente}</td>
                                                    <td>{new Date(row.nascimento).toLocaleDateString()}</td>
                                                    <td>{row.mae}</td>
                                                    <td> <div className="pb-md-2" style={{background: row.prioridade == 1?"#FFFF00":"#008000"}}>&nbsp;&nbsp;&nbsp;{row.prioridade == 1?"Urgência":"Rotina"}</div></td>
                                                    <td><Link to={"/ambulatorio/exames/atendimento/imagem/"+row.consulta} className="btn btn-primary"><img src={Aceitar}/></Link></td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 border border-dark">
                        <h5 className="text-center">Exames Laboratoriais</h5>
                        <div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr scope="row">
                                            <th scope="col"> Paciente </th>
                                            <th scope="col"> Nascimento </th>
                                            <th scope="col"> Mãe </th>
                                            <th scope="col"> Prioridade </th>
                                            <th scope="col">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.exames.map(
                                                row =>
                                                <tr key={row.id}>
                                                    <td>{row.paciente}</td>
                                                    <td>{new Date(row.nascimento).toLocaleDateString()}</td>
                                                    <td>{row.mae}</td>
                                                    <td> <div className="pb-md-2" style={{background: row.prioridade == 1?"#FFFF00":"#008000"}}>&nbsp;&nbsp;&nbsp;{row.prioridade == 1?"Urgência":"Rotina"}</div></td>
                                                    <td><Link to={"/ambulatorio/exames/atendimento/lab/"+row.consulta} className="btn btn-primary"><img src={Aceitar}/></Link></td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 border border-dark">
                        <h5 className="text-center">Outros Exames</h5>
                        <div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr scope="row">
                                            <th scope="col"> Paciente </th>
                                            <th scope="col"> Nascimento </th>
                                            <th scope="col"> Mãe </th>
                                            <th scope="col"> Prioridade </th>
                                            <th scope="col">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.examesOutros.map(
                                                row =>
                                                <tr key={row.id}>
                                                    <td>{row.paciente}</td>
                                                    <td>{new Date(row.nascimento).toLocaleDateString()}</td>
                                                    <td>{row.mae}</td>
                                                    <td> <div className="pb-md-2" style={{background: row.prioridade == 1?"#FFFF00":"#008000"}}>&nbsp;&nbsp;&nbsp;{row.prioridade == 1?"Urgência":"Rotina"}</div></td>
                                                    <td><Link to={"/ambulatorio/exames/atendimento/outros/"+row.consulta} className="btn btn-primary"><img src={Aceitar}/></Link></td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}