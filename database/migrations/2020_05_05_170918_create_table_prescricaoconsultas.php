<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePrescricaoconsultas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prescricaoconsultas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('prescricao');
            
            $table->foreign('consulta')->references('id')->on('consultas');
            $table->foreign('prescricao')->references('id')->on('prescricaos');
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
        Schema::dropIfExists('prescricaoconsultas');
    }
}
