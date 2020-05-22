<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $casts = [
        'user_id' => 'integer',
        'user_email' => 'string',
        'painting_id' => 'integer',
        'permissions' => 'string'
    ];

    protected $fillable = [
        'user_id',
        'user_email',
        'permissions'
    ];

    public function painting(){
        return $this->belongsTo('App\Painting');
    }
}
