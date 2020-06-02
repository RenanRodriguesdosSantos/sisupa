<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePrescricaomateriais extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prescricaomateriais', function (Blueprint $table) {
            $table->id();
            $table->string('quantidade');
            $table->unsignedBigInteger('prescricao');
            $table->unsignedBigInteger('material');
            
            $table->foreign('prescricao')->references('id')->on('prescricaos');
            $table->foreign('material')->references('id')->on('materiais');
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
        Schema::dropIfExists('prescricaomateriais');
    }
}
