<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableConsultas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->text("sintomas")->nullable();
            $table->string("conduta")->nullable();
            $table->string("resultados")->nullable();
            $table->string("diagnostico")->nullable();
            $table->string("cid",10)->nullable();
            $table->integer("encaminhamento")->nullable();

            $table->unsignedBigInteger('medico')->nullable();
            $table->unsignedBigInteger('atestado')->nullable();
            
            $table->foreign('medico')->references('id')->on('users');
            $table->foreign('atestado')->references('id')->on('atestados');

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
        Schema::dropIfExists('consultas');
    }
}
