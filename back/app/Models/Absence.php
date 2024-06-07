<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = [
        'user_id', 'start_date', 'end_date', 'reason', 'status_id'
    ];

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }
}
