<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paciente;

class PacienteController extends Controller
{
    public function __construc(){
        $this->middleware('auth');
    }
    public function store(Request $request)
    {
        $paciente = new Paciente();
        $paciente->nome = $request->nome;
        $paciente->mae = $request->mae;
        $paciente->pai = $request->pai;
        $paciente->sexo = $request->sexo;
        $paciente->nascimento = $request->nascimento;
        $paciente->logradouro = $request->logradouro;
        $paciente->numero = $request->numero;
        $paciente->telefone = $request->telefone;
        $paciente->complemento = $request->complemento;
        $paciente->profissao = $request->profissao;
        $paciente->cpf = $request->cpf;
        $paciente->rg = $request->rg;
        $paciente->cns = $request->cns;
        
        $paciente->bairro = $request->bairro;
        $paciente->municipio = $request->municipio;
        $paciente->naturalidade = $request->naturalidade;
        $paciente->etnia = $request->etnia;

        $paciente->save();

        return Paciente::first()->orderBy("id","desc")->value("id");
    }
    public function show($nome,$mae,$nascimento = null)
    {
        $nome = $nome == "_"?"":$nome; // no caso de parametros vazios;
        $mae = $mae == "_"?"":$mae;   // no caso de parametros vazios;

        return Paciente::join("etnias","pacientes.etnia","=","etnias.id")
                        ->join("municipios as N","pacientes.naturalidade", "=", "N.id")
                        ->join("municipios","pacientes.municipio", "=", "municipios.id")
                        ->select("pacientes.*","etnias.nome as etnia","N.nome as naturalidade","N.uf as ufn","municipios.nome as municipio","municipios.uf as uf")
                        ->where("pacientes.nome","LIKE",$nome."%")
                        ->where("pacientes.mae","LIKE",$mae."%")
                        ->where(function ($query) use ($nascimento){
                                if(isset($nascimento)){
                                    $query->whereDate("pacientes.nascimento",$nascimento);
                                }
                        })
                        ->paginate(4);
    }
    public function edit($id){
        return Paciente::join("etnias","pacientes.etnia","=","etnias.id")
                        ->join("municipios as N","pacientes.naturalidade", "=", "N.id")
                        ->join("municipios","pacientes.municipio", "=", "municipios.id")
                        ->select("pacientes.*","etnias.nome as etnia","N.nome as naturalidade","N.uf as ufn","municipios.nome as municipio","municipios.uf as uf")
                        ->find($id);
    }
    public function update(Request $request, $id)
    {
        $paciente = Paciente::find($id);
        $paciente->nome = $request->nome;
        $paciente->mae = $request->mae;
        $paciente->pai = $request->pai;
        $paciente->sexo = $request->sexo;
        $paciente->nascimento = $request->nascimento;
        $paciente->logradouro = $request->logradouro;
        $paciente->numero = $request->numero;
        $paciente->telefone = $request->telefone;
        $paciente->complemento = $request->complemento;
        $paciente->profissao = $request->profissao;
        $paciente->cpf = $request->cpf;
        $paciente->rg = $request->rg;
        $paciente->cns = $request->cns;
        
        $paciente->bairro = $request->bairro;
        $paciente->municipio = $request->municipio;
        $paciente->naturalidade = $request->naturalidade;
        $paciente->etnia = $request->etnia;
        $paciente->save();
    }
}
