<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableTriagems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('triagems', function (Blueprint $table) {
            $table->id();
            $table->text('descricao');
            $table->float('saturacao',8,2)->nullable();
            $table->float('glasgow',8,2)->nullable();
            $table->float('tax',8,2)->nullable();
            $table->float('hgt',8,2)->nullable();
            $table->float('fc',8,2)->nullable();
            $table->float('peso',8,2)->nullable();
            $table->string('pa',7)->nullable();
            $table->unsignedBigInteger('enfermeiro');
            $table->unsignedBigInteger('classificacao');
            
            $table->foreign('enfermeiro')->references('id')->on('users');
            $table->foreign('classificacao')->references('id')->on('classificacaos');
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
        Schema::dropIfExists('triagems');
    }
}
