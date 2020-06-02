<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Receita;
use App\Consultareceita;

class ReceitaController extends Controller
{
    public function __construct(){
        $this->middleware(["auth","medico"]);
    }

    public function lista($consulta){
        return Receita::join("consultareceitas","receitas.id","=","consultareceitas.receita")->join("users","receitas.medico","=","users.id")->where("consultareceitas.consulta","=",$consulta)->select("receitas.*","consultareceitas.consulta","users.name as medico")->get();
    }

    public function store(Request $request){
        $receita = new Receita();
        $receita->descricao = $request->descricao;
        $receita->medico = $request->medico;
        $receita->save();

        $consultaReceita = new Consultareceita();
        $consultaReceita->receita = $receita->id;
        $consultaReceita->consulta = $request->consulta;
        $consultaReceita->save();

    }

    public function update(Request $request,$id){
        $receita = Receita::find($id);
        $receita->descricao = $request->descricao;
        $receita->medico = $request->medico;
        $receita->save();
    }
}
