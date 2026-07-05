<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    //Autorisation de l'assignation massive
    protected $fillable = [
        'user_id',
        'zone',
        'adress',
        'description',
        'urgency',
        'status'
    ];

    //Un signalement appartient a un user(belongsTo)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
