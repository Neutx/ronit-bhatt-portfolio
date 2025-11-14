# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Add Placeholder Content**
   - Add thumbnail images to `public/images/` directory
   - Add video files to `public/videos/` directory
   - See `.gitkeep` files in each directory for naming conventions

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── loading.tsx      # Loading state
│   │   ├── error.tsx        # Error boundary
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Navigation.tsx
│   │   ├── EmailSignup.tsx
│   │   ├── Carousel.tsx
│   │   ├── CarouselItem.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── BackShop.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── LazyImage.tsx
│   ├── data/               # Data files
│   │   └── utopiaContent.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useCarousel.ts
│   └── styles/             # Additional styles
│       └── animations.css
├── public/                 # Static assets
│   ├── images/            # Image files
│   └── videos/            # Video files
└── package.json

## Features Implemented

✅ **Navigation**
- Sticky navigation bar
- Mobile-responsive hamburger menu
- Smooth scroll behavior

✅ **Carousel**
- Interactive carousel with 13 items
- Previous/Next navigation buttons
- Slide indicators
- Keyboard navigation (arrow keys)
- Touch gestures for mobile
- Smooth transitions with Framer Motion

✅ **Video Player**
- Custom video controls
- Play/pause functionality
- Volume control
- Progress bar with seeking
- Fullscreen support
- Responsive design

✅ **Email Signup**
- Form validation
- Error handling
- Success feedback

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints for all screen sizes
- Touch-friendly interface

✅ **Performance Optimization**
- Lazy loading for images
- Code splitting
- Optimized animations
- Loading states

## Customization

### Update Content
Edit `src/data/utopiaContent.ts` to modify carousel items.

### Update Colors
Edit `tailwind.config.ts` or `tailwind.config.js` to change the color scheme.

### Update Animations
Edit `src/styles/animations.css` for custom animations.

## Build for Production

```bash
npm run build
npm start
```

## Common Issues

1. **Missing Images/Videos**: Make sure placeholder files are in the correct directories
2. **Styling Issues**: Run `npm run dev` in a clean terminal
3. **TypeScript Errors**: Run `npm install` to ensure all dependencies are installed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Next Steps

1. Replace placeholder content with actual images and videos
2. Add actual video files or use video URLs
3. Implement backend for email signup
4. Add analytics tracking
5. Deploy to production (Vercel, Netlify, etc.)



