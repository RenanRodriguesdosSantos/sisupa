<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Ambulatorio extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth','ambulatorio']);
    }
    public function index(){
        return view('ambulatorio');
    }
}
