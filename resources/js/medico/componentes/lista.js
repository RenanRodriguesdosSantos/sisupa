import React,{Component} from 'react';
import axios from 'axios';
import Tabela from './tabela';

export default class Lista extends Component{
    constructor(){
        super();
        this.state = {
            vermelho: [],
            laranja: [],
            amarelo: [],
            verde: [],
            azul: []
        };

        this.api = "/consulta/";
        axios.get(this.api + 'atendimentos/dados/lista')
        .then(response => {
            this.triagem(response.data);
        })
        .catch((e) => this.redirectToHome(e));

        Echo.private('consulta')
        .listen('NovaTriagem', (response) => {
            this.triagem(JSON.parse(response.atendimentos));
        });
    }

    redirectToHome(e){
        if (e.response || e.request) {
            alert("OCORREU UM ERRO DE CONEXÃO \n Você será redirecionado à página HOME!\nStatus do Erro" + e.response.status );
            window.location.replace("/");
        } 
    }

    triagem(atendimentos){
        console.log(atendimentos)
        this.setState({vermelho: [], laranja: [], amarelo: [], verde: [], azul: []});
        atendimentos.map(
            row => {
                switch (row.cor) {
                    case 1:
                        var vermelho = this.state.vermelho;
                        vermelho.push(row);
                        this.setState({vermelho: vermelho});
                        break;
                    case 2:
                        var laranja = this.state.laranja;
                        laranja.push(row);
                        this.setState({laranja: laranja});
                        break;
                    case 3:
                        var amarelo = this.state.amarelo;
                        amarelo.push(row);
                        this.setState({amarelo: amarelo});
                        break;
                    case 4:
                        var verde = this.state.verde;
                        verde.push(row);
                        this.setState({verde: verde});
                        break;
                    case 5:
                        var azul = this.state.azul;
                        azul.push(row);
                        this.setState({azul: azul});
                        break;
                }
            }
        )
    }

    render(){
        return(
            <div>
                <h2 className="text-center">Lista de Pacientes para a Consulta Médica</h2>
                <div className="col-md-12">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="vermelho-tab" data-toggle="tab" href="#vermelho" role="tab" aria-controls="vermelho" aria-selected="true">Vermelho | {this.state.vermelho.length}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="laranja-tab" data-toggle="tab" href="#laranja" role="tab" aria-controls="laranja" aria-selected="false">Laranja | {this.state.laranja.length}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="amarelo-tab" data-toggle="tab" href="#amarelo" role="tab" aria-controls="amarelo" aria-selected="false">Amarelo | {this.state.amarelo.length}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="verde-tab" data-toggle="tab" href="#verde" role="tab" aria-controls="verde" aria-selected="false">Verde | {this.state.verde.length}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="azul-tab" data-toggle="tab" href="#azul" role="tab" aria-controls="azul" aria-selected="false">Azul | {this.state.azul.length}</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="vermelho" role="tabpanel" aria-labelledby="vermelho-tab">
                            <Tabela atendimentos={this.state.vermelho}/>
                        </div>
                        <div className="tab-pane fade" id="laranja" role="tabpanel" aria-labelledby="laranja-tab">
                            <Tabela atendimentos={this.state.laranja}/>
                        </div>
                        <div className="tab-pane fade" id="amarelo" role="tabpanel" aria-labelledby="amarelo-tab">
                            <Tabela atendimentos={this.state.amarelo}/>
                        </div>
                        <div className="tab-pane fade" id="verde" role="tabpanel" aria-labelledby="verde-tab">
                            <Tabela atendimentos={this.state.verde}/>
                        </div>
                        <div className="tab-pane fade" id="azul" role="tabpanel" aria-labelledby="azul-tab">
                            <Tabela atendimentos={this.state.azul}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}