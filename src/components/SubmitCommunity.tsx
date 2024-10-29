import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { submitCommunity } from '../lib/supabase';
import { Globe, Facebook, MessageCircle } from 'lucide-react';

type FormData = {
  name: string;
  platform: 'facebook' | 'reddit';
  url: string;
  city: string;
};

export default function SubmitCommunity() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const loadingToast = toast.loading('Submitting community...');
      await submitCommunity(data);
      toast.dismiss(loadingToast);
      toast.success('Community submitted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit community. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Submit a Community
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Community Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter community name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              {...register('platform', { required: 'Platform is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select platform</option>
              <option value="facebook">Facebook</option>
              <option value="reddit">Reddit</option>
            </select>
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              {...register('url', {
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL',
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              {...register('city', { required: 'City is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city name"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Submit Community
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}