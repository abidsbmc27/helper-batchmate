import React from 'react';
import { Link } from 'react-router-dom';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  author: User | undefined;
}

const PostCard: React.FC<PostCardProps> = ({ post, author }) => {
  const cardStateClasses = !post.isSolved 
    ? 'bg-red-900/40 border-red-600/70' 
    : 'bg-gray-800 border-gray-700/50 hover:bg-gray-700/40 hover:border-green-500/50';

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 group p-5 border ${cardStateClasses}`}>
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Large Avatar */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center font-bold text-green-300 text-3xl sm:text-4xl border-2 border-gray-600">
          {author?.fullName.charAt(0)}
        </div>

        <div className="flex-1">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <p className="font-bold text-gray-100 text-lg">{author ? author.fullName : 'Unknown User'}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString('bn-BD')}
              </p>
            </div>
            {!post.isSolved && (
                <span className="bg-red-600/20 border border-red-500/50 text-red-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 mt-2 sm:mt-0 self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>সমাধান হয়নি</span>
                </span>
            )}
          </div>

          {/* Post Title */}
          <h2 className="text-xl font-bold text-gray-50 my-2 group-hover:text-green-400 transition-colors duration-300 tracking-wide">
             <Link to={`/post/${post.id}`} className="hover:underline">{post.title}</Link>
          </h2>

          {/* Card Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 mt-4">
             <div className="flex items-center gap-4">
                <span className="bg-green-900 bg-opacity-75 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {post.subject}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span>{post.comments.length} টি উত্তর</span>
                </div>
             </div>

            <Link
              to={`/post/${post.id}`}
              className="inline-block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300 text-sm"
            >
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;