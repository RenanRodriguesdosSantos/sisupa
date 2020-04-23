<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Atendimento;

class AtendimentoController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function show($nome,$mae,$nascimento,$datainicial,$datafinal){
        $nome = $nome == "0"?"":$nome; // no caso de parametros vazios;
        $mae = $mae == "0"?"":$mae;   // no caso de parametros vazios;
        $nascimento = $nascimento == "0"?null:$nascimento;   // no caso de parametros vazios;
        $datainicial = $datainicial == "0"?date("Ymd"):$datainicial;   // no caso de parametros vazios;
        $datafinal = $datafinal == "0"?null:$datafinal;   // no caso de parametros vazios;
        

        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("municipios","pacientes.municipio","=","municipios.id")
                        ->select("atendimentos.*","pacientes.id as idpacientes","pacientes.nome as paciente","pacientes.bairro as bairro","municipios.nome as municipio","municipios.uf as uf","pacientes.mae","pacientes.nascimento")
                        ->orderBy("created_at","desc")
                        ->where('pacientes.nome','LIKE',$nome.'%')
                        ->where('pacientes.mae','LIKE',$mae.'%')
                        ->where(function ($query) use ($nascimento,$datainicial,$datafinal){
                            if(isset($nascimento)){
                                $query->whereDate('pacientes.nascimento',$nascimento);
                            }
                            if(isset($datainicial)){
                                if(isset($datafinal)){
                                    $query->whereBetween("atendimentos.created_at",[$datainicial,date('Ymd', strtotime('+1 day', strtotime($datafinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$datainicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaTriagem(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento")
        ->whereNull('atendimentos.triagem')
        ->paginate(20);
    }

    public function listaTriagemAtendidos(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento")
        ->whereNotNull('atendimentos.triagem')->whereNull('atendimentos.consulta')
        ->paginate(20);
    }

    public function getAtendimento($id){
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")->select("atendimentos.*","pacientes.nome as nome")->find($id);
    }

    public function listaConsulta(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->join('triagems','atendimentos.triagem','=','triagems.id')
        ->join('classificacaos','triagems.classificacao','=','classificacaos.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento","classificacaos.cor")
        ->whereNotNull('atendimentos.triagem')->whereNull('atendimentos.consulta')
        ->get();
    }
}
