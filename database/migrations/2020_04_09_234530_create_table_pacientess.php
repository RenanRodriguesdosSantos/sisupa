<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePacientess extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('pai')->nullable();
            $table->string('mae');
            $table->date('nascimento');
            $table->char('sexo');
            $table->string('cpf',14)->nullable();
            $table->string('cns')->nullable();
            $table->string('telefone')->nullable();
            $table->string('rg')->nullable();
            $table->string('profissao')->nullable();
            $table->string('bairro');
            $table->string('logradouro');
            $table->string('numero');
            $table->string('complemento');
            $table->unsignedBigInteger('naturalidade');
            $table->unsignedBigInteger('municipio');
            $table->unsignedBigInteger('etnia');
            
            $table->foreign('naturalidade')->references('id')->on('municipios');
            $table->foreign('municipio')->references('id')->on('municipios');
            $table->foreign('etnia')->references('id')->on('etnias');
            
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
        Schema::dropIfExists('pacientes');
    }
}
