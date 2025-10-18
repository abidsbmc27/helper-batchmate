import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, addComment, getUserById, currentUser, togglePostSolved } = useAppContext();
  const [newComment, setNewComment] = useState('');

  const post = useMemo(() => posts.find(p => p.id === id), [posts, id]);
  const author = useMemo(() => post ? getUserById(post.authorId) : undefined, [post, getUserById]);
  
  if (!post || !author) {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-100">পোস্ট খুঁজে পাওয়া যায়নি</h2>
            <Link to="/" className="text-green-400 hover:underline mt-4 inline-block">হোম পেজে ফিরে যান</Link>
        </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && id) {
      addComment(id, newComment);
      setNewComment('');
    }
  };
  
  const isAuthor = currentUser?.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div>
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-gray-700 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                        {post.subject}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${post.isSolved ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {post.isSolved ? 'সমাধান হয়েছে' : 'সমাধান হয়নি'}
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mt-3 tracking-wide">{post.title}</h1>
                 <p className="text-gray-400 mt-1">প্রশ্ন করেছেন: {author.fullName}</p>
            </div>
            <span className="text-sm text-gray-400 flex-shrink-0 pt-2 mt-2 sm:mt-0">
                {new Date(post.createdAt).toLocaleString('bn-BD')}
            </span>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap border-t border-gray-700 pt-4 mt-4">{post.description}</p>
        
        {isAuthor && (
            <div className="mt-6 text-right">
                <button
                    onClick={() => togglePostSolved(post.id)}
                    className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${post.isSolved ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                    {post.isSolved ? 'সমাধান চিহ্ন তুলে দিন' : 'সমাধান হিসেবে চিহ্নিত করুন'}
                </button>
            </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">মন্তব্যসমূহ ({post.comments.length})</h2>
        <div className="space-y-6 mb-8">
            {post.comments.length > 0 ? (
                post.comments.map(comment => {
                    const commentAuthor = getUserById(comment.authorId);
                    return (
                        <div key={comment.id} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-green-200 border-2 border-gray-600">
                                {commentAuthor?.fullName.charAt(0)}
                            </div>
                            <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                                    <p className="font-semibold text-gray-100">{commentAuthor?.fullName}</p>
                                    <p className="text-xs text-gray-400 mt-1 sm:mt-0">{new Date(comment.createdAt).toLocaleString('bn-BD')}</p>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">এখনো কোনো মন্তব্য করা হয়নি।</p>
            )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit}>
            <h3 className="text-xl font-semibold text-gray-100 mb-3">আপনার সমাধান বা মতামত লিখুন</h3>
            <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                placeholder="এখানে আপনার মন্তব্য লিখুন..."
                required
            ></textarea>
            <div className="text-right mt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    মন্তব্য যোগ করুন
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PostDetailPage;
