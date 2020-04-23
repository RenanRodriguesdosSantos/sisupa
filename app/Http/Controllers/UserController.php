<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'tipo' => ['required','integer']
        ]);
    }

    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'tipo' => $data['tipo'],
            'conselho' => $data['conselho']
        ]);
    }

    protected function update($id,array $data)
    {
        return User::find($id)->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'tipo' => $data['tipo'],
            'conselho' => $data['conselho']
        ]);
    }

    public function novoUsuario(Request $request){
        $data = array('name' => $request->name, 'email' => $request->email, 'tipo' => $request->tipo ,'conselho' => $request->conselho, 'password' => $request->password);
        if($this->validator($data)){
            $this->create($data);
        }
    }

    public function atualizarUsuario(Request $request, $id){
        $data = array('name' => $request->name, 'email' => $request->email, 'tipo' => $request->tipo ,'conselho' => $request->conselho, 'password' => $request->password);
        if($this->validator($data)){
            $this->update($id,$data);
        }
    }

    public function getUsuarios(){
        return User::all();
    }
}


