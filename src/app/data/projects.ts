export type ProjectMedia =
  | {
      kind: 'image';
      src: string;
      alt: string;
      /** How a screenshot sits in the channel. `contain` shows the whole image. */
      fit?: 'cover' | 'contain';
    }
  | { kind: 'video'; src: string; poster: string; alt: string };

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  media: ProjectMedia;
  /** A wordmark shown wherever the title would be. Its alt text is the title. */
  logo?: { src: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: 'climatefirstbank',
    title: 'Climate First Bank Account Opening',
    description:
      'A streamlined account opening flow for Climate First Bank that interacts with our own banking service provider. I am a current intern with OneEthos, the FinTech wing of Climate First Bank.',
    tags: ['React', 'TypeScript', 'Fintech', 'UI/UX'],
    media: {
      kind: 'video',
      src: '/climate-first-bank.mp4',
      poster: '/climate-first-bank-poster.webp',
      alt: 'Climate First Bank account opening walkthrough',
    },
  },
  {
    id: 'pallit',
    title: 'Pallit',
    description:
      'A collaborative palette creation and sharing platform for designers and artists. This project would assist with frontend development skills.',
    tags: ['React', 'Node.js', 'TypeScript'],
    href: 'https://github.com/elizabethprettosotelo/pallit',
    media: {
      kind: 'image',
      src: '/pallit-full.jpg',
      alt: 'The Pallit editor, showing a generated colour and font scheme',
      fit: 'contain',
    },
    logo: { src: '/pallitlogo.svg', width: 198, height: 67 },
  },
  {
    id: 'lastmeal',
    title: 'Last Meal Protocol',
    description:
      'A tamagotchi-style calorie counter with social integration and friend features. Track your meals, maintain your virtual pet, and connect with friends.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'shadcn'],
    href: 'https://github.com/powdermilkjuno/habit-tracker/',
    media: {
      kind: 'image',
      src: '/lastmeal-full.png',
      alt: 'The Last Meal Protocol dashboard, showing a virtual pet beside a calorie tracker',
      fit: 'contain',
    },
  },
  {
    id: 'portfolio',
    title: 'Portfolio Site',
    description:
      "This very website! Built with Next.js and inspired by the Wii's design language and the nostalgic technology of the 2000s era.",
    tags: ['Next.js', 'Tailwind', 'CSS 3D'],
    href: 'https://github.com/powdermilkjuno/portfolio',
    media: { kind: 'image', src: '/owltuah.webp', alt: 'Portfolio logo' },
  },
  {
    id: 'codeconnections',
    title: 'Code Connections',
    description:
      'A social media app for Florida programmers to form teams and ask questions about hackathons. Connect with local developers and build projects together.',
    tags: ['React', 'Python', 'Firebase'],
    href: 'https://github.com/HareshP31/Code_Connections',
    media: { kind: 'image', src: '/codeconnections.svg', alt: 'Code Connections logo' },
  },
];
