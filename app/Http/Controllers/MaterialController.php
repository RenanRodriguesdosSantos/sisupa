<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Materiai;

class MaterialController extends Controller
{
    public function __constructor(){
        $this->middleware(['auth','admin']);
    }

    public function index(){
        return Materiai::all();
    }

    public function store(Request $request){
        $material = new Materiai();
        $material->nome = $request->nome;
        $material->save();
    }

    public function update(Request $request,$id){
        $material = Materiai::find($id);
        $material->nome = $request->nome;
        $material->save();
    }
}
