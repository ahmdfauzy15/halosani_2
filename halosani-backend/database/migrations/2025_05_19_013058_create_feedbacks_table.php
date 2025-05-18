<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            
            // Question ratings (1-5)
            $table->tinyInteger('login_register_rating')->unsigned()->nullable();
            $table->text('login_register_reason')->nullable();
            
            $table->tinyInteger('event_info_rating')->unsigned()->nullable();
            $table->text('event_info_reason')->nullable();
            
            $table->tinyInteger('breath_management_rating')->unsigned()->nullable();
            $table->text('breath_management_reason')->nullable();
            
            $table->tinyInteger('journal_comfort_rating')->unsigned()->nullable();
            $table->text('journal_comfort_reason')->nullable();
            
            $table->tinyInteger('mentor_ai_rating')->unsigned()->nullable();
            $table->text('mentor_ai_reason')->nullable();
            
            $table->tinyInteger('blog_content_rating')->unsigned()->nullable();
            $table->text('blog_content_reason')->nullable();
            
            $table->tinyInteger('youtube_videos_rating')->unsigned()->nullable();
            $table->text('youtube_videos_reason')->nullable();
            
            $table->tinyInteger('ebook_access_rating')->unsigned()->nullable();
            $table->text('ebook_access_reason')->nullable();
            
            $table->tinyInteger('feedback_feature_rating')->unsigned()->nullable();
            $table->text('feedback_feature_reason')->nullable();
            
            $table->tinyInteger('overall_rating')->unsigned()->nullable();
            $table->text('overall_reason')->nullable();
            
            // Additional feedback
            $table->text('additional_feedback')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback');
    }
};