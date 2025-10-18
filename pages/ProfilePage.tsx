import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser, posts, updateUserBio, updateUserNickname } = useAppContext();
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.bio || '');

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameText, setNicknameText] = useState(currentUser?.nickname || '');

  useEffect(() => {
    setBioText(currentUser?.bio || '');
    setNicknameText(currentUser?.nickname || '');
  }, [currentUser]);

  const { userPosts, totalComments, score } = useMemo(() => {
    if (!currentUser) return { userPosts: [], totalComments: 0, score: 0 };
    const filteredPosts = posts.filter(post => post.authorId === currentUser.id);
    let commentsCount = 0;
    posts.forEach(post => {
      post.comments.forEach(comment => {
        if (comment.authorId === currentUser.id) {
          commentsCount++;
        }
      });
    });
    const calculatedScore = (filteredPosts.length * 5) + (commentsCount * 10);
    return { userPosts: filteredPosts, totalComments: commentsCount, score: calculatedScore };
  }, [posts, currentUser]);

  if (!currentUser) {
    return <p>লোড হচ্ছে...</p>;
  }
  
  const handleBioSave = () => {
      updateUserBio(currentUser.id, bioText);
      setIsEditingBio(false);
  }

  const handleNicknameSave = () => {
      updateUserNickname(currentUser.id, nicknameText);
      setIsEditingNickname(false);
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: User Card */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl sticky top-28">
           <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-green-800 rounded-full flex items-center justify-center font-bold text-green-200 text-5xl border-4 border-gray-700">
                    {currentUser.fullName.charAt(0)}
                </div>
                <h1 className="text-3xl font-bold text-gray-100 mt-4 text-center tracking-wide">{currentUser.fullName}</h1>
                
                {/* Nickname Display/Edit */}
                {isEditingNickname ? (
                    <div className="w-full mt-2">
                        <input
                             type="text"
                             value={nicknameText}
                             onChange={(e) => setNicknameText(e.target.value)}
                             className="w-full text-center p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                             placeholder="আপনার নিকনেম দিন"
                        />
                        <div className="flex justify-center gap-2 mt-2">
                            <button onClick={handleNicknameSave} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">সেইভ</button>
                            <button onClick={() => setIsEditingNickname(false)} className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">বাতিল</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg text-green-400 font-semibold">{currentUser.nickname || "নিকনেম নেই"}</p>
                        <button onClick={() => setIsEditingNickname(true)} className="text-xs text-gray-400 hover:text-green-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                )}
                <p className="text-md text-gray-400 mt-1">{currentUser.email}</p>
           </div>
           
           <div className="my-6 border-t border-gray-700"></div>

           {/* User Stats */}
            <div>
                 <h2 className="text-lg font-bold text-gray-300 mb-4">আপনার পরিসংখ্যান</h2>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            <p className="text-sm text-gray-300">মোট পোস্ট</p>
                        </div>
                        <p className="text-lg font-bold text-green-400">{userPosts.length}</p>
                    </div>
                     <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <p className="text-sm text-gray-300">মোট মন্তব্য</p>
                        </div>
                        <p className="text-lg font-bold text-green-400">{totalComments}</p>
                    </div>
                     <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                           <p className="text-sm text-gray-300">লিডারবোর্ড স্কোর</p>
                        </div>
                        <p className="text-lg font-bold text-green-400">{score}</p>
                    </div>
                 </div>
            </div>

            <div className="my-6 border-t border-gray-700"></div>

           {/* Bio Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-300">সংক্ষিপ্ত বিবরণ</h2>
                    {!isEditingBio && (
                        <button onClick={() => setIsEditingBio(true)} className="text-sm text-green-400 hover:underline">এডিট করুন</button>
                    )}
                </div>
                {isEditingBio ? (
                    <div>
                        <textarea 
                            value={bioText}
                            onChange={(e) => setBioText(e.target.value)}
                            rows={4}
                            className="w-full p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleBioSave} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">সেইভ</button>
                            <button onClick={() => setIsEditingBio(false)} className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">বাতিল</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-300 italic text-sm">{currentUser.bio || "কোনো বিবরণ যোগ করা হয়নি।"}</p>
                )}
           </div>
        </div>
      </div>

      {/* Right Column: Posts */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">আমার পোস্টসমূহ ({userPosts.length})</h2>
          <div className="space-y-4">
              {userPosts.length > 0 ? (
                  userPosts.map(post => (
                      <div key={post.id} className="border border-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700/50 transition-colors">
                          <div>
                              <span className="bg-green-900 bg-opacity-75 text-green-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                                  {post.subject}
                              </span>
                              <p className="text-lg font-semibold text-gray-200 inline">{post.title}</p>
                              <p className="text-sm text-gray-400 mt-1">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</p>
                          </div>
                          <Link to={`/post/${post.id}`} className="text-green-400 hover:underline font-semibold flex-shrink-0 ml-4">
                              বিস্তারিত দেখুন
                          </Link>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-400 text-center py-4">আপনি এখনো কোনো সমস্যা পোস্ট করেননি।</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
