<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'interested_product_id',
        'status',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'interested_product_id');
    }
}
