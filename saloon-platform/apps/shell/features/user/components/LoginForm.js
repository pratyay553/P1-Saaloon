"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "@saloon/types";
import { loginUser } from "@saloon/services";
import { Button, Input, FormGroup } from "@saloon/ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@saloon/store";

export function LoginForm() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store the token in the Zustand store (which also persists it)
      if (data.token) {
        setToken(data.token);
        
        // Keep these for backward compatibility if needed by the api-client interceptor
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('username', data.username);
        
        // Set a generic cookie for Next.js middleware protection
        document.cookie = "is_auth=true; path=/; max-age=86400; SameSite=Lax";
      }
      // Redirect to the dashboard upon successful login
      router.push("/dashboard");
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full p-8 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50"
    >
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Enter your credentials to access your workspace</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error.response?.data?.message || 'Invalid username or password.'}
          </div>
        )}
        
        <FormGroup label="Username" error={errors.username?.message}>
          <Input 
            {...register("username")} 
            disabled={isPending}
            placeholder="admin"
            error={!!errors.username}
            className="h-11"
          />
        </FormGroup>

        <FormGroup label="Password" error={errors.password?.message}>
          <Input 
            type="password" 
            {...register("password")} 
            disabled={isPending}
            placeholder="••••••••"
            error={!!errors.password}
            className="h-11"
          />
        </FormGroup>

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
          {isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
