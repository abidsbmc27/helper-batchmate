import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Post, Comment, Subject } from '../types';
import { MOCK_USERS, MOCK_POSTS } from '../services/mockData';

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const publicUsers = useMemo(() => {
    return users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  }, [users]);

  useEffect(() => {
    // Seed data if local storage is empty
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
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
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
    const newUser: User = { id: `user_${Date.now()}`, fullName, email, password: pass, bio: '', nickname: '' };
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

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};