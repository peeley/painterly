<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{

    protected $fillable = ['title', 'strokes'];

    protected $casts = [
        'strokes' => 'array',
        'user_id' => 'integer',
    ];
    
    public function user(){
        return $this->belongsTo('App\User');
    }
}
