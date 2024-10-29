// src/components/AdminDashboard.tsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Community } from '../types';

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch pending communities with status 'pending'
  const { data: pendingCommunities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['pending-communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'pending'); // Ensure 'pending' is lowercase

      if (error) {
        toast.error('Failed to fetch pending communities');
        return [];
      }

      return data || [];
    },
  });

  // Mutation to update community status to 'approved' or 'rejected'
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'approved' | 'rejected'; // Ensure status values are lowercase
    }) => {
      const { error } = await supabase
        .from('communities')
        .update({ status }) // Status is set to 'approved' or 'rejected'
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch pending communities after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['pending-communities'] });
      toast.success('Community status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update community status');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Review and moderate community submissions</p>
      </div>

      {/* Pending Communities Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {isLoading ? (
          // Loading Indicator
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : pendingCommunities.length === 0 ? (
          // No Pending Submissions Message
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pending submissions to review</p>
          </div>
        ) : (
          // List of Pending Communities
          <div className="space-y-6">
            {pendingCommunities.map((community) => (
              <div
                key={community.id}
                className="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                {/* Community Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                    <p className="text-sm text-gray-600">
                      {community.city}, {community.state}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      community.platform === 'facebook'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {community.platform}
                  </span>
                </div>

                {/* Community Description and URL */}
                <div className="space-y-2">
                  <p className="text-gray-600">{community.description}</p>
                  <a
                    href={community.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {community.url}
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {/* Approve Button */}
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ id: community.id, status: 'approved' })
                    }
                    disabled={updateStatusMutation.isLoading}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Approve</span>
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ id: community.id, status: 'rejected' })
                    }
                    disabled={updateStatusMutation.isLoading}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
