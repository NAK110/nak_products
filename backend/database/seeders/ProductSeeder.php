<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'product_name' => 'Essence Mascara Lash Princess',
                'description' => 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
                'price' => 9.99,
                'in_stock' => 99,
                'image_path' => 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
                'category_id' => 1
            ],
            [
                'product_name' => 'Eyeshadow Palette with Mirror',
                'description' => 'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.',
                'price' => 19.99,
                'in_stock' => 34,
                'image_path' => 'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp',
                'category_id' => 1
            ],
            [
                'product_name' => 'Powder Canister',
                'description' => 'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',
                'price' => 14.99,
                'in_stock' => 89,
                'image_path' => 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp',
                'category_id' => 1
            ],
            [
                'product_name' => 'Apple MacBook Pro 14 Inch Space Grey',
                'description' => 'The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple\'s M1 Pro chip for exceptional performance and a stunning Retina display.',
                'price' => 1999.99,
                'in_stock' => 24,
                'image_path' => 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
                'category_id' => 2
            ],
            [
                'product_name' => 'Asus Zenbook Pro Dual Screen Laptop',
                'description' => 'The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.',
                'price' => 1799.99,
                'in_stock' => 45,
                'image_path' => 'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
                'category_id' => 2
            ],
            [
                'product_name' => 'Huawei Matebook X Pro',
                'description' => 'The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.',
                'price' => 1399.99,
                'in_stock' => 75,
                'image_path' => 'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp',
                'category_id' => 2
            ],
            [
                'product_name' => 'Generic Motorcycle',
                'description' => 'The Generic Motorcycle is a versatile and reliable bike suitable for various riding preferences. With a balanced design, it provides a comfortable and efficient riding experience.',
                'price' => 3999.99,
                'in_stock' => 34,
                'image_path' => 'https://cdn.dummyjson.com/product-images/motorcycle/generic-motorcycle/1.webp',
                'category_id' => 3
            ],
            [
                'product_name' => 'Kawasaki Z800',
                'description' => 'The Kawasaki Z800 is a powerful and agile sportbike known for its striking design and performance. It\'s equipped with advanced features, making it a favorite among motorcycle enthusiasts.',
                'price' => 8999.99,
                'in_stock' => 52,
                'image_path' => 'https://cdn.dummyjson.com/product-images/motorcycle/kawasaki-z800/1.webp',
                'category_id' => 3
            ],
            [
                'product_name' => 'MotoGP CI.H1',
                'description' => 'The MotoGP CI.H1 is a high-performance motorcycle inspired by MotoGP racing technology. It offers cutting-edge features and precision engineering for an exhilarating riding experience.',
                'price' => 14999.99,
                'in_stock' => 10,
                'image_path' => 'https://cdn.dummyjson.com/product-images/motorcycle/motogp-ci.h1/1.webp',
                'category_id' => 3
            ],
            [
                'product_name' => '300 Touring',
                'description' => 'The 300 Touring is a stylish and comfortable sedan, known for its luxurious features and smooth performance.',
                'price' => 28999.99,
                'in_stock' => 54,
                'image_path' => 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/1.webp',
                'category_id' => 4
            ],
            [
                'product_name' => 'Charger SXT RWD',
                'description' => 'The Charger SXT RWD is a powerful and sporty rear-wheel-drive sedan, offering a blend of performance and practicality.',
                'price' => 32999.99,
                'in_stock' => 57,
                'image_path' => 'https://cdn.dummyjson.com/product-images/vehicle/charger-sxt-rwd/1.webp',
                'category_id' => 4
            ],
            [
                'product_name' => 'Dodge Hornet GT Plus',
                'description' => 'The Dodge Hornet GT Plus is a compact and agile hatchback, perfect for urban driving with a touch of sportiness.',
                'price' => 24999.99,
                'in_stock' => 82,
                'image_path' => 'https://cdn.dummyjson.com/product-images/vehicle/dodge-hornet-gt-plus/1.webp',
                'category_id' => 4
            ],
        ];

        foreach ($products as $product){
            Product::create($product);
        }
    }
}
