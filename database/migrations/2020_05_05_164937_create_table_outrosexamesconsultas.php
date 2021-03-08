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
            $table->string('observacao')->nullable();
            $table->integer('status')->nullable();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('medico');
            $table->unsignedBigInteger('tecnico')->nullable();
            
            $table->foreign('tecnico')->references('id')->on('users');
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
