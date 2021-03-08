import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './componentes/header';
import Home from '../components/home';
import Footer from '../components/footer';
import Registrar from './componentes/registrar';
import Classificacao from './componentes/classificacao';
import Relatorios from './componentes/relatorios';
import Cadastros from './componentes/cadastros';

function Administrador() {
    return (
        <div style={{backgroundColor: "#00ffff"}}>
            <Router>
                <Header/>
                <div className="container text-uppercase"> 
                    <div className="row">
                        <div className="col-md-12 border shadow-lg bg-light p-3 mb-3 rounded border-dark pt-2">
                            <Route exact path="/administrador" component={Home}/>
                            <Route exact path="/administrador/registrar" component={Registrar}/>
                            <Route exact path="/administrador/classificacao" component={Classificacao}/>
                            <Route exact path="/administrador/cadastros" component={Cadastros}/>
                            <Route exact path="/administrador/relatorios" component={Relatorios}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </Router>
        </div>
    );
}

export default Administrador;

if (document.getElementById('admin')) {
    ReactDOM.render(<Administrador />, document.getElementById('admin'));
}
