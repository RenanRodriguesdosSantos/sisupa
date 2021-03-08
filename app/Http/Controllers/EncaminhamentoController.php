<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Encaminhamento;
use App\Consultaencaminhamento;
use App\Atendimento;

class EncaminhamentoController extends Controller
{
    public function __construct(){
        $this->middleware(["auth","medico"]);
    }

    public function lista($consulta){
        return Encaminhamento::join("consultaencaminhamentos","encaminhamentos.id","=","consultaencaminhamentos.encaminhamento")->join("users","encaminhamentos.medico","=","users.id")->where("consultaencaminhamentos.consulta","=",$consulta)->select("encaminhamentos.*","users.name as medico")->get();
    }

    public function store(Request $request){
        $encaminhamento = new Encaminhamento();
        $encaminhamento->servico = $request->servico;
        $encaminhamento->entidade = $request->entidade;
        $encaminhamento->historia = $request->historia;
        $encaminhamento->exames = $request->exames;
        $encaminhamento->hd = $request->hd;
        $encaminhamento->medico = $request->medico;
        $encaminhamento->save();

        $consultaencaminhamento = new Consultaencaminhamento();
        $consultaencaminhamento->encaminhamento = $encaminhamento->id;
        $consultaencaminhamento->consulta = $request->consulta;
        $consultaencaminhamento->save();

        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                            ->join("municipios","pacientes.municipio","=","municipios.id")
                            ->where("atendimentos.consulta","=",$request->consulta)
                            ->select("pacientes.nome as paciente","municipios.nome as municipio","pacientes.nascimento","pacientes.cns")
                            ->get();
    }

    public function update(Request $request,$id){
        $encaminhamento = Encaminhamento::find($id);
        $encaminhamento->servico = $request->servico;
        $encaminhamento->entidade = $request->entidade;
        $encaminhamento->historia = $request->historia;
        $encaminhamento->exames = $request->exames;
        $encaminhamento->hd = $request->hd;
        $encaminhamento->medico = $request->medico;
        $encaminhamento->save();

        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                            ->join("municipios","pacientes.municipio","=","municipios.id")
                            ->where("atendimentos.consulta","=",$request->consulta)
                            ->select("pacientes.nome as paciente","municipios.nome as municipio","pacientes.nascimento","pacientes.cns")
                            ->get();
    }
}
