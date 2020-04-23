<?php

namespace App\Listeners;

use App\Events\NovaRecepcao;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NovaRecepcaoLinstener
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
     * @param  NovaRecepcao  $event
     * @return void
     */
    public function handle(NovaRecepcao $event)
    {
        //
    }
}
