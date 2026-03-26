<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'company_name',
        'address', 'city', 'country', 'postcode', 'mobile', 'email',
        'order_notes', 'shipping_method', 'payment_method',
        'subtotal', 'shipping_cost', 'total', 'status',
    ];

    protected $casts = [
        'subtotal'      => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total'         => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
