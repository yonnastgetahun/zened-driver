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

# Overall Layout & Core UI Setup Implementation Guide

## Task
Implement the overall layout and core UI setup for the DriveSafe app.

## Implementation Guide

### 1. Set Up the DriveSafe Dashboard Layout

- **File Location**: `app/app/page.tsx`
- **Objective**: Create a cohesive and branded interface for the DriveSafe app.

#### Steps:

1. **Create the Main Dashboard Layout**:
   - Use a full-page layout that serves as the main dashboard for the DriveSafe app.
   - Ensure the layout is responsive and uses `shadcn/ui` components wrapped in `divs` with Tailwind CSS classes.

2. **Header Component**:
   - **File Location**: `components/app/Header.tsx`
   - **Objective**: Update the header to match the overall app style.
   - **Steps**:
     - Use Tailwind CSS classes like `bg-primary` and `text-primary-foreground` to style the header.
     - Display the app title “DriveSafe” and basic navigation (if applicable).

3. **Dashboard Panel**:
   - **File Location**: `components/app/DashboardPanel.tsx`
   - **Objective**: Display status indicators and control buttons.
   - **Steps**:
     - Create a central dashboard panel with status indicators for driving status and alert status.
     - Use `shadcn/ui` components for a professional look.

4. **Footer (Optional)**:
   - If needed, add a footer to the layout for additional navigation or information.

### 2. Initialize Global and Local State

- **Objective**: Set up the necessary state for the dashboard.

#### Steps:

1. **Global State**:
   - Ensure global state for authentication and user data is preloaded.

2. **Local State Placeholders**:
   - Add local state placeholders for:
     - `drivingStatus` (default: "idle")
     - `alertStatus` (default: "off")

### 3. Implement Responsive Design

- **Objective**: Ensure the dashboard is responsive across different devices.

#### Steps:

1. **Responsive Layout**:
   - Use Tailwind CSS classes to ensure the layout adapts to different screen sizes.
   - Test the layout on various devices to ensure a consistent user experience.

### 4. Add Debug Logging

- **Objective**: Implement detailed debug logs to track the UI setup process.

#### Steps:

1. **Logging Setup**:
   - Add console logs at key points in the layout setup to track the rendering process.
   - Example:
     ```javascript
     console.log("DriveSafe Dashboard initialized");
     console.log("Header component rendered with title: DriveSafe");
     ```

### Summary

By following this guide, you will create a cohesive and branded interface for the DriveSafe app. The layout will be responsive, using `shadcn/ui` components and Tailwind CSS for styling. The header will display the app title and basic navigation, while the dashboard panel will show status indicators. Local state placeholders will be set up for driving and alert statuses, and detailed debug logs will be implemented to track the UI setup process.