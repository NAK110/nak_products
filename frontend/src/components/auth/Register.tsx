// components/auth/Register.tsx - Fixed the array assignment issue
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { AxiosError } from "axios";

interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface RegisterError {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
}

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setFieldErrors({ password_confirmation: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<RegisterResponse>("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const registerData = response.data;

      if (registerData.user) {
        localStorage.setItem("user", JSON.stringify(registerData.user));
      }

      navigate("/products", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof AxiosError) {
        if (err.response) {
          const errorData = err.response.data as RegisterError;
          if (errorData.errors) {
            const newFieldErrors: { [key: string]: string } = {};
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (messages && messages.length > 0) {
                // Fixed: Access first element [0] to get string instead of array
                newFieldErrors[field] = messages[0];
              }
            });
            setFieldErrors(newFieldErrors);
          }
          setError(errorData.message || "Registration failed");
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                {fieldErrors.password_confirmation && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.password_confirmation}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline underline-offset-4 hover:text-blue-600"
              >
                Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
