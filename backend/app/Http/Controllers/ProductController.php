<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')->get();

        // Add image URLs to each product
        $products->each(function ($product) {
            if ($product->image_path) {
                // Check if image_path is already a full URL (external image)
                if (filter_var($product->image_path, FILTER_VALIDATE_URL)) {
                    $product->image_url = $product->image_path; // Use as-is for external URLs
                } else {
                    $product->image_url = Storage::url($product->image_path); // Use Storage::url for local files
                }
            } else {
                $product->image_url = null;
            }
        });

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'in_stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data = $request->except('image');

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('products', $filename, 'public');
            $data['image_path'] = $path;
        }

        $product = Product::create($data);

        $product->load('category');

        // Add the full URL to the response - Fixed logic
        if ($product->image_path) {
            if (filter_var($product->image_path, FILTER_VALIDATE_URL)) {
                $product->image_url = $product->image_path; // External URL
            } else {
                $product->image_url = Storage::url($product->image_path); // Local file
            }
        } else {
            $product->image_url = null;
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');

        // Fixed logic - same as index method
        if ($product->image_path) {
            if (filter_var($product->image_path, FILTER_VALIDATE_URL)) {
                $product->image_url = $product->image_path; // External URL
            } else {
                $product->image_url = Storage::url($product->image_path); // Local file
            }
        } else {
            $product->image_url = null;
        }

        return $product;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'in_stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data = $request->except('image');

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it's a local file
            if (
                $product->image_path &&
                !filter_var($product->image_path, FILTER_VALIDATE_URL) &&
                Storage::disk('public')->exists($product->image_path)
            ) {
                Storage::disk('public')->delete($product->image_path);
            }

            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('products', $filename, 'public');

            $data['image_path'] = $path;
        }

        $product->update($data);

        $product->load('category');
        // Add the full URL to the response - Fixed logic
        if ($product->image_path) {
            if (filter_var($product->image_path, FILTER_VALIDATE_URL)) {
                $product->image_url = $product->image_path; // External URL
            } else {
                $product->image_url = Storage::url($product->image_path); // Local file
            }
        } else {
            $product->image_url = null;
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete associated image only if it's a local file
        if (
            $product->image_path &&
            !filter_var($product->image_path, FILTER_VALIDATE_URL) &&
            Storage::disk('public')->exists($product->image_path)
        ) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
