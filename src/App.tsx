import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CommunityList from './components/CommunityList';
import AdminDashboard from './components/AdminDashboard';
import SubmitCommunity from './components/SubmitCommunity';
import Login from './components/Login';
import { Building2 } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CommunityList />} />
              <Route path="/submit" element={<SubmitCommunity />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="text-gray-600">Property Community Directory</span>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;