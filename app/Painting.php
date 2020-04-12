<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{

    protected $fillable = ['title', 'strokes', 'view_private', 'edit_private'];

    protected $casts = [
        'strokes' => 'array',
        'view_private' => 'boolean',
        'edit_private' => 'boolean',
        'user_id' => 'integer',
    ];
    
    public function user(){
        return $this->belongsTo('App\User');
    }

    public function permissions(){
        return $this->hasMany('App\Permission');
    }
}
