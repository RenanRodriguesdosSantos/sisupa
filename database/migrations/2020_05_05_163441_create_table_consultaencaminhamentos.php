<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableConsultaencaminhamentos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consultaencaminhamentos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('encaminhamento');
            
            $table->foreign('consulta')->references('id')->on('consultas');
            $table->foreign('encaminhamento')->references('id')->on('encaminhamentos');
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
        Schema::dropIfExists('consultaencaminhamentos');
    }
}
