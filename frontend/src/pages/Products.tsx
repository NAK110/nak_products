import React from 'react';
import { Package } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage your product inventory</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">Products content will go here...</p>
      </div>
    </div>
  );
};

export default Products;