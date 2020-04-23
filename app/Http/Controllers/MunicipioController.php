<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Municipio;

class MunicipioController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function index($uf){
        return Municipio::where("uf","=",$uf)->get();
    }
}
