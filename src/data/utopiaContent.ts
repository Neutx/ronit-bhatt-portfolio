export interface UtopiaItem {
  id: number;
  title: string;
  type: 'video' | 'film' | 'zine' | 'live';
  thumbnail: string;
  videoUrl?: string;
  backgroundVideoUrl?: string;
  link?: string;
  youtubeUrl?: string;
}

export const utopiaContent: UtopiaItem[] = [
  {
    id: 10,
    title: 'Absence',
    type: 'video',
    thumbnail: '/images/exps_11.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_11.webm',
    youtubeUrl: 'https://youtu.be/TN-SIlKZbXc',
  },
  {
    id: 1,
    title: 'The Killer',
    type: 'video',
    thumbnail: '/images/exps.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps.webm',
    youtubeUrl: 'https://youtu.be/7S6KBbHRYVU',
  },
  {
    id: 8,
    title: 'The Chaos',
    type: 'video',
    thumbnail: '/images/exps_9.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_9.webm',
    youtubeUrl: 'https://youtu.be/XL0G6WWAC8Q',
  },
  
  {
    id: 9,
    title: 'Moments',
    type: 'video',
    thumbnail: '/images/exps_10.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_10.webm',
    youtubeUrl: 'https://youtu.be/sshu0w0s8Uc',
  },
  {
    id: 7,
    title: 'Sakhi',
    type: 'video',
    thumbnail: '/images/exps_8.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_8.webm',
    youtubeUrl: 'https://youtu.be/E-1LLp5PZ0A',
  },
  {
    id: 5,
    title: 'Coorg | The Unseen',
    type: 'video',
    thumbnail: '/images/exps_5.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_5.webm',
    youtubeUrl: 'https://youtu.be/EgXblGpVtNY',
  },
  {
    id: 2,
    title: 'Dariyaft',
    type: 'video',
    thumbnail: '/images/exps_2.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_2.webm',
    youtubeUrl: 'https://youtu.be/I9pgGhQzCCw',
  },
  {
    id: 6,
    title: 'Coorg | Chapter Two',
    type: 'video',
    thumbnail: '/images/exps_6.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_6.webm',
    youtubeUrl: 'https://youtu.be/BP6raHxN-NQ',
  },
  {
    id: 16,
    title: 'Raakshas',
    type: 'video',
    thumbnail: '/images/exps_17.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_21.webm',
    youtubeUrl: 'https://youtu.be/URLLl6DQOYk?si=cs_MrHEfHQxvkR3j',
  },
  {
    id: 15,
    title: 'Jungle Jamboree',
    type: 'video',
    thumbnail: '/images/exps_16.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_20.webm',
    youtubeUrl: 'https://youtu.be/a2NeuytNoTk?feature=shared',
  },
  
  {
    id: 11,
    title: 'Sad Couple & Sunrise',
    type: 'video',
    thumbnail: '/images/exps_12.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_12.webm',
    youtubeUrl: 'https://youtu.be/amOJlam6Nzw',
  },
  {
    id: 4,
    title: 'Persona Scene Recreate',
    type: 'video',
    thumbnail: '/images/exps_4.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_4.webm',
    youtubeUrl: 'https://youtu.be/i2ubTmlg_x0',
  },

  {
    id: 3,
    title: 'Happy Couple & Sunrise',
    type: 'video',
    thumbnail: '/images/exps_3.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_3.webm',
    youtubeUrl: 'https://youtu.be/Pb34thskI3A',
  },
  {
    id: 26,
    title: 'ZNMD RECREATE',
    type: 'video',
    thumbnail: '/images/exps.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_26.webm',
    youtubeUrl: 'https://youtu.be/DVMSDIJTQhM',
  },

  {
    id: 12,
    title: 'chai not chai',
    type: 'video',
    thumbnail: '/images/exps_13.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_13.webm',
    youtubeUrl: 'https://youtu.be/e4ChCCVTdLM',
  },
  {
    id: 19,
    title: 'An Informal Letter',
    type: 'video',
    thumbnail: '/images/exps_20.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_25.webm',
    youtubeUrl: 'https://youtu.be/-8HNk-Eh7H8',
  },
  {
    id: 13,
    title: 'Eminence of Film',
    type: 'video',
    thumbnail: '/images/exps_14.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_14.webm',
    youtubeUrl: 'https://www.youtube.com/watch?v=44bi11yHX4A',
  },
  {
    id: 14,
    title: 'Sabzi',
    type: 'video',
    thumbnail: '/images/exps_15.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_15.webm',
    youtubeUrl: 'https://www.youtube.com/watch?v=X2cfS_mfLQI&t=1s',
  },


  {
    id: 17,
    title: 'And then it came to me',
    type: 'video',
    thumbnail: '/images/exps_21.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_23.webm',
    youtubeUrl: 'https://youtu.be/Q0xMOQNHa7I',
  },
  {
    id: 18,
    title: 'World of ARRI lights',
    type: 'video',
    thumbnail: '/images/exps_19.webp',
    videoUrl: '/videos/4x4.mp4',
    backgroundVideoUrl: '/videos/exps_22.webm',
    youtubeUrl: 'https://youtu.be/S2ovJ08oOrA',
  },


];

