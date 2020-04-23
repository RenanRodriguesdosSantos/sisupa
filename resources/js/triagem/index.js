import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './componentes/header';
import Home from '../components/home';
import Footer from '../components/footer';
import Lista from './componentes/lista';
import Atendimento from './componentes/atendimento';
import Atendidos from './componentes/atendidos';

function Triagem() {
    return (
        <div style={{backgroundColor: "#00ffff"}} >
            <Router>
                <Header/>
                <div className="container text-uppercase"> 
                    <div className="row">
                        <div className="col-md-12 border shadow-lg bg-light p-3 mb-3 rounded border-dark pt-2">
                            <Route exact path="/triagem" component={Home}/>
                            <Route exact path="/triagem/lista" component={Lista}/>
                            <Route exact path="/triagem/atendidos" component={Atendidos}/>
                            <Route exact path="/triagem/atendimento/:atendimento" component={Atendimento}/>
                        </div>
                    </div>
                </div>
                <br/><br/><br/>
                <Footer/>
            </Router>
        </div>
    );
}

export default Triagem;

if (document.getElementById('triagem')) {
    ReactDOM.render(<Triagem />, document.getElementById('triagem'));
}
