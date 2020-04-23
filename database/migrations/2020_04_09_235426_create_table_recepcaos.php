<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRecepcaos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recepcaos', function (Blueprint $table) {
            $table->id();
            $table->integer('motivo');
            $table->integer('origem');
            $table->unsignedBigInteger('recepcionista');
            
            $table->foreign('recepcionista')->references('id')->on('users');
            
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
        Schema::dropIfExists('recepcaos');
    }
}
