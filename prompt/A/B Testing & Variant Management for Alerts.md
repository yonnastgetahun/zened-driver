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

# A/B Testing & Variant Management for Alerts Implementation Guide

## Task
Implement A/B testing and variant management for the alert system in the DriveSafe app.

## Implementation Guide

### Overview
The goal is to test different versions of alerts to optimize their effectiveness. This involves assigning users to different alert variants and ensuring the alert system adapts based on the assigned variant.

### Steps

1. **Define Alert Variants**
   - Create two alert variants: Variant A and Variant B.
   - Variant A: Standard alert with default beep and voice message.
   - Variant B: Slightly more aggressive sound and different UI elements (e.g., colored border or animation).

2. **State Management**
   - Add a state variable `alertVariant` to manage the assigned variant for each user session.
   - Ensure this state is consistent throughout the session.

   ```typescript
   export interface DriveSafeState {
     // Existing properties...
     alertVariant: 'A' | 'B';

     // Action methods...
     setAlertVariant: (variant: 'A' | 'B') => void;
   }
   ```

3. **Variant Assignment Logic**
   - Implement a simple logic to assign a variant to each user session.
   - This can be done randomly on the client side or determined by the backend.

   ```typescript
   import { useState, useEffect } from 'react';

   function useVariantAssignment() {
     const [variant, setVariant] = useState<'A' | 'B'>('A');

     useEffect(() => {
       // Randomly assign a variant for demonstration purposes
       const assignedVariant = Math.random() > 0.5 ? 'A' : 'B';
       setVariant(assignedVariant);
     }, []);

     return variant;
   }
   ```

4. **Integrate Variant into Alert System**
   - Modify the alert system to read from the `alertVariant` state and adjust the alert presentation accordingly.

   ```typescript
   import { useAlertSystem } from '@/lib/hooks/useAlertSystem';

   function AlertOverlay() {
     const { alertActive, alertVariant } = useAlertSystem();

     return (
       <div className={`alert-overlay ${alertVariant === 'A' ? 'variant-a' : 'variant-b'}`}>
         {alertActive && (
           <div className="alert-content">
             <p>{alertVariant === 'A' ? 'Please put your phone down.' : 'Attention! Please put your phone down.'}</p>
             {/* Additional UI changes based on variant */}
           </div>
         )}
       </div>
     );
   }
   ```

5. **UI & Styling**
   - Use Tailwind CSS and shadcn/ui components to style the alert overlay.
   - Ensure the UI changes based on the variant, such as different colors or animations.

   ```css
   .alert-overlay {
     /* Common styles */
   }

   .variant-a {
     /* Styles specific to Variant A */
   }

   .variant-b {
     /* Styles specific to Variant B */
   }
   ```

6. **Logging and Analysis**
   - Log alert events with their associated variant for future analysis.
   - Ensure that the variant assignment and alert events are stored consistently for A/B testing metrics.

   ```typescript
   import { createSupabaseAdminClient } from '@/utils/supabase/server';

   async function logAlertEvent(sessionId: number, alertLevel: number, alertVariant: 'A' | 'B') {
     const supabaseAdmin = await createSupabaseAdminClient();
     const { data, error } = await supabaseAdmin.from('drivesafe_alert').insert({
       session_id: sessionId,
       alert_level: alertLevel,
       alert_variant: alertVariant,
     });

     if (error) {
       console.error('Error logging alert event:', error);
     }
   }
   ```

### Summary
By following these steps, you will implement a robust A/B testing and variant management system for alerts in the DriveSafe app. This setup allows for testing different alert styles and optimizing their effectiveness based on user feedback and data analysis.