<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Recepcao;
use App\Atendimento;
use App\Events\NovaRecepcao;

class RecepcaoController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }
    public function store(Request $request){
        $recepcao = new Recepcao();
        $recepcao->recepcionista = $request->recepcionista;
        $recepcao->motivo = $request->motivo;
        $recepcao->origem = $request->origem;
        $recepcao->save();

        $atendimento = new Atendimento();
        $atendimento->paciente = $request->paciente;
        $atendimento->recepcao = $recepcao->id;
        $atendimento->status = 1;
        $atendimento->save();

        event(new NovaRecepcao());
    }
}
