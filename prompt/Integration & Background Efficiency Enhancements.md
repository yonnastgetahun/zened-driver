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

# Integration & Background Efficiency Enhancements Implementation Guide

## Task
Enhance the DriveSafe app to ensure seamless integration of driving detection and phone handling modules, optimizing background efficiency to prevent battery drain.

## Implementation Guide

### 1. Integrate Driving Detection and Phone Handling Modules

- **Objective**: Ensure that the alert system is only triggered when both driving and phone handling conditions are met.

#### Steps:
1. **Combine State Management**:
   - Use the existing state management interface to track `isDriving` and `phoneHandling`.
   - Ensure that both states are updated in real-time by their respective hooks (`useDrivingDetection` and `usePhoneHandling`).

2. **Trigger Alert System**:
   - In the `useAlertSystem` hook, listen for changes in `isDriving` and `phoneHandling`.
   - Trigger the alert system when `isDriving` is `true` and `phoneHandling` is `true`.

3. **Publish Events**:
   - Ensure that the driving detection module publishes events like `drivingStarted` and `drivingStopped`.
   - Similarly, the phone handling module should publish events like `phonePickedUp` and `phonePutDown`.

### 2. Optimize Background Processing

- **Objective**: Minimize battery usage while maintaining accurate detection and alert functionality.

#### Steps:
1. **Efficient Sensor Polling**:
   - Use native Web APIs or libraries that support efficient polling intervals.
   - Adjust the frequency of sensor data collection based on the app's state (e.g., reduce frequency when `isDriving` is `false`).

2. **Background Mode Support**:
   - Ensure that the app continues to monitor driving and phone handling even when running in the background.
   - For web/PWA, use service workers or background sync APIs to maintain functionality.

3. **Resource Monitoring**:
   - Log lightweight timestamps for sensor polling start/stop to monitor resource usage.
   - Use these logs to adjust polling intervals dynamically based on battery levels or user settings.

### 3. UI & Flow Integration

- **Objective**: Ensure the dashboard reflects the current states in real-time without requiring a page refresh.

#### Steps:
1. **Real-time UI Updates**:
   - Use React state and context to ensure that changes in `isDriving`, `phoneHandling`, and `alertActive` are immediately reflected in the UI.
   - Update the `DashboardPanel` component to display current statuses using Tailwind classes for styling.

2. **Persistent Monitoring Indicator**:
   - Add a status bar or badge on the dashboard to inform the user when the system is in "monitoring mode."
   - Use shadcn/ui components for a consistent look and feel.

### 4. State & Data Points

- **Objective**: Maintain a single source of truth for all state variables and ensure efficient state updates.

#### Steps:
1. **Centralized State Management**:
   - Use a state management library or React context to manage the DriveSafe state.
   - Ensure that all components and hooks subscribe to this central state for updates.

2. **Efficient State Updates**:
   - Use action methods defined in the `DriveSafeState` interface to update state properties.
   - Ensure that state updates are batched and optimized to prevent unnecessary re-renders.

### Debug Logging

- **Objective**: Provide detailed logs to help track what worked versus what didn't.

#### Steps:
1. **Log State Changes**:
   - Add console logs or a logging library to track changes in key state variables (`isDriving`, `phoneHandling`, `alertActive`).
   - Log events like `drivingStarted`, `drivingStopped`, `phonePickedUp`, and `phonePutDown`.

2. **Error Handling**:
   - Implement error handling in sensor data collection and state updates.
   - Log errors with detailed messages to help diagnose issues quickly.

By following these steps, the DriveSafe app will efficiently integrate driving detection and phone handling modules, ensuring seamless operation in both foreground and background modes while minimizing battery usage.