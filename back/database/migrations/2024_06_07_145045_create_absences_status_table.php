<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('absences_status', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->timestamps();
        });

        DB::table('absences_status')->insert([
            ['status' => 'En attente'],
            ['status' => 'Refusé'],
            ['status' => 'Validé']
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('absences_status');
    }
};
