<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('absence_status', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->timestamps();
        });

        // Insert default statuses
        DB::table('absence_status')->insert([
            ['status' => 'En attente'],
            ['status' => 'Refusé'],
            ['status' => 'Validé']
        ]);
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('absence_status');
    }
};
