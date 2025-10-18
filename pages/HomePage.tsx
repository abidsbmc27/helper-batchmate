import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import { Subject } from '../types';

const HomePage: React.FC = () => {
  const { posts, getUserById } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (selectedSubject === 'all') return true;
        return post.subject === selectedSubject;
      })
      .filter(post => {
        const lowercasedSearch = searchTerm.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowercasedSearch) ||
          post.description.toLowerCase().includes(lowercasedSearch)
        );
      });
  }, [posts, searchTerm, selectedSubject]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-6 tracking-wide">কমিউনিটি ফিড</h1>
      
      {/* Filter and Search Controls */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="সমস্যা খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">সকল বিষয়</option>
            {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} author={getUserById(post.authorId)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-200">কোনো পোস্ট পাওয়া যায়নি।</h2>
            <p className="text-gray-400 mt-2">আপনার সার্চ বা ফিল্টারের সাথে মেলে এমন কোনো পোস্ট নেই।</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;