<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePrescricaomedicamentos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prescricaomedicamentos', function (Blueprint $table) {
            $table->id();
            $table->string('posologia');
            $table->float('quantidade');
            $table->integer('apresentacao');
            $table->unsignedBigInteger('medicamento');
            $table->unsignedBigInteger('prescricao');
            
            $table->foreign('medicamento')->references('id')->on('medicamentos');
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
        Schema::dropIfExists('prescricaomedicamentos');
    }
}
