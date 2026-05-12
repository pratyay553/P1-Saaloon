"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editProfileSchema } from '@saloon/types';
import { updateUserProfile } from '@saloon/services';
import { Button, Input, FormGroup, ModalFooter, ModalHeader, ModalTitle, ModalDescription } from '@saloon/ui';
import { useAuthStore } from '@saloon/store';

export function EditProfileForm({ user, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // If the backend sends back a new token (because username changed), update it
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      
      // Update the user in the global auth store
      const updatedProfile = data.profile || data;
      setUser(updatedProfile);
      
      // Invalidate any queries that depend on user data to refetch
      queryClient.invalidateQueries(['user', 'me']);
      
      onSuccess(); // Close the modal
    },
  });

  return (
    <>
      <ModalHeader>
        <ModalTitle>Edit Your Profile</ModalTitle>
        <ModalDescription>
          Make changes to your profile here. Click save when you're done.
        </ModalDescription>
      </ModalHeader>
      
      <form onSubmit={handleSubmit(mutate)} className="space-y-4 mt-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error.response?.data?.message || 'Failed to update profile.'}
          </div>
        )}
        
        <FormGroup label="Username" error={errors.username?.message}>
          <Input 
            {...register("username")} 
            disabled={isPending}
            error={!!errors.username}
          />
        </FormGroup>

        <FormGroup label="Email" error={errors.email?.message}>
          <Input 
            type="email" 
            {...register("email")} 
            disabled={isPending}
            error={!!errors.email}
          />
        </FormGroup>

        <ModalFooter className="mt-6">
          <Button type="submit" isLoading={isPending}>
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </>
  );
}
