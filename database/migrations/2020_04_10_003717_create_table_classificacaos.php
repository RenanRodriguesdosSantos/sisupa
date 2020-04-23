<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableClassificacaos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classificacaos', function (Blueprint $table) {
            $table->id();
            $table->integer('cor');
            $table->unsignedBigInteger('fluxograma');
            $table->unsignedBigInteger('discriminador');
            
            $table->foreign('fluxograma')->references('id')->on('fluxogramas');
            $table->foreign('discriminador')->references('id')->on('discriminadors');
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
        Schema::dropIfExists('classificacaos');
    }
}
