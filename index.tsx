// All application code is consolidated into this single file for client-side transpilation.
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, Link, NavLink, useNavigate, useParams } from 'react-router-dom';

// --- From types.ts ---
enum Subject {
  GraphicsDesign = "গ্রাফিক্স ডিজাইন",
  VideoEditing = "ভিডিও এডিটিং",
  EnglishBasics = "ইংলিশ বেসিক",
  Accounting = "অ্যাকাউন্টিং",
  MicrosoftExcel = "মাইক্রোসফট এক্সেল",
  MicrosoftWord = "মাইক্রোসফট ওয়ার্ড",
  GenerativeAI = "জেনারেটিভ এআই",
}

interface User {
  id: string;
  fullName: string;
  nickname?: string;
  email: string;
  password?: string;
  bio?: string;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  authorId: string;
  subject: Subject;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  isSolved: boolean;
}

// --- From services/auth.ts ---
const hashPassword = (password: string): string => {
  try {
    const reversed = password.split('').reverse().join('');
    return btoa(reversed);
  } catch (e) {
    console.error('Failed to hash password:', e);
    return password;
  }
};

const checkPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// --- From services/mockData.ts ---
const HASHED_MOCK_PASS = 'MzIxZHJvd3NzYXA=';

const MOCK_USERS: User[] = [
  { id: 'user_1', fullName: 'রহিম শেখ', nickname: 'ডিজাইন মাস্টার', email: 'rahim@test.com', password: HASHED_MOCK_PASS, bio: 'আমি একজন গ্রাফিক্স ডিজাইনার।' },
  { id: 'user_2', fullName: 'করিম চৌধুরী', nickname: 'ভিডিও গুরু', email: 'karim@test.com', password: HASHED_MOCK_PASS, bio: 'ভিডিও এডিটিং আমার প্যাশন।' },
  { id: 'user_3', fullName: 'সখিনা বেগম', nickname: 'হিসাব বিজ্ঞানী', email: 'sokhina@test.com', password: HASHED_MOCK_PASS, bio: 'আমি একাউন্টিং নিয়ে পড়াশোনা করছি।' },
];

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'comment_1',
        postId: 'post_1',
        authorId: 'user_2',
        content: 'আপনি Adobe Illustrator এর Pen Tool ব্যবহার করে দেখতে পারেন। এটা খুবই কার্যকরী।',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'comment_2',
        postId: 'post_1',
        authorId: 'user_3',
        content: 'ইউটিউবে "vector logo design" লিখে সার্চ করলে অনেক ভালো টিউটোরিয়াল পাবেন।',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    subject: Subject.GraphicsDesign,
    title: "ভেক্টর শেপ তৈরিতে সমস্যা",
    description: 'আমি একটি লোগো ডিজাইন করার চেষ্টা করছি কিন্তু ভেক্টর শেপগুলো ঠিকভাবে তৈরি করতে পারছি না। বিশেষ করে কার্ভগুলো স্মুথ হচ্ছে না। কেউ কি কোনো টিপস দিতে পারবেন?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    comments: MOCK_COMMENTS,
    isSolved: false,
  },
  {
    id: 'post_2',
    authorId: 'user_3',
    subject: Subject.MicrosoftExcel,
    title: "VLOOKUP ফর্মুলা কাজ করছে না",
    description: 'আমার একটি এক্সেল শিটে VLOOKUP ফর্মুলা ব্যবহার করতে সমস্যা হচ্ছে। আমি দুটি ভিন্ন শিট থেকে ডেটা মেলাতে চাই কিন্তু বারবার #N/A এরর আসছে। এর সমাধান কী হতে পারে?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    comments: [],
    isSolved: true,
  },
  {
    id: 'post_3',
    authorId: 'user_2',
    subject: Subject.VideoEditing,
    title: "Premiere Pro-তে রেন্ডারিং স্পিড কম",
    description: 'আমি Adobe Premiere Pro ব্যবহার করে ভিডিও এডিট করছি। কিন্তু রেন্ডারিং করার সময় অনেক বেশি সময় লাগছে। রেন্ডারিং স্পিড বাড়ানোর কোনো উপায় আছে কি?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    comments: [],
    isSolved: false,
  },
];


// --- From contexts/AppContext.tsx ---
interface AppContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (fullName: string, email: string, pass: string) => boolean;
  addPost: (subject: Subject, title: string, description: string) => void;
  addComment: (postId: string, content: string) => void;
  getUserById: (userId: string) => User | undefined;
  updateUserBio: (userId: string, newBio: string) => void;
  updateUserNickname: (userId: string, newNickname: string) => void;
  togglePostSolved: (postId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser !== 'null') {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Failed to parse currentUser from localStorage", error);
      localStorage.removeItem('currentUser');
    }
    return null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        return JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      localStorage.removeItem('users');
    }
    return [];
  });
  
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts) {
          return JSON.parse(savedPosts);
        }
    } catch (error) {
        console.error("Failed to parse posts from localStorage", error);
        localStorage.removeItem('posts');
    }
    return [];
  });

  const publicUsers = useMemo(() => {
    return users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  }, [users]);

  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(MOCK_USERS));
      setUsers(MOCK_USERS);
    }
    if (!localStorage.getItem('posts')) {
      localStorage.setItem('posts', JSON.stringify(MOCK_POSTS));
      setPosts(MOCK_POSTS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const login = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password && checkPassword(pass, user.password)) {
      const { password, ...userToStore } = user;
      setCurrentUser(userToStore);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (fullName: string, email: string, pass: string): boolean => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // User already exists
    }
    const hashedPassword = hashPassword(pass);
    const newUser: User = { id: `user_${Date.now()}`, fullName, email, password: hashedPassword, bio: '', nickname: '' };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };

  const addPost = (subject: Subject, title: string, description: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      subject,
      title,
      description,
      createdAt: new Date().toISOString(),
      comments: [],
      isSolved: false,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };
  
  const getUserById = (userId: string): User | undefined => {
    const user = users.find(u => u.id === userId);
    if (user) {
        const { password, ...userToReturn } = user;
        return userToReturn;
    }
    return undefined;
  };

  const updateUserBio = (userId: string, newBio: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, bio: newBio } : user
      )
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, bio: newBio } : null);
    }
  };

  const updateUserNickname = (userId: string, newNickname: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, nickname: newNickname } : user
      )
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, nickname: newNickname } : null);
    }
  };
  
  const togglePostSolved = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isSolved: !post.isSolved } : post
      )
    );
  };

  return (
    <AppContext.Provider value={{ currentUser, users: publicUsers, posts, login, logout, register, addPost, addComment, getUserById, updateUserBio, updateUserNickname, togglePostSolved }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- From components/Header.tsx ---
const Logo: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
        </defs>
        <rect width="120" height="120" rx="20" fill="url(#logoGrad)"/>
        <path d="M25 30H45V90H25V30Z" fill="white"/>
        <path d="M25 52.5H70V67.5H25V52.5Z" fill="white"/>
        <path d="M70 30C55 30 45 40 45 52.5V67.5C45 80 55 90 70 90C90 90 100 80 100 75V45C100 40 90 30 70 30ZM85 72C85 75 78 78 70 78C62 78 55 75 55 72V68H85V72ZM85 52H55V48C55 45 62 42 70 42C78 42 85 45 85 48V52Z" fill="white"/>
    </svg>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition duration-300 text-lg ${
      isActive ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
    }`;
    
  const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition duration-300 text-3xl py-2 ${
      isActive ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-700/50">
        <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
              <Logo />
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">
                Helper BatchMate
              </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {currentUser ? (
              <>
                <NavLink to="/" className={navLinkClassName} end>কমিউনিটি</NavLink>
                <NavLink to="/leaderboard" className={navLinkClassName}>লিডারবোর্ড</NavLink>
                <Link
                    to="/new-post"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                >
                    প্রবলেম পোস্ট
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-center group">
                    <UserIcon />
                    <span className="text-xs text-gray-400 group-hover:text-green-300 transition-colors mt-0.5">{currentUser.fullName.split(' ')[0]}</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="border border-red-600 text-red-400 hover:bg-red-600/20 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    লগআউট
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-green-400 font-semibold">লগইন</Link>
                <Link
                  to="/register"
                  className="border border-orange-500 text-orange-400 hover:bg-orange-500/20 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            {currentUser && (
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                    <MenuIcon />
                </button>
            )}
          </div>
        </nav>
      </header>

      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4 pt-6">
             <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white">
                <CloseIcon />
            </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-8 -mt-16">
          <NavLink to="/" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)} end>কমিউনিটি</NavLink>
          <NavLink to="/leaderboard" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)}>লিডারবোর্ড</NavLink>
          <NavLink to="/profile" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)}>প্রোফাইল</NavLink>
          <Link
              to="/new-post"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-2xl"
          >
              প্রবলেম পোস্ট
          </Link>
          <button
              onClick={handleLogout}
              className="border border-red-600 text-red-400 hover:bg-red-600/20 font-bold py-3 px-8 rounded-lg transition duration-300 text-2xl"
          >
              লগআউট
          </button>
        </div>
      </div>
    </>
  );
};

// --- From components/PostCard.tsx ---
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
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center font-bold text-green-300 text-3xl sm:text-4xl border-2 border-gray-600">
          {author?.fullName.charAt(0)}
        </div>

        <div className="flex-1">
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

          <h2 className="text-xl font-bold text-gray-50 my-2 group-hover:text-green-400 transition-colors duration-300 tracking-wide">
             <Link to={`/post/${post.id}`} className="hover:underline">{post.title}</Link>
          </h2>

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

// --- From pages/HomePage.tsx ---
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

// --- From pages/LoginPage.tsx ---
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('ভুল ইমেল বা পাসওয়ার্ড।');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">লগইন করুন</h2>
        {error && <p className="bg-red-900 bg-opacity-50 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="email">
              ইমেল
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="password">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            লগইন
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          আপনার কোনো অ্যাকাউন্ট নেই?{' '}
          <Link to="/register" className="text-green-400 hover:underline font-semibold">
            এখানে রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

// --- From pages/RegisterPage.tsx ---
const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        return;
    }
    if (register(fullName, email, password)) {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('নিবন্ধন সফল হয়েছে কিন্তু লগইন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } else {
      setError('এই ইমেল দিয়ে ইতিমধ্যে রেজিস্টার করা হয়েছে।');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
        {error && <p className="bg-red-900 bg-opacity-50 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="fullName">
              পুরো নাম
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="email">
              ইমেল অ্যাড্রেস
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="password">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            রেজিস্টার
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          আপনার কি ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
          <Link to="/login" className="text-green-400 hover:underline font-semibold">
            এখানে লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

// --- From pages/NewPostPage.tsx ---
const NewPostPage: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.GraphicsDesign);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addPost } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      addPost(subject, title, description);
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 tracking-wide">নতুন সমস্যা পোস্ট করুন</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="subject">
              বিষয় নির্বাচন করুন
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="title">
              সমস্যার শিরোনাম
            </label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                placeholder="আপনার সমস্যার একটি সংক্ষিপ্ত শিরোনাম দিন..."
                required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2" htmlFor="description">
              সমস্যার বিবরণ
            </label>
            <textarea
              id="description"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              placeholder="আপনার সমস্যাটি এখানে বিস্তারিতভাবে লিখুন..."
              required
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              পোস্ট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- From pages/PostDetailPage.tsx ---
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

// --- From pages/ProfilePage.tsx ---
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
      <div className="lg:col-span-1">
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl sticky top-28">
           <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-green-800 rounded-full flex items-center justify-center font-bold text-green-200 text-5xl border-4 border-gray-700">
                    {currentUser.fullName.charAt(0)}
                </div>
                <h1 className="text-3xl font-bold text-gray-100 mt-4 text-center tracking-wide">{currentUser.fullName}</h1>
                
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

// --- From pages/LeaderboardPage.tsx ---
interface UserWithScore extends User {
  score: number;
}

const LeaderboardPage: React.FC = () => {
  const { users, posts } = useAppContext();

  const rankedUsers = useMemo(() => {
    const scores: { [key: string]: number } = {};

    users.forEach(user => {
      scores[user.id] = 0;
    });

    posts.forEach(post => {
      if (scores[post.authorId] !== undefined) {
        scores[post.authorId] += 5;
      }
      post.comments.forEach(comment => {
        if (scores[comment.authorId] !== undefined) {
          scores[comment.authorId] += 10;
        }
      });
    });

    const usersWithScores: UserWithScore[] = users
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          score: scores[user.id] || 0,
        };
      })
      .filter(user => user.score > 0);

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


// --- From App.tsx ---
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useAppContext();
  return currentUser ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
          <Route path="/new-post" element={<PrivateRoute><NewPostPage /></PrivateRoute>} />
          <Route path="/post/:id" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};


// --- From index.tsx (original) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
