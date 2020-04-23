<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Fluxograma;

class FluxogramaController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function index()
    {
        return Fluxograma::all();
    }

    public function store(Request $request){
        $fluxograma = new Fluxograma();
        $fluxograma->nome  = $request->nome;
        $fluxograma->save();
    }

    public function update(Request $request, $id)
    {
        $fluxograma = Fluxograma::find($id);
        $fluxograma->nome  = $request->nome;
        $fluxograma->save();
    }
}
