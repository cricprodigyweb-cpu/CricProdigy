# CricProdigy Homepage Design

## Overview
The homepage has been completely redesigned to match the provided fitness/gym aesthetic with a dark theme and emerald green accents.

## Sections

### 1. Navigation Bar (Fixed)
- Dark background with blur effect
- Logo: "CricProdigy"
- Menu items: Home, Assessment, Pricing, FAQ, Library, About Us
- Sign up button (white, rounded)

### 2. Hero Section
**Image Placeholder: Hero Image**
- Location: Right side of hero section
- Size: aspect-[4/5] (portrait orientation)
- Description: Running athlete/cricketer image
- Features:
  - Left side: Large heading "Next. Generation. Cricket."
  - Subtext about the platform
  - "Meet Our Team" button with arrow down icon

### 3. AI/ML Metrics Section
**Image Placeholder: AI Metrics Image**
- Location: Left side
- Size: aspect-[4/5] (portrait orientation)
- Description: Athlete with overlaid metrics
- Required overlays:
  - Top left: "121 bpm" (heart rate)
  - Top right: "98.3 SpO2" (oxygen level)
  - Connection points (white dots on body)
  - "OUR VISION" button
  - "52 Fitness Suggestions" button (bottom left, emerald)
- Features:
  - Right side: Mission statement text
  - AI ML highlighted text
  - Two feature buttons

### 4. Core Values Section
**Image Placeholders: Value 1 & Value 2 Images**
- Location: Right side of each card
- Size: h-72 (fixed height), 400px width
- Description: Athletic/fitness related images
- Layout:
  - Two horizontal cards
  - Each with number (01, 02), title, description on left
  - Image on right
  - Arrow button on hover (top right)

### 5. Our Story Section
- Timeline display: 1989, 1999, 20X
- Progress line animation
- Content: "The New Dawn" story
- Navigation arrows (left/right)

### 6. Meet Our Team Section
**Image Placeholders: Team Member 1, 2, 3 Images**
- Location: Main area of each team card
- Size: aspect-[3/4] (portrait orientation)
- Description: Professional team member photos
- Team members:
  1. Azunyan U. Wu - CEO, Co-Founder
  2. Bocchi D. Rock - Chief Scientific Officer
  3. Jared M. Leto - Senior Product Designer
- Features:
  - Search bar (top right)
  - Social media icons on hover (Facebook, Instagram, LinkedIn)
  - Name and role overlay at bottom
  - "Load More Members" button

## Image Requirements

### To add images:
1. Replace the placeholder divs with Next.js Image components
2. Add images to `public/images/` directory
3. Update the code with proper image paths

### Example code for adding images:

```tsx
import Image from 'next/image';

// Replace placeholder div with:
<Image
  src="/images/hero-image.jpg"
  alt="Description"
  fill
  className="object-cover"
  priority
/>
```

## Color Scheme
- Background: Black (#000000)
- Accent: Emerald Green (#10b981, emerald-400/500)
- Text: White (#ffffff) and Gray (#9ca3af)
- Borders: Gray-800 (#1f2937)
- Hover: Emerald-500 with transparency

## Typography
- Headings: Bold, large sizes (text-5xl to text-9xl)
- Body: text-lg, text-gray-400
- Font: Default Next.js font stack

## Interactive Elements
- Hover effects on all cards (emerald border glow)
- Button hover states (color transitions)
- Social media icon reveal on team card hover
- Smooth transitions (duration-300)

## Notes
- All sections use container max-width with px-6 padding
- Rounded corners: rounded-2xl, rounded-3xl, rounded-full for buttons
- Backdrop blur effects on overlays
- Gradient overlays on images for text readability
