<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('psychologists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialization');
            $table->text('description');
            $table->string('education');
            $table->integer('experience_years');
            $table->string('hospital_affiliation')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->string('image')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->json('languages')->nullable();
            $table->json('treatment_approaches')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('psychologists');
    }
};