<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableExamesimagemsconsultas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('examesimagemsconsultas', function (Blueprint $table) {
            $table->id();
            $table->integer('prioridade');
            $table->string('descricao')->nullable();
            $table->string('observacao')->nullable();
            $table->integer('status')->nullable();
            $table->unsignedBigInteger('exame');
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('medico');
            $table->unsignedBigInteger('tecnico')->nullable();
            
            $table->foreign('tecnico')->references('id')->on('users');
            $table->foreign('exame')->references('id')->on('examesimagems');
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
        Schema::dropIfExists('examesimagemsconsultas');
    }
}
