<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CartItem::with('product.category')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json(['data' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'integer|min:1',
        ]);

        $cartItem = CartItem::updateOrCreate(
            ['user_id' => auth()->id(), 'product_id' => $request->product_id],
            ['quantity' => \DB::raw('quantity + ' . ($request->quantity ?? 1))]
        );

        // If newly created, set quantity directly
        if ($cartItem->wasRecentlyCreated) {
            $cartItem->update(['quantity' => $request->quantity ?? 1]);
        }

        return response()->json([
            'message' => 'Item added to cart',
            'data'    => $cartItem->load('product'),
        ], 201);
    }

    public function update(Request $request, CartItem $cart): JsonResponse
    {
        abort_unless($cart->user_id === auth()->id(), 403);

        $request->validate(['quantity' => 'required|integer|min:1']);

        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart updated', 'data' => $cart->load('product')]);
    }

    public function destroy(CartItem $cart): JsonResponse
    {
        abort_unless($cart->user_id === auth()->id(), 403);

        $cart->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }
}
