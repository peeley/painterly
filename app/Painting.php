<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{

    protected $fillable = ['title', 'objects', 'view_public', 'edit_public'];

    protected $casts = [
        'objects' => 'array',
        'view_public' => 'boolean',
        'edit_public' => 'boolean',
        'user_id' => 'integer',
    ];

    protected $attributes = [
        'title' => 'Blank painting',
        'objects' => '[]',
        'view_public' => false,
        'edit_public' => false,
    ];

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function permissions(){
        return $this->hasMany('App\Permission');
    }

    public function share(User $user, string $perms): string {
        return $this->permissions()->updateOrCreate(
            ['user_id' => $user->id, 'user_email' => $user->email],
            ['permissions' => $perms]);
    }
}
