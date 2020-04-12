<?php

namespace App;

use App\User;
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

    public function userCanView($user){
        if(!$this->view_private){
            return true;
        }
        else if($user){
            foreach($this->permissions as $perm){
                if($perm->user_id === $user->id && $perm->permissions !== ""){
                    return true;
                }
            }
        }
        return false;
    }
}
