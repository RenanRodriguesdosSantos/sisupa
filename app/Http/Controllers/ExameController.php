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

    public function store(Request $request){
        $exame = new Exame();
        $exame->nome = $request->nome;
        $exame->save();
    }

    public function update(Request $request, $id){
        $exame = Exame::find($id);
        $exame->nome = $request->nome;
        $exame->save();
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
                $exame->status = '1';
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
                $exame->status = '1';

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
        $exame->status = '1';
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

    public function solicitadosImagem(){
        return Examesimagemsconsulta::join("atendimentos","examesimagemsconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","examesimagemsconsultas.consulta","examesimagemsconsultas.prioridade","examesimagemsconsultas.id")
        ->groupBy("examesimagemsconsultas.consulta")
        ->where("examesimagemsconsultas.status","=",'1')
        ->get();
    }
    
    public function solicitadosLaboratorio(){
        return Examesconsulta::join("atendimentos","examesconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","examesconsultas.consulta","examesconsultas.prioridade","examesconsultas.id")
        ->groupBy("examesconsultas.consulta")
        ->where("examesconsultas.status","=","1")
        ->get();
    }
    
    public function solicitadosOutros(){
        return Outrosexamesconsulta::join("atendimentos","outrosexamesconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","outrosexamesconsultas.consulta","outrosexamesconsultas.prioridade","outrosexamesconsultas.id")
        ->groupBy("outrosexamesconsultas.consulta")
        ->where("outrosexamesconsultas.status","=","1")
        ->get();
    }

    public function dadosExamesImagem($consulta){
        return Examesimagemsconsulta::join("atendimentos","examesimagemsconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->join("users","examesimagemsconsultas.medico","=","users.id")
        ->join("examesimagems","examesimagemsconsultas.exame","examesimagems.id")
        ->where("examesimagemsconsultas.consulta","=",$consulta)
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","examesimagemsconsultas.consulta","examesimagemsconsultas.prioridade","examesimagemsconsultas.id","users.name as medico","examesimagems.nome as exame","examesimagemsconsultas.descricao","examesimagemsconsultas.observacao")
        ->get();
    }
    
    public function dadosExamesLab($consulta){
        return Examesconsulta::join("atendimentos","examesconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->join("users","examesconsultas.medico","=","users.id")
        ->join("exames","examesconsultas.exame","exames.id")
        ->where("examesconsultas.consulta","=",$consulta)
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","examesconsultas.consulta","examesconsultas.prioridade","examesconsultas.id","users.name as medico","exames.nome as exame","examesconsultas.observacao")
        ->get();
    }

    public function dadosExamesOutros($consulta){
        return Outrosexamesconsulta::join("atendimentos","outrosexamesconsultas.consulta","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->join("users","outrosexamesconsultas.medico","=","users.id")
        ->where("outrosexamesconsultas.consulta","=",$consulta)
        ->select("pacientes.nome as paciente","pacientes.mae","pacientes.nascimento","outrosexamesconsultas.consulta","outrosexamesconsultas.descricao","outrosexamesconsultas.prioridade","outrosexamesconsultas.id","users.name as medico","outrosexamesconsultas.observacao")
        ->get();
    }

    public function storeAmbulatorialExamesImagem(Request $request){
        $exames = $request->exames;

        foreach ($exames as $value) {
            $exame = Examesimagemsconsulta::find($value["id"]);
            $exame->observacao = $value["observacao"];
            $exame->tecnico = $value["tecnico"];
            $exame->status = '2';
            $exame->save();
        }
    }
    
    public function storeAmbulatorialExamesLab(Request $request){
        $exames = $request->exames;
        
        foreach ($exames as $value) {
            $exame = Examesconsulta::find($value["id"]);
            $exame->observacao = $value["observacao"];
            $exame->tecnico = $value["tecnico"];
            $exame->status = '2';
            $exame->save();
        }
    }

    public function storeAmbulatorialExamesOutros(Request $request){
        $exames = $request->exames;

        foreach ($exames as $value) {
            $exame = Outrosexamesconsulta::find($value["id"]);
            $exame->observacao = $value["observacao"];
            $exame->tecnico = $value["tecnico"];
            $exame->status = '2';
            $exame->save();
        }
    }
}
