<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableSinaisvitais extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sinaisvitais', function (Blueprint $table) {
            $table->id();
            $table->string('descricao')->nullable();
            $table->float('saturacao',8,2)->nullable();
            $table->float('glasgow',8,2)->nullable();
            $table->float('tax',8,2)->nullable();
            $table->float('hgt',8,2)->nullable();
            $table->float('fc',8,2)->nullable();
            $table->float('peso',8,2)->nullable();
            $table->string('pa',7)->nullable();
            $table->string("observacao")->nullable();
            $table->unsignedBigInteger('atendimento');
            $table->unsignedBigInteger('tecnico');
            
            $table->foreign('atendimento')->references('id')->on('atendimentosinais');
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
        Schema::dropIfExists('sinaisvitais');
    }
}
