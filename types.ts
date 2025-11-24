import React from 'react';

export enum Category {
  PREP = 'PREP',
  CS = 'CS',
  CE = 'CE'
}

export interface Course {
  id: string;
  title: string;
  category: Category;
  description: string;
  tags: string[];
  videoUrl?: string;
  features: string[];
  price: number;
}

export interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

export type ViewState = 'HOME' | 'CATALOG' | 'DETAILS' | 'AI_TUTOR';

// --- Chat & Quiz Types ---
export interface AttachmentItem {
  type: 'image' | 'file';
  url: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  attachments?: AttachmentItem[];
  smartContent?: SmartContent; // New field for interactive widgets
}

// --- Smart Content Types ---

export type SmartContentType = 'QUIZ' | 'FLASHCARDS' | 'ROADMAP' | 'NONE';

export interface SmartContent {
  type: SmartContentType;
  data: QuizData | FlashcardsData | RoadmapData;
}

export interface QuizQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface FlashcardItem {
  title: string;
  content: string;
  icon?: string;
}

export interface FlashcardsData {
  topic: string;
  cards: FlashcardItem[];
}

export interface RoadmapStep {
  step: string;
  details: string;
  duration?: string;
}

export interface RoadmapData {
  goal: string;
  steps: RoadmapStep[];
}