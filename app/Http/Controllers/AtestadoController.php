<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Atestado;
use App\Consulta;

class AtestadoController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth','medico']);
    }

    public function store(Request $request){
        $atestado = new Atestado();
        $atestado->tempoAtestado = $request->tempoAtestado;
        $atestado->tipoAtividadesAtestado = $request->tipoAtividadesAtestado;
        $atestado->cid = $request->cid;
       // $atestado->apartir = $request->apartir;
        $atestado->medico = $request->medico;
        $atestado->save();

        $consulta = Consulta::find($request->consulta);
        $consulta->atestado = $atestado->id;
        $consulta->save();
        return $atestado->created_at;
    }

    public function edit($consulta){
        return Atestado::join("consultas","atestados.id","=","consultas.atestado")
        ->where("consultas.id","=",$consulta)
        ->select("atestados.*")
        ->first();
    }

    public function update(Request $request, $id){
        $atestado = Atestado::find($id);
        $atestado->tempoAtestado = $request->tempoAtestado;
        $atestado->tipoAtividadesAtestado = $request->tipoAtividadesAtestado;
        $atestado->cid = $request->cid;
       // $atestado->apartir = $request->apartir;
        $atestado->medico = $request->medico;
        $atestado->save();
        return $atestado->created_at;
    }
}
