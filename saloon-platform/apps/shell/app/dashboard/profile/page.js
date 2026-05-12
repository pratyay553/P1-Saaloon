"use client";

import { useState } from 'react';
import { useAuthStore } from '@saloon/store';
import { Button } from '@saloon/ui';
import { EditProfileModal } from './EditProfileModal';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Loading Profile...</h1>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded-md mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-lg text-slate-500 mt-1">View and manage your personal information.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40">
        <div className="p-8 border-b border-slate-200 flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl shadow-sm border-2 border-white">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900">{user.username}</h2>
            <p className="text-slate-500 font-medium">{user.email || 'No email provided'}</p>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Username</label>
            <p className="text-lg font-medium text-slate-900">{user.username}</p>
          </div>
          <div className="col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
            <p className="text-lg font-medium text-slate-900">{user.email || 'Not provided'}</p>
          </div>
          <div className="col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">User ID</label>
            <p className="text-sm font-medium text-slate-900 font-mono bg-slate-200 inline-block px-2 py-1 rounded">{user.id}</p>
          </div>
          <div className="col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Account Status</label>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active
            </span>
          </div>
        </div>
        <div className="bg-slate-50/70 px-8 py-5 border-t border-slate-200 flex justify-end">
          <Button variant="default" onClick={() => setIsEditModalOpen(true)}>Edit Profile Details</Button>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
      />
    </div>
  );
}
