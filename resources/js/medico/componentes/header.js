import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../imagens/logo.png';
import User from '../../components/user';
export default class Header extends Component{
    render(){
        return(
            <div id="header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand nav-link mr-5" to="/home"><img src={Logo} />SISUPA</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/consulta"><div id="home">Home</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/consulta/lista" ><div id="home">Lista de Paciente</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/consulta/atendidos"><div id="home">Atendidos</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/consulta/ajuda"><div id="home">Ajuda</div><span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>
                        <User/>       
                    </div>
                </nav>
            </div>
        );
    }
    
}
