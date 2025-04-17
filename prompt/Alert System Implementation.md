We are building a next js project based on an existing next js template that have auth, payment built already, below are rules you have to follow:

<frontend rules>
1. MUST Use 'use client' directive for client-side components; In Next.js, page components are server components by default, and React hooks like useEffect can only be used in client components.
2. The UI has to look great, using polished component from shadcn, tailwind when possible; Don't recreate shadcn components, make sure you use 'shadcn@latest add xxx' CLI to add components
3. MUST adding debugging log & comment for every single feature we implement
4. Make sure to concatenate strings correctly using backslash
7. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
8. Don't update shadcn components unless otherwise specified
9. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
11. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
12. Accurately implement necessary grid layouts
13. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping
</frontend rules>

<styling_requirements>
- You ALWAYS tries to use the shadcn/ui library.
- You MUST USE the builtin Tailwind CSS variable based colors as used in the examples, like bg-primary or text-primary-foreground.
- You DOES NOT use indigo or blue colors unless specified in the prompt.
- You MUST generate responsive designs.
- The React Code Block is rendered on top of a white background. If v0 needs to use a different background color, it uses a wrapper element with a background color Tailwind class.
</styling_requirements>

<frameworks_and_libraries>
- You prefers Lucide React for icons, and shadcn/ui for components.
- You MAY use other third-party libraries if necessary or requested by the user.
- You imports the shadcn/ui components from "@/components/ui"
- You DOES NOT use fetch or make other network requests in the code.
- You DOES NOT use dynamic imports or lazy loading for components or libraries. Ex: const Confetti = dynamic(...) is NOT allowed. Use import Confetti from 'react-confetti' instead.
- Prefer using native Web APIs and browser features when possible. For example, use the Intersection Observer API for scroll-based animations or lazy loading.
</frameworks_and_libraries>

# Alert System Implementation Guide

## Task
Implement an alert system that activates when a user is driving and handling their phone, delivering escalating alerts to encourage safe behavior.

## Implementation Guide

### 1. Set Up State Management

- **File**: `types/drivesafe.types.ts`
- **Action**: Define the state interface for managing alert-related properties.

```typescript
export interface DriveSafeState {
  alertActive: boolean;
  alertLevel: number;
  alertVariant: 'A' | 'B';
  setAlertActive: (active: boolean) => void;
  updateAlertLevel: (level: number) => void;
  setAlertVariant: (variant: 'A' | 'B') => void;
}
```

### 2. Create the Alert Overlay Component

- **File**: `components/app/AlertOverlay.tsx`
- **Action**: Build a full-screen alert overlay using shadcn/ui components and Tailwind CSS for styling.

```typescript
import { Alert } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

const AlertOverlay = ({ alertActive, alertLevel }: { alertActive: boolean; alertLevel: number }) => {
  if (!alertActive) return null;

  return (
    <div className="fixed inset-0 bg-primary bg-opacity-75 flex items-center justify-center z-50">
      <Alert className="text-primary-foreground">
        <AlertTriangle className="mr-2" />
        <span>Alert Level: {alertLevel}</span>
      </Alert>
    </div>
  );
};

export default AlertOverlay;
```

### 3. Implement the Alert System Hook

- **File**: `lib/hooks/useAlertSystem.ts`
- **Action**: Manage alert state, audio cues, and escalation logic.

```typescript
import { useState, useEffect } from "react";

export const useAlertSystem = (isDriving: boolean, phoneHandling: boolean) => {
  const [alertActive, setAlertActive] = useState(false);
  const [alertLevel, setAlertLevel] = useState(0);

  useEffect(() => {
    if (isDriving && phoneHandling) {
      setAlertActive(true);
      const interval = setInterval(() => {
        setAlertLevel((prev) => prev + 1);
        // Play audio alert here
        console.log("Playing alert sound");
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setAlertActive(false);
      setAlertLevel(0);
    }
  }, [isDriving, phoneHandling]);

  return { alertActive, alertLevel };
};
```

### 4. Integrate Alert System into Dashboard

- **File**: `app/app/page.tsx`
- **Action**: Use the `useAlertSystem` hook and render the `AlertOverlay` component.

```typescript
import { useAlertSystem } from "@/lib/hooks/useAlertSystem";
import AlertOverlay from "@/components/app/AlertOverlay";

const Dashboard = () => {
  const isDriving = true; // Replace with actual state
  const phoneHandling = true; // Replace with actual state

  const { alertActive, alertLevel } = useAlertSystem(isDriving, phoneHandling);

  return (
    <div>
      {/* Other dashboard components */}
      <AlertOverlay alertActive={alertActive} alertLevel={alertLevel} />
    </div>
  );
};

export default Dashboard;
```

### 5. Implement Audio Alerts

- **Action**: Use native Web APIs or a library to play audio alerts. Ensure no dynamic imports are used.

```typescript
// Example using Web Audio API
const playAlertSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1); // Play for 1 second
};
```

### 6. Finalize and Test

- **Action**: Ensure the alert system is responsive and integrates seamlessly with the rest of the app. Test the escalation logic and audio alerts to confirm they activate and deactivate correctly based on driving and phone handling states.

By following these steps, the alert system will effectively notify users when they are driving and handling their phone, encouraging safer driving habits.