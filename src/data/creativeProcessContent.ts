export interface CreativeProcessSection {
  id: number;
  type: 'script' | 'emotion' | 'planning' | 'tools' | 'budget' | 'identity' | 'profile' | 'ai';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    highlightedText?: string;
    items?: string[];
    tools?: Array<{
      name: string;
      icon?: string;
      imagePath?: string;
    }>;
    roles?: Array<{
      title: string;
      description: string;
    }>;
    workflow?: {
      scripts?: string;
      visualPlanning?: string;
      cameras?: string;
      primary?: string;
      gear?: string;
      edit?: string;
      color?: string;
      sound?: string;
      delivery?: string;
      workflow?: string;
    };
  };
}

export const creativeProcessContent: CreativeProcessSection[] = [
  {
    id: 1,
    type: 'script',
    content: {
      title: "IF IT'S NOT IN THE SCRIPT IT'S NOT IN THE F***ING MOVIE",
      highlightedText: 'F***ING',
    },
  },
  {
    id: 2,
    type: 'emotion',
    content: {
      subtitle: '"EMOTION IS THE CORE OF EVERYTHING"',
      highlightedText: 'EMOTION',
      text: 'I develop the concept through visual references,\nstoryboards, themes, music cues, and moodboards\nbuilding a foundation for the script.',
    },
  },
  {
    id: 3,
    type: 'planning',
    content: {
      text: 'Once the script is locked, I plan every detail-locations, shot breakdowns, production timelines, and team roles. Post-shoot, I shift into editing, where the story is truly sculpted.\nFor me, editing is writing, and the final cut is where emotion and narrative meet.',
    },
  },
  {
    id: 4,
    type: 'tools',
    content: {
      title: 'TOOLS I USE',
      tools: [
        { name: 'Tool 1', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_04.59.55-removebg-preview.png' },
        { name: 'Tool 2', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.00.43-removebg-preview.png' },
        { name: 'Tool 3', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.01.15-removebg-preview.png' },
        { name: 'Tool 4', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.01.33-removebg-preview.png' },
        { name: 'Tool 5', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.01.55-removebg-preview.png' },
        { name: 'Tool 6', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.02.19-removebg-preview.png' },
        { name: 'Tool 7', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.03.44-removebg-preview (1).png' },
        { name: 'Tool 8', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.04.17-removebg-preview.png' },
        { name: 'Tool 9', imagePath: '/tools/WhatsApp_Image_2025-11-09_at_05.05.07-removebg-preview.png' },
      ],
    },
  },
  {
    id: 5,
    type: 'budget',
    content: {
      title: "There are 3 things in life you shouldn't do unless you have a high budget :",
      items: ['Cinema', 'TVC', 'Surgery'],
    },
  },
  {
    id: 6,
    type: 'identity',
    content: {
      title: "WHO'S RONIT BHATT?",
    },
  },
  {
    id: 7,
    type: 'profile',
    content: {
      roles: [
        {
          title: 'Writer',
          description: 'Crafting concepts and emotionally driven scripts',
        },
        {
          title: 'Director',
          description: 'Leading teams and translating vision to screen',
        },
        {
          title: 'Cinematographer',
          description: 'Framing stories through light, color, and movement',
        },
        {
          title: 'Editor',
          description: 'Pace, Rhythm and Emotion in the final cut',
        },
      ],
      workflow: {
        scripts: 'StudioBinder',
        visualPlanning: 'Adobe Illustrator, Procreate',
        cameras: 'ARRI, RED, Sony Venice',
        primary: 'Sony A7SIII',
        gear: '3-axis/4-axis gimbals, handheld rigs, video tripods',
        edit: 'Adobe Premiere Pro',
        color: 'DaVinci Resolve',
        sound: 'Protools and Adobe Audition',
        delivery: 'Final output via Premiere Pro + Media Encoder',
        workflow: 'Organized selects, audio sync, precise pacing, and sound design',
      },
    },
  },
  {
    id: 8,
    type: 'ai',
    content: {
      title: 'F*** GENERATIVE AI',
      subtitle: 'BECAUSE AI HAS ZERO HUMAN EMOTION',
      highlightedText: 'F***',
    },
  },
];

