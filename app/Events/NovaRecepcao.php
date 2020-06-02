<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Atendimento;

class NovaRecepcao implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $atendimentos;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->atendimentos = Atendimento::join('pacientes','atendimentos.paciente','=','pacientes.id')
        ->select("atendimentos.*","pacientes.nome as paciente","pacientes.bairro as bairro","pacientes.mae","pacientes.nascimento")
        ->whereIn('atendimentos.status',[1,2])
        ->paginate(20);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('triagem');
    }
}
