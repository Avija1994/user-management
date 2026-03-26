<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'price'       => $this->price,
            'unit'        => $this->unit,
            'image'       => $this->image,
            'image_url'   => $this->image ? asset('storage/' . $this->image) : null,
            'stock'       => $this->stock,
            'rating'      => $this->rating,
            'is_featured' => $this->is_featured,
            'category'    => $this->whenLoaded('category', fn() => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'created_at'  => $this->created_at,
        ];
    }
}
