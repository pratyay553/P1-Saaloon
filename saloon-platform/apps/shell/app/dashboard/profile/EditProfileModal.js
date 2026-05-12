"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileSchema } from '@saloon/types';
import { apiClient } from '@saloon/network';
import { useAuthStore } from '@saloon/store';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Button,
  Input,
  FormGroup,
} from '@saloon/ui';

export function EditProfileModal({ isOpen, onOpenChange }) {
  const { user, setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [isOpen, user, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (updatedProfile) => apiClient.put('/api/users/me', updatedProfile),
    onSuccess: (response) => {
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('jwt_token', response.data.token);
        if (response.data.profile?.username) {
          localStorage.setItem('username', response.data.profile.username);
        }
      }
      
      const updatedProfile = response.data.profile || response.data;
      setUser(updatedProfile);
      
      reset({
        username: updatedProfile.username,
        email: updatedProfile.email,
      });

      queryClient.invalidateQueries(['me']);
      
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to update profile", error);
    }
  });

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Your Profile</ModalTitle>
          <ModalDescription>
            Make changes to your profile here. Click save when you're done.
          </ModalDescription>
        </ModalHeader>
        
        <form id="edit-profile-form" onSubmit={handleSubmit(mutate)} className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error.response?.data?.message || 'Failed to update profile.'}
            </div>
          )}
          <FormGroup label="Username" error={errors.username?.message}>
            <Input
              id="username"
              {...register("username")}
              disabled={isPending}
              error={!!errors.username}
            />
          </FormGroup>
          <FormGroup label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isPending}
              error={!!errors.email}
            />
          </FormGroup>
        </form>
        
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}