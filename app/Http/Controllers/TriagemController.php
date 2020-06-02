<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Triagem;
use App\Atendimento;
use App\Events\NovaTriagem;

class TriagemController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }
    
    public function store(Request $request){
        $triagem = new Triagem();
        $triagem->descricao = $request->descricao;
        $triagem->saturacao = $request->saturacao;
        $triagem->fc = $request->fc;
        $triagem->glasgow = $request->glasgow;
        $triagem->pa = $request->pa;
        $triagem->hgt = $request->hgt;
        $triagem->peso = $request->peso;
        $triagem->tax = $request->tax;
        $triagem->classificacao = $request->classificacao;
        $triagem->enfermeiro = $request->enfermeiro;
        $triagem->save();


        $atendimento = Atendimento::find($request->id);
        $atendimento->triagem = $triagem->id;
        $atendimento->save();

        event(new NovaTriagem());
    }
    public function edit($id){
        return Triagem::find($id);
    }
    
    public function update(Request $request, $id){
        $triagem = Triagem::find($id);
        $triagem->descricao = $request->descricao;
        $triagem->saturacao = $request->saturacao;
        $triagem->fc = $request->fc;
        $triagem->glasgow = $request->glasgow;
        $triagem->pa = $request->pa;
        $triagem->hgt = $request->hgt;
        $triagem->peso = $request->peso;
        $triagem->tax = $request->tax;
        $triagem->classificacao = $request->classificacao;
        $triagem->enfermeiro = $request->enfermeiro;
        $triagem->save();

        $atendimento = Atendimento::where("triagem","=",$id)->first();
        $atendimento->status = 3;
        $atendimento->save();

        event(new NovaTriagem());
    }
}
