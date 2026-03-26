<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'company_name'    => 'nullable|string|max:255',
            'address'         => 'required|string|max:500',
            'city'            => 'required|string|max:100',
            'country'         => 'required|string|max:100',
            'postcode'        => 'required|string|max:20',
            'mobile'          => 'required|string|max:20',
            'email'           => 'required|email',
            'order_notes'     => 'nullable|string',
            'shipping_method' => 'required|in:free,flat_rate,local_pickup',
            'payment_method'  => 'required|in:bank_transfer,check,cash_on_delivery,paypal',
        ];
    }
}
