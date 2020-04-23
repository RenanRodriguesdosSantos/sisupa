<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes(['register' => false]);

Auth::routes();
Route::get('/',function(){
    if(Auth::check()){
        $tipo = Auth::user()->tipo;
        switch ($tipo) {
            case 1:
                return redirect('/administrador');
                break;
            case 2:
                return redirect('/recepcao');
                break;
            case 3:
                return redirect('/triagem');
                break;
            case 4:
                return redirect('/consulta');
                break;
            
        }
    }
    else{
        return redirect('/login');
    }
});

Route::get('/sair',function(){
    Auth::logout();
    return redirect('/login');
});
Route::get("/user",function(){   
    return Auth::user();
});

//////// ROTAS DO MÓDULO ADMINISTRADOR ////////
    Route::middleware(['auth','admin'])->prefix('/administrador')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Administrador@index")->name('administrador');
            Route::get("/registrar","Administrador@index");
            Route::get("/classificacao","Administrador@index");
        //_________________DATAS__________________//
            Route::post('/registrarUsuario','UserController@novoUsuario');
            Route::get('/getUsuarios','UserController@getUsuarios');
            Route::put('/atualizarUsuario/{id}','UserController@atualizarUsuario');
            Route::get('/fluxograma','FluxogramaController@index');
            Route::post('/fluxograma/store','FluxogramaController@store');
            Route::put('/fluxograma/update/{id}','FluxogramaController@update');
            Route::get('/discriminador','DiscriminadorController@index');
            Route::post('/discriminador/store','DiscriminadorController@store');
            Route::put('/discriminador/update/{id}','DiscriminadorController@update');
            Route::post('/classificacao/store','ClassificacaoController@store');

    });
///////================================////////

///////// ROTAS DO MÓDULO RECEPÇÃO ////////////
    Route::middleware(['auth','recepcao'])->prefix('/recepcao')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Recepcao@index");
            Route::get("/atendimento","Recepcao@index");
            Route::get("/atendidos","Recepcao@index");
        //_________________DATAS__________________//
            Route::get("/etnias","EtniaController@index")->name('administrador');
            Route::get("/municipios/{uf}","MunicipioController@index");
            Route::post('/paciente/store','PacienteController@store');
            Route::get('/paciente/edit/{id}','PacienteController@edit');
            Route::put('/paciente/update/{id}','PacienteController@update');
            Route::get('/paciente/{nome}/{mae}/{nascimento?}','PacienteController@show');
            Route::post('/atendimento/store','RecepcaoController@store');
            Route::get('/atendimento/{nome}/{mae}/{nascimento}/{datainicial}/{datafinal}','AtendimentoController@show');
    });
///////================================////////

///////// ROTAS DO MÓDULO TRIAGEM /////////////
    Route::middleware(['auth','triagem'])->prefix('/triagem')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Triagem@index");
            Route::get("/lista","Triagem@index");
            Route::get("/atendidos","Triagem@index");
            Route::get("/atendimento/{atendimento}","Triagem@index");
        //_________________DATAS__________________//
            Route::get('/atendimentos/dados/lista','AtendimentoController@listaTriagem');
            Route::get('/atendimentos/dados/lista/atendidos','AtendimentoController@listaTriagemAtendidos');
            Route::post('/atendimento/store','TriagemController@store');
            Route::put('/atendimento/store/{id}','TriagemController@update');
            Route::get('/atendimento/edit/{id}','TriagemController@edit');
            Route::get('/atendimento/classificacao/edit/{id}','ClassificacaoController@showComDiscriminadores');
            Route::get('/atendimento/dados/{id}','AtendimentoController@getAtendimento');
            Route::get('/fluxograma','FluxogramaController@index');
            Route::get('/discriminador/{fluxograma}','ClassificacaoController@show');
    });
///////================================////////

///////// ROTAS DO MÓDULO MÉDICO //////////////
    Route::middleware(['auth','medico'])->prefix('/consulta')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Consulta@index");
            Route::get("/lista","Consulta@index");
            Route::get("/atendimento/{atendimento}","Consulta@index");
        //_________________DATAS__________________//
            Route::get("/atendimentos/dados/lista","AtendimentoController@listaConsulta");
    });
///////================================////////;
