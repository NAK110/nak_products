import React, { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, X, Shield, User2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import usersService, {
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "@/services/usersService";
import { AxiosError } from "axios";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingData, setEditingData] = useState<UpdateUserRequest>({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load users on component mount
  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      handleError(err, "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const resetCreateForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleCreateUser = async () => {
    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    )
      return;

    setIsCreating(true);
    try {
      const createdUser = await usersService.create({
        ...newUser,
        name: newUser.name.trim(),
        email: newUser.email.trim(),
      });

      setUsers((prev) => [...prev, createdUser]);
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (err) {
      handleError(err, "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditStart = (user: User) => {
    setEditingUser(user);
    setEditingData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Don't pre-fill password for security
    });
    setIsEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
    setEditingData({
      name: "",
      email: "",
      role: "user",
      password: "",
    });
  };

  // The key fix is in the handleEditSave function:
  const handleEditSave = async () => {
    if (!editingUser || !editingData.name.trim() || !editingData.email.trim())
      return;

    setIsUpdating(true);
    try {
      // Create the update data object
      const updateData: UpdateUserRequest = {
        name: editingData.name.trim(),
        email: editingData.email.trim(),
        role: editingData.role,
      };

      // Only include password if it's provided and not empty
      if (editingData.password && editingData.password.trim()) {
        updateData.password = editingData.password.trim();
      }
      // If password is empty, don't include it at all (undefined)

      const updatedUser = await usersService.update(editingUser.id, updateData);

      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } catch (err) {
      handleError(err, "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteStart = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      await usersService.delete(deletingUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== deletingUser.id));
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
    } catch (err) {
      handleError(err, "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    console.error(err);
    if (err instanceof AxiosError) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(defaultMessage);
      }
    } else {
      setError(defaultMessage);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive" as const,
      user: "secondary" as const,
    };

    const icons = {
      admin: <Shield className="w-3 h-3 mr-1" />,
      user: <User2 className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {icons[role as keyof typeof icons]}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Manage system users and their roles
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Enter the details for the new user account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter full name"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter email address"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userPassword">Password</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter password"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "user") =>
                      setNewUser((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                    disabled={isCreating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center">
                          <User2 className="w-4 h-4 mr-2" />
                          User
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetCreateForm();
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={
                    isCreating ||
                    !newUser.name.trim() ||
                    !newUser.email.trim() ||
                    !newUser.password.trim()
                  }
                >
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="h-auto p-1 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {loading && users?.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first user account.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStart(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details. Leave password empty to keep current
              password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editUserName">Full Name</Label>
              <Input
                id="editUserName"
                value={editingData.name}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter full name"
                disabled={isUpdating}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editUserEmail">Email Address</Label>
              <Input
                id="editUserEmail"
                type="email"
                value={editingData.email}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Enter email address"
                disabled={isUpdating}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editUserPassword">
                Password (leave empty to keep current)
              </Label>
              <Input
                id="editUserPassword"
                type="password"
                value={editingData.password}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                disabled={isUpdating}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editUserRole">Role</Label>
              <Select
                value={editingData.role}
                onValueChange={(value: "admin" | "user") =>
                  setEditingData((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center">
                      <User2 className="w-4 h-4 mr-2" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleEditCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={
                isUpdating ||
                !editingData.name.trim() ||
                !editingData.email.trim()
              }
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              user "{deletingUser?.name}" and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
