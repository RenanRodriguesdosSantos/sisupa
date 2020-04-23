<?php

namespace App\Listeners;

use App\Events\NovaTriagem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NovaTriagemListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NovaTriagem  $event
     * @return void
     */
    public function handle(NovaTriagem $event)
    {
        //
    }
}
