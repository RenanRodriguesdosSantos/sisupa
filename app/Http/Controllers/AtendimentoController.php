<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Atendimento;
use App\Consulta;
use App\Triagem;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class AtendimentoController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function show($nome,$mae,$nascimento,$datainicial,$datafinal){
        $nome = $nome == "0"?"":$nome; // no caso de parametros vazios;
        $mae = $mae == "0"?"":$mae;   // no caso de parametros vazios;
        $nascimento = $nascimento == "0"?null:$nascimento;   // no caso de parametros vazios;
        $datainicial = $datainicial == "0"?date("Ymd"):$datainicial;   // no caso de parametros vazios;
        $datafinal = $datafinal == "0"?null:$datafinal;   // no caso de parametros vazios;
        

        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("municipios","pacientes.municipio","=","municipios.id")
                        ->select("atendimentos.*","pacientes.id as idpacientes","pacientes.nome as paciente","pacientes.bairro as bairro","municipios.nome as municipio","municipios.uf as uf","pacientes.mae","pacientes.nascimento")
                        ->orderBy("created_at","desc")
                        ->where('pacientes.nome','LIKE',$nome.'%')
                        ->where('pacientes.mae','LIKE',$mae.'%')
                        ->where(function ($query) use ($nascimento,$datainicial,$datafinal){
                            if(isset($nascimento)){
                                $query->whereDate('pacientes.nascimento',$nascimento);
                            }
                            if(isset($datainicial)){
                                if(isset($datafinal)){
                                    $query->whereBetween("atendimentos.created_at",[$datainicial,date('Ymd', strtotime('+1 day', strtotime($datafinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$datainicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaTriagem(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento")
        ->whereIn('atendimentos.status',[1,2])
        ->paginate(20);
    }

    public function listaTriagemAtendidos(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->join("triagems","atendimentos.triagem","=","triagems.id")
        ->join("classificacaos","triagems.classificacao","=","classificacaos.id")
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento","classificacaos.cor")
        ->where('atendimentos.status',"=",3)
        ->paginate(20);
    }

    public function getAtendimento($id){
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")->select("atendimentos.*","pacientes.nome as nome")->find($id);
    }

    public function listaConsulta(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->join('triagems','atendimentos.triagem','=','triagems.id')
        ->join('classificacaos','triagems.classificacao','=','classificacaos.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento","classificacaos.cor")
        ->whereIn('atendimentos.status',[3,4])
        ->get();
    }

    public function getDadosTriagem($id){
        $atendimento = Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")->select("atendimentos.*","pacientes.nome as nome")->find($id);

        if($atendimento->status == '1'){
            $triagem = new Triagem();
            $triagem->save();
            $atendimento->triagem = $triagem->id;
            $atendimento->status = 2;
            $atendimento->save();
            $atendimento->status = 1;
        }
        return $atendimento;
    }

    public function getDadosConsula($id){
        $atendimento = Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")->select("atendimentos.*","pacientes.nome as nome")->find($id);

        if($atendimento->status == 3){
            $consulta = new Consulta();
            $consulta->save();
            $atendimento->consulta = $consulta->id;
            $atendimento->status = 4;
            $atendimento->save();
            $atendimento->status = 3;
        }
        return $atendimento;
    }

    public function listaConsultaAtendidos(){
        return Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento")
        ->where('atendimentos.status',"=",5)
        ->whereBetween("atendimentos.created_at",[date('Y-m-d H:i:s', strtotime('-1 day', strtotime(date('Y-m-d H:i:s')))), date('Y-m-d H:i')])
        ->paginate(20);
    }

    public function listaAtendimentos(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("recepcaos","atendimentos.recepcao","=","recepcaos.id")
                        ->join("triagems","atendimentos.triagem","=","triagems.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("users as ur","recepcaos.recepcionista","=","ur.id")
                        ->join("users as ue","triagems.enfermeiro","=","ue.id")
                        ->join("users as um","consultas.medico","=","um.id")
                        ->select("atendimentos.id as id","atendimentos.created_at","pacientes.nome as paciente","ue.name as enfermeiro","um.name as medico","ur.name as recepcionista")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('ur.name','LIKE',$request->recepcionista.'%')
                        ->where('ue.name','LIKE',$request->enfermeiro.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaAtendimentosTriagem(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;
        $cor = $request->cor;
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("triagems","atendimentos.triagem","=","triagems.id")
                        ->join("classificacaos","triagems.classificacao","=","classificacaos.id")
                        ->join("fluxogramas","classificacaos.fluxograma","=","fluxogramas.id")
                        ->join("discriminadors","classificacaos.discriminador","=","discriminadors.id")
                        ->join("users as ue","triagems.enfermeiro","=","ue.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","ue.name as enfermeiro","classificacaos.cor","fluxogramas.nome as fluxograma","discriminadors.nome as discriminador","triagems.id as triagem")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('ue.name','LIKE',$request->enfermeiro.'%')
                        ->where(function ($query) use ($cor){
                            if(isset($cor)){
                                $query->where('classificacaos.cor',$cor);
                            }
                        })
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaAtendimentosConsulta(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("users as um","consultas.medico","=","um.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","um.name as medico","consultas.diagnostico","consultas.id as consulta")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where('consultas.diagnostico','LIKE',$request->diagnostico.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaAtendimentosAmbulatorio(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("prescricaoconsultas","prescricaoconsultas.consulta","=","consultas.id")
                        ->join("prescricaos","prescricaoconsultas.prescricao","=","prescricaos.id")
                        ->join("users as um","prescricaos.medico","=","um.id")
                        ->join("users as ut","prescricaos.tecnico","=","ut.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","um.name as medico","ut.name as tecnico","prescricaos.id as prescricao")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where('ut.name','LIKE',$request->tecnico.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaAtendimentosExames(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;

        // Consulta para exames de Laboratoriais
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("examesconsultas","examesconsultas.consulta","=","consultas.id")
                        ->join("exames","examesconsultas.exame","=","exames.id")
                        ->join("users as um","examesconsultas.medico","=","um.id")
                        ->join("users as ut","examesconsultas.tecnico","=","ut.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","um.name as medico","ut.name as tecnico","exames.nome as exame","examesconsultas.id as idexame")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where('ut.name','LIKE',$request->tecnico.'%')
                        ->where('exames.nome','LIKE',$request->exame.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }

    public function listaAtendimentosExamesImagem(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;

        //Consulta para Exames de Imagem
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("examesimagemsconsultas","examesimagemsconsultas.consulta","=","consultas.id")
                        ->join("examesimagems","examesimagemsconsultas.exame","=","examesimagems.id")
                        ->join("users as um","examesimagemsconsultas.medico","=","um.id")
                        ->join("users as ut","examesimagemsconsultas.tecnico","=","ut.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","um.name as medico","ut.name as tecnico","examesimagems.nome as exame","examesimagemsconsultas.id as idexame")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where('ut.name','LIKE',$request->tecnico.'%')
                        ->where('examesimagems.nome','LIKE',$request->exame.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);
    }
    public function listaAtendimentosExamesOutros(Request $request){
        $dataInicial = $request->dataInicial;
        $dataFinal = $request->dataFinal;

        //Consulata para outros exames   
        return Atendimento::join("pacientes","atendimentos.paciente","=","pacientes.id")
                        ->join("consultas","atendimentos.consulta","=","consultas.id")
                        ->join("outrosexamesconsultas","outrosexamesconsultas.consulta","=","consultas.id")
                        ->join("users as um","outrosexamesconsultas.medico","=","um.id")
                        ->join("users as ut","outrosexamesconsultas.tecnico","=","ut.id")
                        ->select("atendimentos.id","atendimentos.created_at","pacientes.nome as paciente","um.name as medico","ut.name as tecnico","outrosexamesconsultas.descricao as exame","outrosexamesconsultas.id as idexame")
                        ->orderBy("atendimentos.created_at")
                        ->where('pacientes.nome','LIKE',$request->paciente.'%')
                        ->where('um.name','LIKE',$request->medico.'%')
                        ->where('ut.name','LIKE',$request->tecnico.'%')
                        ->where(function ($query) use ($dataInicial,$dataFinal){
                            if(isset($dataInicial)){
                                if(isset($dataFinal)){
                                    $query->whereBetween("atendimentos.created_at",[$dataInicial,date('Ymd', strtotime('+1 day', strtotime($dataFinal)))]);
                                }else{
                                    $query->whereDate('atendimentos.created_at',$dataInicial);
                                }
                            }
                        })
                        ->paginate(20);

        return $consulta;
    }
}
