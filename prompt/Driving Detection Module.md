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

# Driving Detection Module Implementation Guide

## Task
Implement the Driving Detection Module to monitor vehicle motion and detect when the user is driving.

## Implementation Guide

### 1. Set Up Sensor Libraries

- **Install Required Packages**: Ensure you have the necessary packages for geolocation and motion detection. If targeting a web/PWA environment, use native Web APIs.

```bash
npm install react-native-geolocation-service
```

### 2. Create the Driving Detection Hook

- **File Location**: Create a new file `useDrivingDetection.ts` in `lib/hooks/`.

- **Purpose**: This hook will use geolocation and motion sensor data to determine if the user is driving.

- **Implementation Details**:
  - Use the Geolocation API to continuously monitor the user's speed.
  - Set a speed threshold (e.g., 10 mph) to trigger "driving mode."
  - Use accelerometer/gyroscope data to confirm driving motion and minimize false positives.

```typescript
import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

export function useDrivingDetection() {
  const [isDriving, setIsDriving] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const speed = position.coords.speed || 0;
        setCurrentSpeed(speed);

        if (speed > 4.47) { // 10 mph in meters per second
          setIsDriving(true);
        } else {
          setIsDriving(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return { isDriving, currentSpeed };
}
```

### 3. Integrate the Hook into the Dashboard

- **File Location**: Use the `useDrivingDetection` hook in `app/app/page.tsx`.

- **UI Updates**:
  - Display a "Driving" status indicator on the dashboard when `isDriving` is true.
  - Use Tailwind CSS classes for styling (e.g., `bg-primary` for the indicator).

```typescript
import React from 'react';
import { useDrivingDetection } from '@/lib/hooks/useDrivingDetection';
import { Badge } from '@/components/ui';

const DashboardPanel = () => {
  const { isDriving, currentSpeed } = useDrivingDetection();

  return (
    <div className="p-4">
      <h1 className="text-primary-foreground">DriveSafe Dashboard</h1>
      <div className="mt-4">
        <Badge className={`bg-${isDriving ? 'primary' : 'gray-300'}`}>
          {isDriving ? 'Driving' : 'Idle'}
        </Badge>
        <p>Current Speed: {currentSpeed.toFixed(2)} m/s</p>
      </div>
    </div>
  );
};

export default DashboardPanel;
```

### 4. State Management

- **State Variables**:
  - `isDriving`: Boolean flag indicating if the user is driving.
  - `currentSpeed`: Current speed of the user.

- **State Updates**:
  - Update `isDriving` and `currentSpeed` based on sensor data.
  - Ensure these states are accessible to other components or hooks that may need to react to driving status changes.

### 5. Debug Logging

- **Add Debug Logs**:
  - Log the current speed and driving status changes to the console for debugging purposes.
  - Ensure logs are clear and provide enough context to understand the state transitions.

```typescript
useEffect(() => {
  console.log(`Current Speed: ${currentSpeed} m/s`);
  console.log(`Driving Status: ${isDriving ? 'Driving' : 'Idle'}`);
}, [currentSpeed, isDriving]);
```

### Summary

By following these steps, the Driving Detection Module will effectively monitor vehicle motion and update the UI to reflect the user's driving status. The use of Tailwind CSS and shadcn/ui components ensures a consistent and professional look, while the debug logs provide valuable insights during development and troubleshooting.