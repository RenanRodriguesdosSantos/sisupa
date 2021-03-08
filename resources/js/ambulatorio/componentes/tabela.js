import React from 'react';
import {Link} from 'react-router-dom';
import Aceitar from '../../imagens/accept.png';

function Tabela(props){
    return(
        <div>
            <div className="table-responsive" >
                <table className="table table-striped">
                    <thead>
                        <tr scope="row">
                            <th scope="col" colSpan="3"> Paciente </th>
                            <th scope="col" colSpan="3"> Mãe </th>
                            <th scope="col"> Nascimento </th>
                            <th scope="col"> Bairro</th>
                            <th scope="col"> Hora </th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.atendimentos.map(
                            row =>
                            <tr key= {row.prescricao}>
                                <td colSpan="3"> {row.paciente} </td>
                                <td colSpan="3"> {row.mae} </td>
                                <td> {new Date(row.nascimento).toLocaleDateString()} </td>
                                <td> {row.bairro} </td>
                                <td> {new Date(row.created_at).toLocaleTimeString()}</td>
                                <td><Link  to={"/ambulatorio/atendimento/" + row.prescricao} className="btn btn-primary"><img src={Aceitar}/></Link></td>
                            </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Tabela;