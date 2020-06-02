<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Medicamento;

class MedicamentoController extends Controller
{
    public function __constructor(){
        $this->middleware(['auth','admin']);
    }

    public function index(){
        return Medicamento::all();
    }

    public function store(Request $request){
        $medicamento = new Medicamento();
        $medicamento->nome = $request->nome;
        $medicamento->save();
    }

    public function update(Request $request, $id){
        $medicamento = Medicamento::find($id);
        $medicamento->nome = $request->nome;
        $medicamento->save();
    }
}
