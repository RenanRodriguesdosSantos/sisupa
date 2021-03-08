<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Prescricao;
use App\Prescricaomedicamento;
use App\Prescricaoconsulta;
use App\Prescricaomateriai;

class PrescricaoController extends Controller
{
    public function __construct(){
        $this->middleware("auth");
    }

    public function lista($consulta){
        return Prescricao::join("prescricaoconsultas","prescricaos.id","=","prescricaoconsultas.prescricao")
        ->join("users","prescricaos.medico","=","users.id")
        ->where("prescricaoconsultas.consulta","=",$consulta)
        ->select("prescricaos.*","users.name as nomeMedico")
        ->get();
    }

    public function store(Request $request){
        $prescricao = new Prescricao();

        $prescricao->medico = $request->medico;
        $prescricao->status = '1';

        $prescricao->save();
        $prescricaoConsulta = new Prescricaoconsulta();
        $prescricaoConsulta->consulta = $request->consulta;
        $prescricaoConsulta->prescricao = $prescricao->id;
        $prescricaoConsulta->save();
        

        foreach ($request->prescricao as $value) {
            $medicamento = new Prescricaomedicamento();
            $medicamento->posologia = $value["posologia"];
            $medicamento->apresentacao = $value["apresentacao"];
            $medicamento->quantidade = $value["quantidade"];
            $medicamento->medicamento = $value["prescricao"];
            $medicamento->observacao = $value["observacao"];
            $medicamento->prescricao = $prescricao->id;
            $medicamento->save();
        } 
    }

    public function listaPacientes(){
        return Prescricao::join("prescricaoconsultas","prescricaos.id","=","prescricaoconsultas.prescricao")
        ->join("consultas","prescricaoconsultas.consulta","=","consultas.id")
        ->join("atendimentos","consultas.id","=","atendimentos.consulta")
        ->join("triagems","atendimentos.triagem","=","triagems.id")
        ->join("classificacaos","triagems.classificacao","=","classificacaos.id")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->whereNull("prescricaos.tecnico")
        //->whereNull("prescricaos.deleted_at");
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento","classificacaos.cor","prescricaos.id as prescricao")
        ->get();
    }

    public function prescricaoDados($prescricao){
        $prescricaos = Prescricao::join("prescricaoconsultas","prescricaos.id","=","prescricaoconsultas.prescricao")
        ->join("consultas","prescricaoconsultas.consulta","=","consultas.id")
        ->join("atendimentos","consultas.id","=","atendimentos.consulta")
        ->join("pacientes","atendimentos.paciente","=","pacientes.id")
        ->join("users","prescricaos.medico","=","users.id")
        ->where("prescricaos.id","=", $prescricao)
        ->select("pacientes.nome as paciente","users.name as medico","users.conselho as crm")
        ->get();

        $medicamento = Prescricao::join("prescricaomedicamentos","prescricaos.id","=","prescricaomedicamentos.prescricao")
        ->join("medicamentos","prescricaomedicamentos.medicamento","=","medicamentos.id")
        ->where("prescricaos.id","=", $prescricao)
        ->select("prescricaos.id as prescricao","prescricaomedicamentos.id as idPrescricaoMedicamento","prescricaomedicamentos.quantidade","prescricaomedicamentos.posologia","prescricaomedicamentos.apresentacao","medicamentos.nome as medicamento")
        ->get();

        return ["dados" => $prescricaos, "prescricaos" => $medicamento];
    }

    public function storeAmbulatorial(Request $request){
        $prescricao = Prescricao::find($request->prescricao);
        $prescricao->tecnico = $request->tecnico;
        $prescricao->observacao = $request->observacao;
        $prescricao->save();

        foreach ($request->materiais as $value) {
            $materiais = new Prescricaomateriai();
            $materiais->quantidade = $value["quantidade"];
            $materiais->material = $value["material"];
            $materiais->prescricao = $prescricao->id;
            $materiais->save();
        }

    }

    public function materiaisSalvos($id){
        return [ "materiais" => Prescricaomateriai::where("prescricao","=",$id)->get(), "prescricao" => Prescricao::select("observacao")->find($id)];
    }

    public function getMateriais($id){
        return [ "materiais" => Prescricaomateriai::where("prescricao","=",$id)->join("materiais","prescricaomateriais.material","=","materiais.id")->select("prescricaomateriais.*","materiais.nome as material")->get(), "prescricao" => Prescricao::select("observacao")->find($id)];
    }

    public function delete(Request $request, $id){
        $prescricao = Prescricao::find($id);
        $prescricao->medico = $request->medico;
        $prescricao->delete();
    }
}
