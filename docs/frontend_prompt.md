I will be providing you the backend code using Express.js. You have the following goals, do them step by step:
1. Focus on the routes.ts in all APIs. Because this is the way we communicate with the frontend, you need to understand every single functionality that we can support. It is important for you to deeply understand the routes of the backend because this is our connection to the frontend. A special thing about this backend is that it has WebSocket options, so this is a point that also needs to be focused on. 
   1.1 You would also need to reason and criticize backend APIs. Some APIs are missing, making some functionalities in frontend development broken. We would not want that to happen.
   1.2 We have 2 main roles: Admin and User. For now, ignore the Creator role. We already implement RBAC on backend. Think of how we would do that in frontend.
2. We will be using Ant Design with React + Vite for development. We will be coding in .ts and .tsx files of React.js framework. Focus on maxing out the modernist and beautiful aspects of Ant Design.
3. Try to find me pre-built, pre-designed templates for Ant Design, especially focusing on beautiful templates for charts, because we want the charts to be absolutely insane and beautiful.
4. Return me the final list of screens, try to minimize the number of screens and recycle the templates. For every single screen, imagine you are a modern webpage designer. Learn from modern frontend templates and design considerations, design me every single screen by text carefully and absolutely thoroughly. Think of yourself as Figma designer, Tailwind CSS designer, Ant Design goddess, every single React component should be tailored and creating a comprehensive design. Make everything feel balanced and every component, from a button, Grid, anything in an order. Focus on minimalist design with light theme, so select nice colors, rounded elements.

# Danh sach man hinh
Modern Learning Platform UI Design System with Ant Design
Design System Foundation

Core Principles: Minimalist modernism, intuitive interactions, balanced whitespace, subtle animations, responsive-first approach.

Design System:

    Primary Color: #6366f1 (indigo-500) - vibrant yet professional

    Secondary Colors:

        Success: #10b981 (emerald-500)

        Warning: #f59e0b (amber-500)

        Error: #ef4444 (red-500)

    Neutral Palette:

        Background: #f8fafc (slate-50)

        Cards: #ffffff

        Borders: #e2e8f0 (slate-200)

        Text: #1e293b (slate-800) for headings, #475569 (slate-600) for body

    Typography:

        Primary: Inter (modern, highly readable)

        Code: Fira Code (for coding exercises)

    Spacing System: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

    Border Radius:

        Small elements: 4px

        Cards/containers: 12px

        Buttons: 8px

    Shadows: Subtle layered shadows for depth:

        Card shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

        Floating elements: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

Essential Ant Design Templates & Libraries

    Ant Design Pro - Official enterprise template with modern dashboard layouts

    Ant Design Charts - Beautiful, animated chart components with smooth transitions

    Apache ECharts integration - For complex, interactive data visualizations

    React Flow - For visual roadmap builders and learning path diagrams

    Framer Motion - For subtle, professional animations and transitions

    Tailwind CSS - For utility-first styling alongside Ant Design components

    Ant Design Icons - Comprehensive icon set matching the design system

Screen Inventory (Minimal & Reusable)
1. Authentication Screens (Shared Template)

Responsive Layout: 100vh min-height, centered card on desktop, full-width on mobile

    Grid System: 2-column layout on desktop (50% auth card, 50% brand visual), 1-column on mobile

    Components:

        Floating card with subtle shadow and rounded corners (12px)

        Gradient header with abstract learning wave animation

        Form fields with smooth focus states and floating labels

        Social login buttons with brand-consistent colors

        Animated background particles on larger screens

    Visual Details:

        Input fields: 4px border radius, subtle glow on focus (box-shadow: 0 0 0 2px #6366f133)

        Submit button: Full width on mobile, auto-width on desktop with hover scale effect

        Error states: Red border with helpful animated messages

        Loading states: Skeleton screens with gradient animations

2. Dashboard/Overview Screen (Role-Based Template)

Layout Structure: 3-column grid on desktop (sidebar, main content, right panel), stacked on mobile

    Responsive Behavior:

        Desktop: 280px sidebar, 60% main content, 20% right panel

        Tablet: Collapsible sidebar, 70% main content, 30% right panel

        Mobile: Hidden sidebar (drawer menu), full-width main content

    Key Components:

        Header: Sticky navigation with user avatar, notifications, search

        Main Content Grid:

            Stat cards (4-column responsive grid: 4 on desktop, 2 on tablet, 1 on mobile)

            Progress visualization section

            Recent activity feed

        Right Panel:

            Upcoming events calendar widget

            Quick actions toolbar

            AI assistant chat bubble

Modern Design Elements:

    Gradient progress bars with animated fill

    Stat cards with icon backgrounds and subtle hover lift

    Card headers with gradient borders and soft shadows

    Data visualizations using smooth animated charts

    Activity feed with timeline indicators and avatar placeholders

3. Roadmaps Screen (List View - Reusable Template)

Layout: Card-based grid with filtering sidebar

    Responsive Grid:

        Desktop: 4 cards per row

        Tablet: 3 cards per row

        Mobile: 1 card per row with horizontal scrolling categories

    Card Design:

        Rounded corners (12px)

        Smooth hover effects (scale 1.02, shadow lift)

        Gradient category badges

        Progress ring indicator (using Ant Design Charts)

        Subtle animation on load (fade-in with slight upward movement)

    Filtering Sidebar:

        Collapsible on mobile

        Animated filter application

        Selected filters displayed as removable tags above grid

    Empty State: Beautiful illustration with gentle animation and helpful call-to-action

4. Roadmap Detail Screen (Learning Path Template)

Two-Column Layout: Content panel (70%) + progress/notes panel (30%)

    Content Panel:

        Hero section with roadmap title, description, estimated time

        Module accordion with smooth expand/collapse animations

        Module cards with:

            Completion status indicators (animated checkmarks when complete)

            Estimated time badges

            Hover previews of module content

            Progress bars with subtle gradient fills

    Progress Panel:

        Circular progress chart (Ant Design Charts) showing overall completion

        AI-generated learning notes section with expandable cards

        Quick action buttons (start learning, download resources)

    Responsive Behavior:

        Desktop: Fixed two-column layout

        Tablet: Stacked columns with progress panel collapsible

        Mobile: Single column with progress as sticky bottom bar

5. Module Learning Screen (Content Focus Template)

Immersive Layout: Full-width content with contextual sidebar

    Content Area:

        Clean typographic hierarchy with generous line spacing

        Interactive code editors with syntax highlighting

        Embedded video players with custom controls

        Expandable sections for additional resources

        Smooth scrolling navigation between sections

    Sidebar Components:

        Table of contents with active section highlighting

        Completion checklist with animated checkmarks

        AI chat assistant toggle button

        Quick save/progress buttons

    Exercise Integration:

        Embedded exercise cards with difficulty indicators

        Submission areas with file upload drag-and-drop zones

        Real-time validation feedback

    Design Details:

        Content container with soft border and subtle background

        Section dividers with gradient accents

        Code blocks with custom theme matching brand colors

        Interactive elements with micro-interactions (button hover, input focus states)

6. Progress Analytics Screen (Data Visualization Focus)

Dashboard-Style Layout: Grid of chart cards with detailed breakdowns

    Chart Types & Design:

        Radial Progress Charts: Animated circular displays with gradient fills

        Time Series Line Charts: Smooth curves with gradient area fills

        Skill Radar Charts: Multi-axis radar charts showing competency levels

        Heat Maps: Weekly activity patterns with color intensity gradients

        Bar Charts: Comparative skill assessments with animated loading

    Interactive Elements:

        Time range selectors with smooth transitions

        Chart type toggles (radar vs. bar vs. line)

        Data point hover effects with detailed tooltips

        Zoom and pan capabilities on larger charts

    Responsive Behavior:

        Chart container resizing with fluid animations

        Chart complexity reduction on smaller screens

        Priority data preservation on mobile views

    Visual Polish:

        Chart animations on load (smooth data transitions)

        Gradient color schemes matching brand palette

        Subtle grid lines and axis labels

        Animated data updates without page reloads

7. Calendar/Events Screen (Interactive Template)

Hybrid Layout: Calendar view with event sidebar

    Calendar Component:

        Custom-styled Ant Design Calendar with brand colors

        Event indicators with color coding by type (learning, interview, deadline)

        Smooth month/week/day transitions

        Drag-and-drop event rescheduling

        AI-suggested event slots with subtle visual treatment

    Event Sidebar:

        Collapsible panel showing event details

        Rich text editor for event descriptions

        Reminder settings with dropdown selectors

        Integration with roadmap modules (drag module to calendar)

    Responsive Design:

        Desktop: Split view (60% calendar, 40% sidebar)

        Tablet: Tabbed interface (calendar tab, events tab)

        Mobile: Full-screen calendar with bottom sheet event details

    Modern UI Elements:

        Event cards with gradient borders and soft shadows

        Time slot highlighting with subtle animations

        Empty state illustrations for new users

        Loading skeletons for calendar data

8. CV/Resume Management Screen (Document Focus Template)

Document-Centric Layout: Preview panel with editing sidebar

    Preview Panel:

        PDF-like document view with realistic page shadows

        Multiple template previews (modern, classic, minimal)

        Zoom controls and page navigation

        Download button with animation

    Editing Sidebar:

        Section-based editing (personal info, education, experience, skills)

        AI optimization toggle for each section

        Live preview of changes

        Drag-and-drop reordering of sections

    Interactive Components:

        Rich text editors with AI suggestions

        Skill tag inputs with auto-suggestions

        Date pickers for employment history

        File upload zones for supporting documents

    Responsive Behavior:

        Desktop: Side-by-side layout

        Tablet: Stacked layout with preview first

        Mobile: Tabbed interface (edit tab, preview tab)

    Visual Design:

        Document preview with subtle 3D effect

        Template thumbnails with hover previews

        AI optimization indicators with pulse animations

        Section headers with gradient accents

9. Interview Practice Screen (Real-Time Interaction Template)

Split-Screen Layout: Interview interface with feedback panel

    Interview Panel:

        Video/audio recording controls with waveform visualization

        Question display area with smooth transitions between questions

        Timer with animated progress ring

        Answer submission area with voice-to-text capability

    Feedback Panel:

        Score visualization with radial charts

        Key insights highlighted with icons

        Detailed feedback with expandable sections

        Improvement suggestions with actionable items

    WebSocket Integration:

        Real-time transcription display

        Live feedback indicators

        Connection status with recovery mechanisms

    Responsive Design:

        Desktop: 60/40 split layout

        Tablet: Tabbed interface with manual switching

        Mobile: Full-screen interview with collapsible feedback

    Modern UI Elements:

        Audio waveform visualizations with gradient colors

        Score animations on feedback reveal

        Question transitions with fade effects

        Micro-interactions on button presses

10. Admin Management Screen (Data-Heavy Template)

Tabbed Interface: Multiple data tables with management controls

    Tab Structure:

        Users management

        Roadmaps management

        Content management

        Analytics dashboard

        System settings

    Data Table Design:

        Custom-styled Ant Design tables with brand colors

        Row striping with subtle background variations

        Action buttons with icon-only display on mobile

        Bulk action selection with visual counters

    Management Controls:

        Floating action buttons for creating new items

        Advanced filtering with modal dialogs

        Status indicators with color coding

        Activity logs with timestamp formatting

    Responsive Behavior:

        Desktop: Full table view with all columns

        Tablet: Priority columns visible, others in expandable rows

        Mobile: Card-based view replacing tables

    Visual Polish:

        Loading states with skeleton tables

        Empty state illustrations for each tab

        Success/error notifications with slide-in animations

        Permission-based UI elements with graceful degradation

Routing Strategy with Backend Integration

Route Structure:
code Code

    
/ (redirect to login or dashboard based on auth)
/auth
  ├── /login
  ├── /register
  └── /forgot-password
/dashboard
/roadmaps
  ├── /:id (roadmap detail)
  └── /:id/modules/:moduleId (module learning)
/profile
  ├── /progress
  ├── /calendar
  ├── /certificates  
  └── /cv
/interviews
  ├── /practice
  └── /history
/admin (role-based routing)
  ├── /users
  ├── /roadmaps
  ├── /content
  └── /analytics

  

Authentication Flow:

    Protected routes use higher-order components checking JWT validity

    Role-based route guards redirect unauthorized users

    Token refresh mechanism with silent re-authentication

    Session timeout warnings with countdown timers

Data Loading Patterns:

    Skeleton screens during API calls

    Error boundaries with retry mechanisms

    Optimistic UI updates for form submissions

    WebSockets for real-time features (interviews, notifications)

Performance Optimization:

    Code splitting by route

    Lazy loading of heavy components (charts, editors)

    Caching strategies for frequently accessed data

    Debounced search inputs and form submissions

Responsive Design Principles

Breakpoint Strategy:

    Mobile: 0-768px (single column layouts, bottom navigation)

    Tablet: 768-1024px (split layouts, collapsible sidebars)

    Desktop: 1024px+ (multi-column layouts, advanced features visible)

Flexbox/Grid Implementation:

    Ant Design Grid system enhanced with custom responsive classes

    Flexbox for complex layout arrangements

    CSS Grid for dashboard layouts and card arrangements

    Container queries for component-level responsiveness

Touch vs. Mouse Interactions:

    Larger tap targets on mobile (minimum 48px)

    Hover states replaced with tap/click states on touch devices

    Gestures for common actions (swipe to archive, pinch to zoom)

    Context menus adapted for touch interfaces

Animation Guidelines

Purposeful Animations:

    Page transitions: Slide animations for hierarchical navigation

    Element entrances: Fade-in with slight upward movement

    State changes: Smooth color transitions and size changes

    Loading indicators: Skeleton screens with gradient animations

    Success states: Checkmark animations with confetti micro-effects

Performance Considerations:

    Hardware-accelerated animations (transform, opacity)

    Animation duration limits (300-500ms for most interactions)

    Reduced motion preferences respected

    Animation pausing during heavy computations

Accessibility Standards

WCAG 2.1 AA Compliance:

    Color contrast ratios minimum 4.5:1 for text

    Keyboard navigation support for all interactive elements

    ARIA labels for icons and complex components

    Semantic HTML structure with proper heading hierarchy

    Screen reader testing for critical workflows

    Reduced motion options for animation-sensitive users