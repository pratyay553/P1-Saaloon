"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, FormGroup } from '@saloon/ui';
import { apiClient } from '@saloon/network';

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (newAccount) => apiClient.post('/api/users/signup', newAccount),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate({ username: data.username, email: data.email, password: data.password });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up for SAloon</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error.response?.data?.message || 'An error occurred during sign up.'}
          </div>
        )}
        
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Account created successfully! You can now log in.
          </div>
        )}

        <FormGroup label="Username" htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            type="text"
            {...register("username")}
            disabled={isPending}
            error={!!errors.username}
          />
        </FormGroup>

        <FormGroup label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            {...register("email")}
            disabled={isPending}
            error={!!errors.email}
          />
        </FormGroup>

        <FormGroup label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            {...register("password")}
            disabled={isPending}
            error={!!errors.password}
          />
        </FormGroup>

        <FormGroup label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={isPending}
            error={!!errors.confirmPassword}
          />
        </FormGroup>

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}
