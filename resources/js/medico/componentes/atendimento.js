import React, {Component} from 'react';
import Prescricao from './prescricao';
import Atestado from './atestado';
import Receita from './receita';
import Laboratoriais from './laboratoriais';
import Imagem from './imagem';

export default class Atendimento extends Component{
    constructor(){
        super();
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-primary" data-toggle="modal" data-target="#prescricao">Prescrição</button>&nbsp;
                        <button className="btn btn-primary" data-toggle="modal" data-target="#laboratoriais">Exames Laboratoriais</button>&nbsp;
                        <button className="btn btn-primary" data-toggle="modal" data-target="#imagem">Exames de Imagem</button>&nbsp;
                        <button className="btn btn-primary" data-toggle="modal" data-target="#atestado">Atestado</button>&nbsp;
                        <button className="btn btn-primary" data-toggle="modal" data-target="#receita">Receita</button>&nbsp;
                        <Prescricao/>
                        <Atestado/>
                        <Receita/>
                        <Laboratoriais/>
                        <Imagem/>
                    </div>
                </div>
            </div>
        );
    }
}