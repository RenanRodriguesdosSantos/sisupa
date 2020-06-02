<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Encaminhamento;
use App\Consultaencaminhamento;

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
        $encaminhamento->descricao = $request->descricao;
        $encaminhamento->medico = $request->medico;
        $encaminhamento->save();

        $consultaencaminhamento = new Consultaencaminhamento();
        $consultaencaminhamento->encaminhamento = $encaminhamento->id;
        $consultaencaminhamento->consulta = $request->consulta;
        $consultaencaminhamento->save();

    }

    public function update(Request $request,$id){
        $encaminhamento = Encaminhamento::find($id);
        $encaminhamento->descricao = $request->descricao;
        $encaminhamento->medico = $request->medico;
        $encaminhamento->save();
    }
}
