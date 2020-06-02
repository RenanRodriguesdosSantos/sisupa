<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exame;
use App\Examesconsulta;
use App\Examesimagemsconsulta;
use App\Outrosexamesconsulta;

class ExameController extends Controller
{
    public function __construct(){
        $this->middleware("auth");
    }

    public function index(){
        return Exame::orderBy("nome","asc")->get();
    }

    public function storeExameConsulta(Request $request){
        $ids = $request->id;

        $exames = Examesconsulta::where("consulta","=",$request->consulta)->get();
        foreach ($ids as $value) {
            $possui = false;
            foreach ($exames as $row) {
                if($row->exame == $value){
                    $possui = true;
                }
            }
            if(!$possui){
                $exame = new Examesconsulta();
                $exame->prioridade = $request->prioridade;
                $exame->exame = $value;
                $exame->consulta = $request->consulta;
                $exame->medico = $request->medico;
                $exame->save();
            }
        }
    }

    public function storeExameImagemConsulta(Request $request){
        $ids = $request->exames;

        $exames = Examesimagemsconsulta::where("consulta","=",$request->consulta)->get();

        foreach ($ids as $key => $value) {
            if($value){
                $possui = false;
                foreach ($exames as $row) {
                    if($row->exame == $key + 1){
                        $possui = true;
                    }
                }
                if(!$possui){
                    $exame = new Examesimagemsconsulta();
                }
                else{
                    $exame = Examesimagemsconsulta::where("exame","=", $key + 1)->first();
                }

                $exame->prioridade = $request->prioridade;
                $exame->exame = $key + 1;
                $exame->descricao = $request->descricao[$key];

                $exame->consulta = $request->consulta;
                $exame->medico = $request->medico;
                $exame->save();
            }
        }
    }

    public function storeOutrosExamesConsulta(Request $request){
        $exame = new Outrosexamesconsulta();
        $exame->prioridade = $request->prioridade;
        $exame->nome = $request->nome;
        $exame->descricao = $request->descricao;
        $exame->consulta = $request->consulta;
        $exame->medico = $request->medico;
        $exame->save();
    }

    public function updateOutrosExamesConsulta(Request $request,$id){
        $exame = Outrosexamesconsulta::find($id);
        $exame->prioridade = $request->prioridade;
        $exame->nome = $request->nome;
        $exame->descricao = $request->descricao;
        $exame->consulta = $request->consulta;
        $exame->medico = $request->medico;
        $exame->save();
    }

    public function selecionados($consulta){
        return Examesconsulta::where("consulta","=",$consulta)->get();
    }

    public function selecionadosImagem($consulta){
        return Examesimagemsconsulta::where("consulta","=",$consulta)->get();
    }

    public function selecionadosOutros($consulta){
        return Outrosexamesconsulta::where("consulta","=",$consulta)->get();
    }
}
