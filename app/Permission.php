<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    const PERMISSION_READ_ONLY = 'read';
    const PERMISSION_READ_AND_WRITE = 'read_write';

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
