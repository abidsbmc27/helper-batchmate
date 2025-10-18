import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

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

export default RegisterPage;