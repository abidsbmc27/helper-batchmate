import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { User } from '../types';

interface UserWithScore extends User {
  score: number;
}

const LeaderboardPage: React.FC = () => {
  const { users, posts } = useAppContext();

  const rankedUsers = useMemo(() => {
    const scores: { [key: string]: number } = {};

    // Initialize scores
    users.forEach(user => {
      scores[user.id] = 0;
    });

    // Calculate scores
    posts.forEach(post => {
      // 5 points for each post
      if (scores[post.authorId] !== undefined) {
        scores[post.authorId] += 5;
      }
      // 10 points for each comment
      post.comments.forEach(comment => {
        if (scores[comment.authorId] !== undefined) {
          scores[comment.authorId] += 10;
        }
      });
    });

    // Map users to include scores and filter out users with no score
    const usersWithScores: UserWithScore[] = users
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          score: scores[user.id] || 0,
        };
      })
      .filter(user => user.score > 0);

    // Sort by score descending
    return usersWithScores.sort((a, b) => b.score - a.score);
  }, [users, posts]);
  
  const getMedal = (index: number) => {
      if(index === 0) return '🥇';
      if(index === 1) return '🥈';
      if(index === 2) return '🥉';
      return `#${index + 1}`;
  }
  
  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500';
    if (index === 1) return 'bg-slate-400/10 border-slate-400';
    if (index === 2) return 'bg-orange-400/10 border-orange-400';
    return 'bg-gray-800 border-gray-700';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-8 tracking-wide">লিডারবোর্ড</h1>
        
        {rankedUsers.length > 0 ? (
          <div className="space-y-4">
            {rankedUsers.map((user, index) => (
              <div 
                key={user.id}
                className={`p-4 rounded-lg flex items-center justify-between border-l-4 transition-all duration-300 ${getRankColor(index)}`}
              >
                <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold w-16 text-center">{getMedal(index)}</span>
                    <div>
                        <p className="text-xl font-semibold text-gray-100">{user.fullName}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{user.score}</p>
                    <p className="text-xs text-gray-500">পয়েন্ট</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">লিডারবোর্ডে দেখানোর মতো কোনো ডেটা নেই।</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;