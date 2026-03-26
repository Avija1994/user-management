<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filter by category slug
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Featured only
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Sort
        $sortMap = [
            'price'  => ['price', 'asc'],
            '-price' => ['price', 'desc'],
            'name'   => ['name', 'asc'],
            '-name'  => ['name', 'desc'],
        ];
        [$column, $dir] = $sortMap[$request->sort] ?? ['created_at', 'desc'];
        $query->orderBy($column, $dir);

        $perPage = min((int) $request->get('per_page', 9), 50);

        return ProductResource::collection($query->paginate($perPage));
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        return response()->json(['data' => new ProductResource($product)]);
    }
}
