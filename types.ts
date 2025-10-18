export enum Subject {
  GraphicsDesign = "গ্রাফিক্স ডিজাইন",
  VideoEditing = "ভিডিও এডিটিং",
  EnglishBasics = "ইংলিশ বেসিক",
  Accounting = "অ্যাকাউন্টিং",
  MicrosoftExcel = "মাইক্রোসফট এক্সেল",
  MicrosoftWord = "মাইক্রোসফট ওয়ার্ড",
  GenerativeAI = "জেনারেটিভ এআই",
}

export interface User {
  id: string;
  fullName: string;
  nickname?: string;
  email: string;
  password?: string; // Should not be passed around, but needed for registration
  bio?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  subject: Subject;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  isSolved: boolean;
}