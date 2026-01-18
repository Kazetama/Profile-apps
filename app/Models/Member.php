<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'full_name',
        'nim',
        'batch_year',
        'whatsapp_number',
        'status',
        'gender',
        'department',
    ];
}
