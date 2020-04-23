<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Triagem extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth','triagem']);
    }
    public function index(){
        return view('triagem');
    }
}
