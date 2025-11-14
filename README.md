
## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Custom CSS Animations
- **Animations**: Framer Motion
- **Icons**: React Icons

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Interactive carousel with smooth transitions
- Responsive navigation with mobile hamburger menu
- Email signup form with validation
- Video player with custom controls
- Dark theme design
- Fully responsive across all devices
- Keyboard navigation support
- Touch gestures for mobile

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── EmailSignup.tsx
│   │   ├── Carousel.tsx
│   │   ├── CarouselItem.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── BackShop.tsx
│   ├── data/
│   │   └── utopiaContent.ts
│   ├── hooks/
│   │   └── useCarousel.ts
│   └── styles/
│       └── animations.css
├── public/
│   ├── videos/
│   └── images/
└── package.json
```

## Customization

To customize the content, edit the `src/data/utopiaContent.ts` file and replace placeholder images/videos in the `public` folder.



