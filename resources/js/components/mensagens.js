import React from 'react';
import swal from '@sweetalert/with-react';

function redirect(e){
    if (e.response || e.request) {
        swal({
            title: "Erro",
            icon: "error",
            closeOnClickOutside: false,
            closeOnEsc: false,
            button: false,
            content: (
                <div>
                    <h3>Ocorreu um erro de conexão!</h3>
                    <h4>Você será redirecionado à página Home.</h4>
                    <p>Status do Erro: {e.response.status}</p>
                    <a href="/" className="btn btn-warning" > Está Bem! </a>
                </div>
            )
        });
    } 
}

function salvo() {
    swal({
        title: "Salvo",
        icon: "success",
        text: "Salvo com sucesso!",
        timer: 3000,
        button: "Está Bem!"
    });
}

function excluidoSucesso() {
    swal({
        title: "Excluido",
        icon: "success",
        text: "Excluido com sucesso!",
        timer: 3000,
        button: "Está Bem!"
    });
}

function preencha(campo, id) {
    swal({
        title: "Informação",
        icon: "info",
        button: false,
        content: (
            <div>
                <h3>Preencha o campo {campo}!</h3>
                <button type="button" className="btn btn-warning" onClick={e => {e.preventDefault(); swal.close(); $(document).ready(() =>{ $(id).focus()});}}> Está bem </button>
            </div>
        )
    });
}

function selecionePaciente() {
    swal({
        title: "Informação",
        icon: "info",
        button: false,
        content: (
            <div>
                <h3>Selecione um Paciente!</h3>
                <button type="button" className="btn btn-warning" onClick={e => {e.preventDefault(); swal.close(); $(document).ready(() =>{ $("#btnBuscarPaciente").focus()});}}> Está bem </button>
            </div>
        )
    });
}

function selecioneExame() {
    swal({
        title: "Informação",
        icon: "info",
        button: false,
        content: (
            <div>
                <h3>Selecione pelo menos um Exame!</h3>
                <button type="button" className="btn btn-warning" onClick={e => {e.preventDefault(); swal.close();}}> Está bem </button>
            </div>
        )
    });
}

function senhasDif() {
    swal({
        title: "Informação",
        icon: "info",
        text: "Senhas diferentes!",
        button: "Está Bem!"
    });
}

function continuarAtender(modulo){
    swal({
        title: "Atendimento",
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
        button: false,
        content: (
            <div>
                <h3>O paciente já começou atendimento com outro profissional!</h3>
                <h4>Deseja continuar a atender este paciente?</h4>
                <button type="button" className="btn btn-warning col-md-3 border" onClick={e => {e.preventDefault(); swal.close(); window.location.replace("/"+ modulo +"/lista");}}> Não </button>
                <button type="button" className="btn btn-success col-md-3 border" onClick={e => {e.preventDefault(); swal.close();}}> Sim </button>
            </div>
        )
    })
}

function cancelarEdicao(form){
    return swal({
        title: "Atendimento",
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: "    NÃO   ",
                value: false,
                visible: true,
                className: "btn btn-warning"
            },
            sim: {
                text: "  SIM   ",
                value: true,
                visible: true,
                className: "btn btn-primary"
            }
        },
        content: (
            <div>
                <h3>Deseja sair do formulário de {form} sem salvar?</h3>
            </div>
        )
    });
}

function deletarPrescricao(){
    return swal({
        title: "Excluir Prescrição",
        icon: "error",
        closeOnClickOutside: false,
        closeOnEsc: false,
        text: "Deseja realmente excluir esta Prescrição?",
        buttons: {
            cancel: {
                text: "    Não   ",
                value: false,
                visible: true,
                className: "btn btn-warning"
            },
            sim: {
                text: "  Sim Excluir   ",
                value: true,
                visible: true,
                className: "btn btn-danger"
            }
        }
    });
}

export {redirect,salvo,preencha, senhasDif, selecionePaciente, continuarAtender, cancelarEdicao, selecioneExame, deletarPrescricao, excluidoSucesso};
