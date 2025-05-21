<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('password_reset_token')->nullable()->after('otp_expires_at');
        $table->timestamp('password_reset_token_expires_at')->nullable()->after('password_reset_token');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['password_reset_token', 'password_reset_token_expires_at']);
    });
}

    /**
     * Reverse the migrations.
     */
   
};
