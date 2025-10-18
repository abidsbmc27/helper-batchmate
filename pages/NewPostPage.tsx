import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Subject } from '../types';

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

export default NewPostPage;