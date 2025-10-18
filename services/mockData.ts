import { User, Post, Subject, Comment } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user_1', fullName: 'রহিম শেখ', nickname: 'ডিজাইন মাস্টার', email: 'rahim@test.com', password: 'password123', bio: 'আমি একজন গ্রাফিক্স ডিজাইনার।' },
  { id: 'user_2', fullName: 'করিম চৌধুরী', nickname: 'ভিডিও গুরু', email: 'karim@test.com', password: 'password123', bio: 'ভিডিও এডিটিং আমার প্যাশন।' },
  { id: 'user_3', fullName: 'সখিনা বেগম', nickname: 'হিসাব বিজ্ঞানী', email: 'sokhina@test.com', password: 'password123', bio: 'আমি একাউন্টিং নিয়ে পড়াশোনা করছি।' },
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

export const MOCK_POSTS: Post[] = [
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