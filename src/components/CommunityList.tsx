import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Star, Users, MessageSquare, ChevronDown } from 'lucide-react';
import { Community } from '../types';
import { supabase } from '../lib/supabase';

function CommunityList() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'approved');
      
      // Transform the data to match our frontend type
      return (data || []).map(community => ({
        ...community,
        memberCount: community.member_count || 0,
        postsPerDay: community.posts_per_day || 0,
        rating: community.rating || 0,
        state: community.state || ''
      }));
    },
  });

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(search.toLowerCase()) ||
      community.city.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platform === 'all' || community.platform === platform;
    return matchesSearch && matchesPlatform;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'members') return (b.memberCount || 0) - (a.memberCount || 0);
    return a.city.localeCompare(b.city);
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">Property Communities</h1>
        <p className="text-blue-100 text-lg">Connect with property investors and landlords in your area</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or city..."
              className="pl-12 w-full h-12 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full lg:w-48 h-12 px-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              <span className="text-gray-700">
                {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${platform === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => { setPlatform('all'); setIsFilterOpen(false); }}
                >
                  All Platforms
                </button>
                <button
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${platform === 'facebook' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => { setPlatform('facebook'); setIsFilterOpen(false); }}
                >
                  Facebook
                </button>
                <button
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${platform === 'reddit' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => { setPlatform('reddit'); setIsFilterOpen(false); }}
                >
                  Reddit
                </button>
              </div>
            )}
          </div>

          <select
            className="h-12 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer focus:border-blue-500 focus:ring-blue-500 transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="members">Sort by Members</option>
            <option value="city">Sort by City</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <div key={community.id} className="group bg-white rounded-lg border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {community.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    community.platform === 'facebook' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {community.platform}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {community.city}{community.state ? `, ${community.state}` : ''}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    {community.rating.toFixed(1)} / 5.0
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {community.memberCount?.toLocaleString() || '0'} members
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                    {community.postsPerDay || '0'} posts/day
                  </div>
                </div>

                <a
                  href={community.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2.5 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Join Community
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityList;