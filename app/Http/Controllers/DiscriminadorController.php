<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Discriminador;

class DiscriminadorController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function index()
    {
        return Discriminador::all();
    }

    public function store(Request $request){
        $discriminador = new Discriminador();
        $discriminador->nome  = $request->nome;
        $discriminador->save();
    }

    public function update(Request $request, $id)
    {
        $discriminador = Discriminador::find($id);
        $discriminador->nome  = $request->nome;
        $discriminador->save();
    }
}
