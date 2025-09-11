<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['category_name' => 'Beauty'],
            ['category_name' => 'Laptops'],
            ['category_name' => 'Motorcycles'],
            ['category_name' => 'Vehicles']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
