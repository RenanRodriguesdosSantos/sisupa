<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePrescricao extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prescricaos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medico');
            $table->unsignedBigInteger('tecnico')->nullable();
            $table->string('observacao')->nullable();
            
            $table->foreign('medico')->references('id')->on('users');
            $table->foreign('tecnico')->references('id')->on('users');
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
        Schema::dropIfExists('prescricaos');
    }
}
