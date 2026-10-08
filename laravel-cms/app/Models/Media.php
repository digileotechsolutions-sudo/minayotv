<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['name', 'file_name', 'mime_type', 'size', 'disk', 'path'];
}
