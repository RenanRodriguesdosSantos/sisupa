<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableAtendimentos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('atendimentos', function (Blueprint $table) {
            $table->id();
            $table->integer("status")->nullable();
            $table->unsignedBigInteger('paciente');
            $table->unsignedBigInteger('recepcao');
            $table->unsignedBigInteger('triagem')->nullable();
            $table->unsignedBigInteger('consulta')->nullable();
            $table->unsignedBigInteger('sinais')->nullable();
            
            $table->foreign('paciente')->references('id')->on('pacientes');
            $table->foreign('recepcao')->references('id')->on('recepcaos');
            $table->foreign('triagem')->references('id')->on('triagems');
            $table->foreign('consulta')->references('id')->on('consultas');
            $table->foreign('sinais')->references('id')->on('atendimentosinais');

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
        Schema::dropIfExists('atendimentos');
    }
}
