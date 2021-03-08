<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


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
            Route::get("/cadastros","Administrador@index");
            Route::get("/relatorios","Administrador@index");
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
            Route::post('/medicamento/store','MedicamentoController@store');
            Route::post('/exame/store','ExameController@store');
            Route::get('/materiais/dados','MaterialController@index');
            Route::get('/medicamentos/dados','MedicamentoController@index');
            Route::get('/exames/dados','ExameController@index');
            Route::put('/material/update/{id}','MaterialController@update');
            Route::put('/medicamento/update/{id}','MedicamentoController@update');
            Route::put('/exame/update/{id}','ExameController@update');
            //Relatorios
            Route::post('/relatorios','AtendimentoController@listaAtendimentos');
            Route::post('/relatorios/triagem','AtendimentoController@listaAtendimentosTriagem');
            Route::post('/relatorios/consulta','AtendimentoController@listaAtendimentosConsulta');
            Route::post('/relatorios/ambulatorio','AtendimentoController@listaAtendimentosAmbulatorio');
            Route::post('/relatorios/exames','AtendimentoController@listaAtendimentosExames');
            Route::post('/relatorios/examesImagem','AtendimentoController@listaAtendimentosExamesImagem');
            Route::post('/relatorios/examesOutros','AtendimentoController@listaAtendimentosExamesOutros');
            Route::get('/relatorios/triagem/dados/{id}','TriagemController@edit');
            Route::get('/relatorios/classificacao/dados/{id}','ClassificacaoController@showComDiscriminadores');
            Route::get('/relatorios/consulta/dados/{id}','ConsultaController@edit');
            Route::get('/relatorios/materiais/dados/{prescricao}','PrescricaoController@getMateriais');
            Route::get("/relatorios/prescricao/dados/{prescricao}","PrescricaoController@prescricaoDados");


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
            Route::put("/atestado/update/{id}","AtestadoController@update");
            Route::get("/prescricao/lista/{consulta}","PrescricaoController@lista");
            Route::post("/prescricao/store","PrescricaoController@store");
            Route::get("/receita/lista/{consulta}","ReceitaController@lista");
            Route::post("/receita/store","ReceitaController@store");
            Route::put("/receita/update/{id}","ReceitaController@update");
            Route::get("/encaminhamento/lista/{consulta}","EncaminhamentoController@lista");
            Route::post("/encaminhamento/store","EncaminhamentoController@store");
            Route::put("/encaminhamento/update/{id}","EncaminhamentoController@update");
            Route::put("/prescricao/delete/{id}","PrescricaoController@delete");
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
            Route::get("/exames","Ambulatorio@index");
            Route::get("/atendimento/{atendimento}","Ambulatorio@index");
            Route::get("/exames/atendimento/imagem/{consulta}","Ambulatorio@index");
            Route::get("/exames/atendimento/lab/{consulta}","Ambulatorio@index");
            Route::get("/exames/atendimento/outros/{consulta}","Ambulatorio@index");
        //_________________DATAS__________________//
            Route::get("/atendimentos/dados/lista","PrescricaoController@listaPacientes");
            Route::post("/store","PrescricaoController@storeAmbulatorial");
            Route::get("/prescricao/dados/{prescricao}","PrescricaoController@prescricaoDados");
            Route::get('/materiais/lista','MaterialController@index');
            Route::get('/materiais/salvos/{prescricao}','PrescricaoController@materiaisSalvos');
            Route::get('/exames/solicitados/imagem','ExameController@solicitadosImagem');
            Route::get('/exames/solicitados/laboratorio','ExameController@solicitadosLaboratorio');
            Route::get('/exames/solicitados/outros','ExameController@solicitadosOutros');
            Route::get('/exames/dados/imagem/{consulta}','ExameController@dadosExamesImagem');
            Route::get('/exames/dados/lab/{consulta}','ExameController@dadosExamesLab');
            Route::get('/exames/dados/outros/{consulta}','ExameController@dadosExamesOutros');
            Route::post('/exames/imagem/atendimento/store','ExameController@storeAmbulatorialExamesImagem');
            Route::post('/exames/lab/atendimento/store','ExameController@storeAmbulatorialExamesLab');
            Route::post('/exames/outros/atendimento/store','ExameController@storeAmbulatorialExamesOutros');

    });
///////================================////////;
