<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableAtestados extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('atestados', function (Blueprint $table) {
            $table->id();
            $table->string("tipoAtividadesAtestado")->nullable();
            $table->string("tempoAtestado")->nullable();
            $table->string("cid",10)->nullable();
            $table->unsignedBigInteger('medico');
            
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
        Schema::dropIfExists('atestados');
    }
}
