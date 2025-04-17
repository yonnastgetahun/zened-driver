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

# Final UI Polish and User Flow Integration Implementation Guide

## Task
Integrate and polish the DriveSafe app's UI and user flow to ensure a seamless and professional user experience.

## Implementation Guide

### 1. Integrate Dashboard Components

- **Objective**: Ensure that all components (DashboardPanel, AlertOverlay, etc.) are integrated into the DriveSafe Dashboard in `app/app/page.tsx`.

- **Steps**:
  1. **Import Components**: Import `DashboardPanel` and `AlertOverlay` from `components/app/`.
     ```typescript
     import DashboardPanel from '@/components/app/DashboardPanel';
     import AlertOverlay from '@/components/app/AlertOverlay';
     ```

  2. **Render Components**: In `app/app/page.tsx`, render these components within the main dashboard layout.
     ```typescript
     export default function DriveSafeDashboard() {
       return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground">
           <Header />
           <DashboardPanel />
           <AlertOverlay />
         </div>
       );
     }
     ```

  3. **Ensure Responsiveness**: Use Tailwind CSS classes to ensure the layout is responsive across devices.

### 2. Update State Management

- **Objective**: Ensure that the state management system is fully integrated and updates the UI components in real-time.

- **Steps**:
  1. **Centralize State**: Use a context or a state management library to manage the `DriveSafeState` interface.
     ```typescript
     import { createContext, useContext, useState } from 'react';
     import { DriveSafeState } from '@/types/drivesafe.types';

     const DriveSafeContext = createContext<DriveSafeState | undefined>(undefined);

     export const DriveSafeProvider: React.FC = ({ children }) => {
       const [state, setState] = useState<DriveSafeState>({
         drivingStatus: 'idle',
         currentSpeed: 0,
         phoneHandling: false,
         alertActive: false,
         alertLevel: 0,
         alertVariant: 'A',
         setDrivingStatus: (status) => setState((prev) => ({ ...prev, drivingStatus: status })),
         updateSpeed: (speed) => setState((prev) => ({ ...prev, currentSpeed: speed })),
         setPhoneHandling: (handling) => setState((prev) => ({ ...prev, phoneHandling: handling })),
         setAlertActive: (active) => setState((prev) => ({ ...prev, alertActive: active })),
         updateAlertLevel: (level) => setState((prev) => ({ ...prev, alertLevel: level })),
         setAlertVariant: (variant) => setState((prev) => ({ ...prev, alertVariant: variant })),
       });

       return <DriveSafeContext.Provider value={state}>{children}</DriveSafeContext.Provider>;
     };

     export const useDriveSafe = () => {
       const context = useContext(DriveSafeContext);
       if (!context) {
         throw new Error('useDriveSafe must be used within a DriveSafeProvider');
       }
       return context;
     };
     ```

  2. **Wrap Application**: Wrap the `DriveSafeDashboard` component with `DriveSafeProvider` in `app/app/page.tsx`.
     ```typescript
     export default function DriveSafeDashboard() {
       return (
         <DriveSafeProvider>
           <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground">
             <Header />
             <DashboardPanel />
             <AlertOverlay />
           </div>
         </DriveSafeProvider>
       );
     }
     ```

### 3. Implement Smooth Transitions and Animations

- **Objective**: Use animations and transitions to enhance the user experience.

- **Steps**:
  1. **Use Tailwind Transitions**: Apply Tailwind CSS transition classes to components for smooth state changes.
     ```typescript
     <div className="transition-all duration-300 ease-in-out">
       {/* Component content */}
     </div>
     ```

  2. **Animate Alert Overlay**: Use CSS animations for the `AlertOverlay` to appear and disappear smoothly.
     ```typescript
     import { useDriveSafe } from '@/lib/hooks/useDriveSafe';

     const AlertOverlay: React.FC = () => {
       const { alertActive } = useDriveSafe();

       return (
         <div
           className={`fixed inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center transition-opacity duration-500 ${
             alertActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
           }`}
         >
           <div className="text-white text-center">
             <LucideAlertCircle className="w-12 h-12 mb-4" />
             <p className="text-lg font-bold">Please put your phone down!</p>
           </div>
         </div>
       );
     };
     ```

### 4. Ensure Consistent Styling

- **Objective**: Maintain a consistent and professional look using shadcn/ui components and Tailwind CSS.

- **Steps**:
  1. **Use shadcn/ui Components**: Replace any placeholder components with shadcn/ui components.
     ```typescript
     import { Button } from '@/components/ui';

     <Button className="bg-primary text-primary-foreground">Start Driving</Button>
     ```

  2. **Apply Tailwind Colors**: Use Tailwind CSS variable-based colors for all UI elements.
     ```typescript
     <div className="bg-primary text-primary-foreground">
       {/* Content */}
     </div>
     ```

### 5. Test Full User Flow

- **Objective**: Ensure that the entire user flow from login to alert handling is smooth and intuitive.

- **Steps**:
  1. **Simulate User Actions**: Test the app by simulating driving detection, phone handling, and alert triggering.
  2. **Verify State Updates**: Ensure that state changes are reflected in the UI immediately.
  3. **Check Responsiveness**: Test the app on different devices to ensure responsiveness and usability.

By following these steps, the DriveSafe app will provide a polished and integrated user experience, with seamless transitions, consistent styling, and real-time updates.