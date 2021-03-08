<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Consulta;
use App\Atendimento;

class ConsultaController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth']);
    }

    public function edit($id){
        return Consulta::find($id);
    }
    
    public function update(Request $request, $id){
        $consulta = Consulta::find($id);

        $consulta->sintomas = $request->sintomas;
        $consulta->conduta = $request->conduta;
        $consulta->resultados = $request->resultados;
        $consulta->diagnostico = $request->diagnostico;
        $consulta->cid = $request->cid;
        $consulta->encaminhamento = $request->encaminhamento;
        $consulta->medico = $request->medico;
        $consulta->save();

        $atendimento = Atendimento::where("consulta","=",$id)->first();
        $atendimento->status = 5;
        $atendimento->save();
    }
}
