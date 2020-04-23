<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Classificacao;

class ClassificacaoController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function show($id){
        return Classificacao::join('discriminadors','classificacaos.discriminador','=','discriminadors.id')->where('classificacaos.fluxograma','=',$id)->select("classificacaos.*","discriminadors.nome")->get();
    }

    public function store(Request $request){
        $classificacao = Classificacao::where("fluxograma","=",$request->fluxograma)->where("discriminador","=",$request->discriminador)->first();
        if(!$classificacao){
            $classificacao = new Classificacao();
        }
        $classificacao->fluxograma = $request->fluxograma;
        $classificacao->discriminador = $request->discriminador;
        $classificacao->cor = $request->cor;
        $classificacao->save();

    }

    public function showComDiscriminadores($id){
        $classificacao = Classificacao::join('fluxogramas','classificacaos.fluxograma','=','fluxogramas.id')->join('discriminadors','classificacaos.discriminador','=','discriminadors.id')->select("classificacaos.*","discriminadors.nome as nomeDiscriminador","fluxogramas.nome as nomeFluxograma")->find($id);
        $discriminadores = $this->show($classificacao->fluxograma);
        $response = ["classificacao" => $classificacao, "discriminadores" => $discriminadores];
        return response($response);
    }
}
