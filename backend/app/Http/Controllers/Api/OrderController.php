<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('items')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Order $o) => $this->formatOrder($o));

        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|integer',
            'items.*.name' => 'required|string|max:150',
            'items.*.category' => 'required|string|max:50',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1|max:99',
            'items.*.imageUrl' => 'nullable|string|max:2048',
            'total' => 'nullable|numeric|min:0',
            'customerNote' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated) {
            $orderId = 'CMD-'.now()->timestamp;

            $order = Order::create([
                'id' => $orderId,
                'status' => 'pending',
                'total' => $validated['total'] ?? 0,
                'customer_note' => $validated['customerNote'] ?? '',
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'] ?? null,
                    'name' => $item['name'],
                    'category' => $item['category'],
                    'price' => $item['price'] ?? 0,
                    'quantity' => $item['quantity'],
                    'image_url' => $item['imageUrl'] ?? '',
                ]);
            }

            return response()->json($this->formatOrder($order->load('items')), 201);
        });
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json($this->formatOrder($order->fresh('items')));
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json(['ok' => true]);
    }

    public function stats(): JsonResponse
    {
        $products = Product::all();
        $orders = Order::all();

        $delivered = $orders->where('status', 'delivered');
        $pending = $orders->where('status', 'pending');
        $confirmed = $orders->where('status', 'confirmed');

        return response()->json([
            'totalOrders' => $orders->count(),
            'pendingCount' => $pending->count(),
            'confirmedCount' => $confirmed->count(),
            'deliveredCount' => $delivered->count(),
            'revenueDelivered' => (float) $delivered->sum('total'),
            'revenuePending' => (float) $pending->merge($confirmed)->sum('total'),
            'inventoryValue' => (float) $products->where('price', '>', 0)->sum('price'),
            'productCount' => $products->count(),
            'featuredCount' => $products->where('is_featured', true)->count(),
        ]);
    }

    private function formatOrder(Order $o): array
    {
        return [
            'id' => $o->id,
            'createdAt' => $o->created_at?->toIso8601String(),
            'updatedAt' => $o->updated_at?->toIso8601String(),
            'status' => $o->status,
            'total' => (float) $o->total,
            'customerNote' => $o->customer_note,
            'items' => $o->items->map(fn (OrderItem $i) => [
                'id' => $i->product_id,
                'name' => $i->name,
                'category' => $i->category,
                'price' => (float) $i->price,
                'quantity' => $i->quantity,
                'imageUrl' => $i->image_url,
            ])->values()->all(),
        ];
    }
}
