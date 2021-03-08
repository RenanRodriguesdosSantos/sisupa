import React,{Component} from 'react';
import Ambulatorio from './relatorios/ambulatorio';
import Consulta from './relatorios/consulta';
import Exames from './relatorios/exames';
import Geral from './relatorios/geral';
import Triagem from './relatorios/triagem';

export default class Relatorios extends Component{
    render(){
        return(
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="relatorioGeral-tab" data-toggle="tab" href="#relatorioGeral" role="tab" aria-controls="relatorioGeral" aria-selected="true">Relatório Geral</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="relatorioTriagem-tab" data-toggle="tab" href="#relatorioTriagem" role="tab" aria-controls="relatorioTriagem" aria-selected="false">Relatório Triagem</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="relatorioConsulta-tab" data-toggle="tab" href="#relatorioConsulta" role="tab" aria-controls="relatorioConsulta" aria-selected="false">Relatório Consulta</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="relatorioAmbulatorio-tab" data-toggle="tab" href="#relatorioAmbulatorio" role="tab" aria-controls="relatorioAmbulatorio" aria-selected="false">Relatório Ambulatório</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="relatorioExames-tab" data-toggle="tab" href="#relatorioExames" role="tab" aria-controls="relatorioExames" aria-selected="false">Relatório Exames</a>
                        </li>
                    </ul>
                    <div className="tab-content mt-md-4" id="myTabContent">
                        <div className="tab-pane fade show active" id="relatorioGeral" role="tabpanel" aria-labelledby="relatorioGeral-tab">
                            <Geral/>
                        </div>
                        <div className="tab-pane fade" id="relatorioTriagem" role="tabpanel" aria-labelledby="relatorioTriagem-tab">
                            <Triagem/>
                        </div>
                        <div className="tab-pane fade" id="relatorioConsulta" role="tabpanel" aria-labelledby="relatorioConsulta-tab">
                            <Consulta/>
                        </div>
                        <div className="tab-pane fade" id="relatorioAmbulatorio" role="tabpanel" aria-labelledby="relatorioAmbulatorio-tab">
                            <Ambulatorio/>
                        </div>
                        <div className="tab-pane fade" id="relatorioExames" role="tabpanel" aria-labelledby="relatorioExames-tab">
                            <Exames/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}