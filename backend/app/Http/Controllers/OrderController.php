<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('items')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function store(OrderRequest $request): JsonResponse
    {
        $userId    = auth()->id();
        $cartItems = CartItem::with('product')->where('user_id', $userId)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 422);
        }

        $order = DB::transaction(function () use ($request, $userId, $cartItems) {

            $subtotal = $cartItems->sum(fn($i) => $i->quantity * $i->product->price);
            $shipping = $this->shippingCost($request->shipping_method);

            $order = Order::create([
                ...$request->validated(),
                'user_id'       => $userId,
                'subtotal'      => $subtotal,
                'shipping_cost' => $shipping,
                'total'         => $subtotal + $shipping,
                'status'        => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'price'        => $item->product->price,
                    'quantity'     => $item->quantity,
                    'total'        => $item->quantity * $item->product->price,
                ]);
            }

            CartItem::where('user_id', $userId)->delete();

            return $order->load('items');
        });

        return response()->json([
            'message' => 'Order placed successfully',
            'data'    => $order,
        ], 201);
    }

    private function shippingCost(string $method): float
    {
        return match ($method) {
            'flat_rate'    => 15.00,
            'local_pickup' => 8.00,
            default        => 0.00,
        };
    }
}
