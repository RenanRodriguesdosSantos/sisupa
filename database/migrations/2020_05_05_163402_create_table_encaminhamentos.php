<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEncaminhamentos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('encaminhamentos', function (Blueprint $table) {
            $table->id();
            $table->string('servico')->nullable();
            $table->integer("entidade");
            $table->text("historia");
            $table->text("exames")->nullable();
            $table->text("hd")->nullable();
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
        Schema::dropIfExists('encaminhamentos');
    }
}
