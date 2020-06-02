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
//Auth::routes(['register' => false]);

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
            case 5:
                return redirect('/ambulatorio');
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
/*
 Route::get("/novoUser",function(){
     return view("administrador");
 });
 Route::post('administrador/registrarUsuario','UserController@novoUsuario');
  
 */

//////// ROTAS DO MÓDULO ADMINISTRADOR ////////
    Route::middleware(['auth','admin'])->prefix('/administrador')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Administrador@index")->name('administrador');
            Route::get("/registrar","Administrador@index");
            Route::get("/classificacao","Administrador@index");
            Route::get("/materiais","Administrador@index");
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
            Route::post('/material/store','MaterialController@store');
            Route::get('/materiais/dados','MaterialController@index');
            Route::post('/medicamento/store','MedicamentoController@store');
            Route::get('/medicamentos/dados','MedicamentoController@index');
            Route::put('/material/update/{id}','MaterialController@update');
            Route::put('/medicamento/update/{id}','MedicamentoController@update');

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
            Route::get("/atendimento/dados/{id}","AtendimentoController@getDadosTriagem");
            Route::get('/atendimentos/dados/lista/atendidos','AtendimentoController@listaTriagemAtendidos');
            Route::put('/atendimento/store/{id}','TriagemController@update');
            Route::get('/atendimento/edit/{id}','TriagemController@edit');
            Route::get('/atendimento/classificacao/edit/{id}','ClassificacaoController@showComDiscriminadores');
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
            Route::get('/atendidos','Consulta@index');
        //_________________DATAS__________________//
            Route::get("/atendimentos/dados/lista","AtendimentoController@listaConsulta");
            Route::get("/atendimento/dados/{id}","AtendimentoController@getDadosConsula");
            Route::get("/atendimento/edit/{id}","ConsultaController@edit");
            Route::put("/atendimento/store/{id}","ConsultaController@update");
            Route::post("/atestado/store/","AtestadoController@store");
            Route::get("/atestado/edit/{consulta}","AtestadoController@edit");
            Route::get("/prescricao/lista/{consulta}","PrescricaoController@lista");
            Route::post("/prescricao/store","PrescricaoController@store");
            Route::get("/receita/lista/{consulta}","ReceitaController@lista");
            Route::post("/receita/store","ReceitaController@store");
            Route::put("/receita/update/{id}","ReceitaController@update");
            Route::get("/encaminhamento/lista/{consulta}","EncaminhamentoController@lista");
            Route::post("/encaminhamento/store","EncaminhamentoController@store");
            Route::put("/encaminhamento/update/{id}","EncaminhamentoController@update");
            Route::get('/atendimento/classificacao/dados/{id}','ClassificacaoController@showComDiscriminadores');
            Route::get('/atendimento/triagem/dados/{id}','TriagemController@edit');
            Route::get('/exames/show','ExameController@index');
            Route::post('/exames/store','ExameController@storeExameConsulta');
            Route::post('/examesimagem/store','ExameController@storeExameImagemConsulta');
            Route::post('/outrosexames/store','ExameController@storeOutrosExamesConsulta');
            Route::put('/outrosexames/update','ExameController@updateOutrosExamesConsulta');
            Route::get('/exames/edit/{consulta}','ExameController@selecionados');
            Route::get('/examesimagem/edit/{consulta}','ExameController@selecionadosImagem');
            Route::get('/outrosexames/edit/{consulta}','ExameController@selecionadosOutros');
            Route::get('/atendimentos/dados/lista/atendidos','AtendimentoController@listaConsultaAtendidos');
            Route::get('/medicamentos/lista','MedicamentoController@index');


    });
///////================================////////;
///////   ROTAS DO MÓDULO AMBULATÓRIO  ////////;
    Route::middleware(['auth','ambulatorio'])->prefix('/ambulatorio')->group(function(){
        //_________________VIEWS__________________//
            Route::get("/","Ambulatorio@index");
            Route::get("/lista","Ambulatorio@index");
        //_________________DATAS__________________//
            Route::get("/atendimentos/dados/lista","")
    });
///////================================////////;
