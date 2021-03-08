import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './componentes/header';
import Home from '../components/home';
import Footer from '../components/footer';
import Lista from './componentes/lista';
import Atendimento from './componentes/atendimento';
import Exames from './componentes/exames';
import Imagem from './componentes/imagem';
import Laboratorio from './componentes/laboratorio';
import Outros from './componentes/outros';
import Atendidos from './componentes/atendidos';

function Ambulatorio() {
    return (
        <div style={{backgroundColor: "#00ffff"}} >
            <Router>
                <Header/>
                <div className="container text-uppercase"> 
                    <div className="row">
                        <div className="col-md-12 border shadow-lg bg-light p-3 mb-3 rounded border-dark pt-2">
                            <Route exact path="/ambulatorio" component={Home}/>
                            <Route exact path="/ambulatorio/lista" component={Lista}/>
                            <Route exact path="/ambulatorio/exames" component={Exames}/>
                            <Route exact path="/ambulatorio/atendidos" component={Atendidos}/>
                            <Route exact path="/ambulatorio/atendimento/:prescricao" component={Atendimento}/>
                            <Route exact path="/ambulatorio/exames/atendimento/imagem/:consulta" component={Imagem}/>
                            <Route exact path="/ambulatorio/exames/atendimento/lab/:consulta" component={Laboratorio}/>
                            <Route exact path="/ambulatorio/exames/atendimento/outros/:consulta" component={Outros}/>
                        </div>
                    </div>
                </div>
                <br/><br/><br/>
                <Footer/>
            </Router>
        </div>
    );
}

export default Ambulatorio;

if (document.getElementById('ambulatorio')) {
    ReactDOM.render(<Ambulatorio />, document.getElementById('ambulatorio'));
}