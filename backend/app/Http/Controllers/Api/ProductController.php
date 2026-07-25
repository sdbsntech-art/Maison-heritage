<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->orderByDesc('is_featured')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $p) => $this->formatProduct($p));

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateProduct($request);
        $product = Product::create($data);

        return response()->json($this->formatProduct($product), 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $this->validateProduct($request);
        $product->update($data);

        return response()->json($this->formatProduct($product->fresh()));
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['ok' => true]);
    }

    private function validateProduct(Request $request): array
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'category' => 'required|string|max:50',
            'price' => 'nullable|numeric|min:0|max:99999999',
            'description' => 'nullable|string|max:2000',
            'imageUrl' => 'nullable|string|max:2048',
            'isFeatured' => 'boolean',
            'inStock' => 'boolean',
        ]);

        return [
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'] ?? 0,
            'description' => $validated['description'] ?? '',
            'image_url' => $validated['imageUrl'] ?? '',
            'is_featured' => $validated['isFeatured'] ?? false,
            'in_stock' => $validated['inStock'] ?? true,
        ];
    }

    private function formatProduct(Product $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'category' => $p->category,
            'price' => (float) $p->price,
            'description' => $p->description,
            'imageUrl' => $p->image_url,
            'isFeatured' => (bool) $p->is_featured,
            'inStock' => (bool) $p->in_stock,
        ];
    }
}
