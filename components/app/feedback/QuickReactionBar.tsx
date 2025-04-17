'use client';

import { useState } from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { submitQuickFeedback } from '@/app/actions/feedback';
import { useGuest } from '@/components/GuestContext';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface QuickReactionBarProps {
  screeName: string;
  question?: string;
}

type Reaction = 'positive' | 'neutral' | 'negative';

export default function QuickReactionBar({ 
  screeName, 
  question = "How was your experience on this page?" 
}: QuickReactionBarProps) {
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { data: session } = useSession();
  const { isGuest, deviceId } = useGuest();

  const handleReactionClick = async (reaction: Reaction) => {
    if (isSubmitting || isSubmitted) return;
    
    setSelectedReaction(reaction);
    setIsSubmitting(true);
    
    try {
      const userId = session?.user?.email || (isGuest ? `guest_${deviceId}` : 'anonymous');
      
      await submitQuickFeedback({
        screen: screeName,
        reaction,
        userId,
        isGuest
      });
      
      setIsSubmitted(true);
      toast.success('Thanks for your feedback!', { duration: 2000 });
      
      // Reset after a delay for potential future feedback
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedReaction(null);
      }, 5000);
    } catch (error) {
      console.error('Error submitting quick feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center text-green-700 text-sm">
        Thanks for your feedback!
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-700 mb-3 text-center">{question}</p>
      
      <div className="flex justify-center space-x-6">
        <button
          onClick={() => handleReactionClick('positive')}
          disabled={isSubmitting}
          className={`flex flex-col items-center transition-all ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${selectedReaction === 'positive' ? 'scale-110 text-green-500' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Smile className="h-8 w-8" />
          <span className="text-xs mt-1">Good</span>
        </button>
        
        <button
          onClick={() => handleReactionClick('neutral')}
          disabled={isSubmitting}
          className={`flex flex-col items-center transition-all ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${selectedReaction === 'neutral' ? 'scale-110 text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
        >
          <Meh className="h-8 w-8" />
          <span className="text-xs mt-1">Okay</span>
        </button>
        
        <button
          onClick={() => handleReactionClick('negative')}
          disabled={isSubmitting}
          className={`flex flex-col items-center transition-all ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${selectedReaction === 'negative' ? 'scale-110 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Frown className="h-8 w-8" />
          <span className="text-xs mt-1">Poor</span>
        </button>
      </div>
    </div>
  );
} 