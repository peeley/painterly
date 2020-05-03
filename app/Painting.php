<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{

    protected $fillable = ['title', 'strokes', 'view_public', 'edit_public'];

    protected $casts = [
        'strokes' => 'array',
        'view_public' => 'boolean',
        'edit_public' => 'boolean',
        'user_id' => 'integer',
    ];
    
    public function user(){
        return $this->belongsTo('App\User');
    }

    public function permissions(){
        return $this->hasMany('App\Permission');
    }
}
