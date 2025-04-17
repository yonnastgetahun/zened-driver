'use client';

import { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, Lightbulb, Check } from 'lucide-react';
import { useGuest } from '@/components/GuestContext';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitFeedback } from '@/app/actions/feedback';
import toast from 'react-hot-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'issue' | 'suggestion';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('issue');
  const [feedback, setFeedback] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { isGuest, deviceId } = useGuest();

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFeedback('');
        setContactInfo('');
        setFeedbackType('issue');
        setIsSubmitted(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user info (either from session or guest context)
      const userId = session?.user?.email || (isGuest ? `guest_${deviceId}` : 'anonymous');
      
      await submitFeedback({
        type: feedbackType,
        message: feedback,
        contactInfo: contactInfo || undefined,
        userId,
        isGuest
      });
      
      setIsSubmitted(true);
      toast.success('Thank you for your feedback!');
      
      // Close modal after showing success for a moment
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-semibold">We Value Your Feedback</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              /* Success message */
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  Your feedback is valuable to us and will help us improve the app.
                </p>
              </div>
            ) : (
              /* Feedback Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Feedback Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('issue')}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                        feedbackType === 'issue'
                          ? 'border-[#5059FE] bg-[#5059FE]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className={feedbackType === 'issue' ? 'font-medium' : ''}>Report Issue</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackType('suggestion')}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                        feedbackType === 'suggestion'
                          ? 'border-[#5059FE] bg-[#5059FE]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span className={feedbackType === 'suggestion' ? 'font-medium' : ''}>Suggestion</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="feedback" className="text-sm font-medium text-gray-700">
                    {feedbackType === 'issue'
                      ? 'What issue are you experiencing?'
                      : 'What features would you like to see?'}
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[#5059FE] focus:border-transparent"
                    placeholder={
                      feedbackType === 'issue'
                        ? 'Please describe the issue in detail...'
                        : 'I would like to see...'
                    }
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact" className="text-sm font-medium text-gray-700">
                    Contact Info (optional)
                  </label>
                  <input
                    id="contact"
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[#5059FE] focus:border-transparent"
                    placeholder="Email or phone number for follow-up"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#5059FE] to-[#7D65F6] text-white hover:from-[#4048ed] hover:to-[#6A55E1]'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 