<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Prescricao;
use App\Prescricaomedicamento;
use App\Prescricaoconsulta;

class PrescricaoController extends Controller
{
    public function __construct(){
        $this->middleware("auth");
    }

    public function lista($consulta){
        return Prescricao::join("prescricaoconsultas","prescricaos.id","=","prescricaoconsultas.prescricao")->where("prescricaoconsultas.consulta","=",$consulta)->get();
    }

    public function store(Request $request){
        $prescricao = new Prescricao();

        $prescricao->medico = $request->medico;
        $prescricao->observacao = $request->observacao;

        $prescricao->save();
        $prescricaoConsulta = new Prescricaoconsulta();
        $prescricaoConsulta->consulta = $request->consulta;
        $prescricaoConsulta->prescricao = $prescricao->id;
        $prescricaoConsulta->save();
        

        foreach ($request->prescricao as $value) {
            $medicamento = new Prescricaomedicamento();
            $medicamento->posologia = $value["posologia"];
            $medicamento->apresentacao = $value["apresentacao"];
            $medicamento->quantidade = $value["quantidade"];
            $medicamento->medicamento = $value["prescricao"];
            $medicamento->prescricao = $prescricao->id;
            $medicamento->save();
        } 
    }

    public function listaPacientes(){
        return Prescricao::join("prescricaoconsultas","prescricaos.id","=","prescricaoconsultas.prescricao")->where("prescricaoconsultas.consulta","=",$consulta)->get();
    }

}
