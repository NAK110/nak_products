import React from 'react';
import { Users } from 'lucide-react';

const UsersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">Users content will go here...</p>
      </div>
    </div>
  );
};

export default UsersPage;