<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableOutrosexamesconsultas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('outrosexamesconsultas', function (Blueprint $table) {
            $table->id();
            $table->integer('prioridade');
            $table->string('nome');
            $table->string('descricao')->nullable();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('medico');
            
            $table->foreign('consulta')->references('id')->on('consultas');
            $table->foreign('medico')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('outrosexamesconsultas');
    }
}
