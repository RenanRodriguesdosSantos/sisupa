<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableConsultareceitas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consultareceitas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consulta');
            $table->unsignedBigInteger('receita');
            
            $table->foreign('consulta')->references('id')->on('consultas');
            $table->foreign('receita')->references('id')->on('receitas');
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
        Schema::dropIfExists('consultareceitas');
    }
}
