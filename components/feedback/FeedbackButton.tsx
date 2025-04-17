'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-gradient-to-r from-[#5059FE] to-[#7D65F6] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Provide feedback"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium hidden md:inline">Feedback</span>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
} 