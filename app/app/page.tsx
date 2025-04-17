/**
 * This is the main Zened Driver app home page
 * Focused on mindfulness and distraction-free driving experiences
 */
import DriveSafeDashboard from '@/components/app/DriveSafeDashboard';
import { DriveSafeProvider } from '@/components/app/DriveSafeContext';
import { Header } from '@/components/app/Header';
import { Sidebar } from '@/components/app/Sidebar';
import QuickReactionBar from '@/components/app/feedback/QuickReactionBar';
import config from '@/config';

export default function AppPage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <Header />
        <DriveSafeProvider>
          <DriveSafeDashboard />
          
          {/* Quick feedback at the bottom of the main dashboard */}
          <div className="max-w-md mx-auto my-8">
            <QuickReactionBar 
              screeName="dashboard" 
              question={`How is your ${config.metadata.title} experience?`} 
            />
          </div>
        </DriveSafeProvider>
      </div>
    </div>
  );
}

