<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableExamesconsultas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('examesconsultas', function (Blueprint $table) {
            $table->id();
            $table->integer('prioridade');
            $table->unsignedBigInteger('exame');
            $table->integer('status')->nullable();
            $table->string('observacao')->nullable();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('medico');
            $table->unsignedBigInteger('tecnico')->nullable();
            
            $table->foreign('tecnico')->references('id')->on('users');
            $table->foreign('exame')->references('id')->on('exames');
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
        Schema::dropIfExists('examesconsultas');
    }
}
