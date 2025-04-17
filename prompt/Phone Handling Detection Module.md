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

# Phone Handling Detection Module Implementation Guide

## Task
Implement a module to detect phone handling while driving, using sensor data to trigger alerts when the phone is picked up or handled.

## Implementation Guide

### 1. Set Up Sensor Libraries

1. **Install Required Libraries:**
   - If targeting mobile browsers or PWA, ensure you have access to the necessary sensor APIs. For React Native, use `react-native-sensors`.
   - For web-based implementations, use the DeviceMotionEvent and DeviceOrientationEvent APIs.

2. **Environment Setup:**
   - Ensure your environment supports sensor data access. For web, this may require HTTPS and user permissions.

### 2. Create the Phone Handling Detection Hook

1. **File Location:**
   - Create a new file `usePhoneHandling.ts` in `lib/hooks/`.

2. **Hook Implementation:**
   - Use accelerometer and gyroscope data to detect phone handling.
   - Define a motion pattern that distinguishes between a phone at rest and a phone being handled.

3. **Example Hook Structure:**
   ```typescript
   import { useState, useEffect } from 'react';

   export function usePhoneHandling() {
     const [phoneHandling, setPhoneHandling] = useState(false);

     useEffect(() => {
       const handleMotion = (event: DeviceMotionEvent) => {
         const { acceleration } = event;
         if (acceleration) {
           const { x, y, z } = acceleration;
           // Define a threshold to detect handling
           const threshold = 1.5;
           if (Math.abs(x) > threshold || Math.abs(y) > threshold || Math.abs(z) > threshold) {
             setPhoneHandling(true);
           } else {
             setPhoneHandling(false);
           }
         }
       };

       window.addEventListener('devicemotion', handleMotion);

       return () => {
         window.removeEventListener('devicemotion', handleMotion);
       };
     }, []);

     return phoneHandling;
   }
   ```

### 3. Integrate the Hook into the Dashboard

1. **File Location:**
   - Use the hook in `components/app/DashboardPanel.tsx`.

2. **UI Update:**
   - Add an "Attention" icon using Lucide React icons to the dashboard when phone handling is detected.
   - Use Tailwind CSS for styling, e.g., `text-primary-foreground`.

3. **Example Integration:**
   ```typescript
   import { usePhoneHandling } from '@/lib/hooks/usePhoneHandling';
   import { AlertCircle } from 'lucide-react';

   const DashboardPanel = () => {
     const phoneHandling = usePhoneHandling();

     return (
       <div className="dashboard-panel">
         {phoneHandling && (
           <div className="attention-indicator text-primary-foreground">
             <AlertCircle />
             <span>Phone Handling Detected</span>
           </div>
         )}
         {/* Other dashboard content */}
       </div>
     );
   };

   export default DashboardPanel;
   ```

### 4. State Management

1. **State Interface:**
   - Ensure the `DriveSafeState` interface includes a `phoneHandling` boolean.

2. **State Updates:**
   - Use the hook to update the `phoneHandling` state in the central state management system.

3. **Example State Update:**
   ```typescript
   // In your state management setup
   const [state, setState] = useState<DriveSafeState>({
     // other state properties
     phoneHandling: false,
   });

   const setPhoneHandling = (handling: boolean) => {
     setState((prevState) => ({ ...prevState, phoneHandling: handling }));
   };
   ```

### 5. Debug Logging

1. **Add Debug Logs:**
   - Log sensor data and state changes to help with debugging and validation.

2. **Example Debug Log:**
   ```typescript
   useEffect(() => {
     console.log('Phone handling state:', phoneHandling);
   }, [phoneHandling]);
   ```

By following these steps, you will implement a robust phone handling detection module that integrates seamlessly with the DriveSafe app, providing real-time feedback and alerts to enhance driver safety.