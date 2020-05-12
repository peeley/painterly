<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $casts = [
        'user_id' => 'integer',
        'painting_id' => 'integer',
        'permissions' => 'string'
    ];

    protected $fillable = [
        'user_id',
        'permissions'
    ];

    public function painting(){
        return $this->belongsTo('App\Painting');
    }
}
