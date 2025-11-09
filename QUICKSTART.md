# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

### Step 2: Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Step 3: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000) and you'll see the Utopia World clone!

---

## ⚠️ Important Notes

### Placeholder Content
The website references images and videos that don't exist yet. You'll see:
- Gradient backgrounds instead of images
- Broken image icons

**To fix this:**
1. Add your images to `public/images/` directory
2. Add your videos to `public/videos/` directory
3. Follow the naming conventions in the `.gitkeep` files

### File Naming (See public/images/.gitkeep and public/videos/.gitkeep)

**Images needed:**
- 4x4-thumbnail.jpg
- fein-thumbnail.jpg
- i-know-thumbnail.jpg
- topia-twins-thumbnail.jpg
- circus-maximus-thumbnail.jpg
- utopia-zine-thumbnail.jpg
- sirens-thumbnail.jpg
- delresto-thumbnail.jpg
- hyaena-thumbnail.jpg
- modern-jam-thumbnail.jpg
- gods-country-thumbnail.jpg
- k-pop-thumbnail.jpg
- pompeii-thumbnail.jpg

**Videos needed (optional):**
- 4x4.mp4
- fein.mp4
- i-know.mp4
- (etc., matching the image names)

---

## ✨ Features You Can Try

### Navigation
- Click on menu items in the top navigation
- On mobile, click the hamburger menu icon

### Carousel
- Click **Previous/Next** buttons to navigate slides
- Click the **dots** at the bottom to jump to a specific slide
- Use **arrow keys** on keyboard (← →)
- On mobile, **swipe left/right** to navigate
- Click **Explore** button to open video player (will show broken video until you add files)

### Email Signup
- Scroll to the email section
- Enter an email address
- Check the "I accept the terms" checkbox
- Click Submit

### Hero Section
- Scroll indicator animation
- Call-to-action buttons

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` or `tailwind.config.js`:

```typescript
colors: {
  'utopia-black': '#000000',  // Change to your color
  'utopia-gray': '#1a1a1a',
  // etc.
}
```

### Change Content
Edit `src/data/utopiaContent.ts`:

```typescript
export const utopiaContent: UtopiaItem[] = [
  {
    id: 1,
    title: 'Your Video Title',  // Change this
    type: 'video',
    thumbnail: '/images/your-image.jpg',  // And this
    videoUrl: '/videos/your-video.mp4',
  },
  // ... more items
];
```

### Change Animations
Edit `src/styles/animations.css` for custom animations

---

## 📦 Build for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

Or deploy to Vercel (recommended for Next.js):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Port 3000 already in use
```bash
# Kill the process on port 3000 (Windows)
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Styling issues
1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder
3. Run `npm run dev` again

### TypeScript errors
```bash
npm run build
```
This will show all TypeScript errors

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Documentation](https://react.dev)

---

## 🎯 What's Included

✅ **10 Components** ready to use
✅ **Responsive Design** for all devices
✅ **Dark Theme** styling
✅ **Smooth Animations** with Framer Motion
✅ **Touch Gestures** for mobile
✅ **Keyboard Navigation** support
✅ **Video Player** with custom controls
✅ **Email Form** with validation
✅ **Loading States** and error handling

---

## 💡 Tips

1. **Start with content**: Add images/videos first to see the full effect
2. **Mobile first**: Test on mobile devices or use browser dev tools
3. **Customize gradually**: Change one thing at a time
4. **Check console**: Open browser dev tools for any errors
5. **Use hot reload**: Changes appear automatically without refreshing

---

## 🎉 You're Ready!

Your Utopia World clone is set up and ready to customize. Enjoy building!

For detailed documentation, see:
- `SETUP.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Complete feature list
- `README.md` - Project overview


