<?php

namespace App\Http\Middleware;

use Closure;

class Recepcao
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if($request->user()->tipo != 2){
            return abort(403);
        }
        return $next($request);
    }
}
