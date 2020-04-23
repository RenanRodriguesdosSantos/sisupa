<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Recepcao extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth','recepcao']);
    }
    public function index(){
        return view('recepcao');
    }
}
