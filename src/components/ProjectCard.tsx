import { cn } from '@josui/core-web';
import { Link } from '@tanstack/react-router';
import { Pin } from 'lucide-react';

interface ProjectCardProps {
  to: string;
  type: 'client' | 'personal';
  pinned?: boolean;
  title: string;
  extract: string;
  thumbnail: {
    src: string;
    alt: string;
  };
  logo: {
    src: string;
    alt: string;
  };
}

export function ProjectCard({ to, type, pinned = false, title, extract, thumbnail, logo }: ProjectCardProps) {
  return (
    <Link to={to} className="group">
      <article className="flex flex-col items-center space-x-8 md:flex-row">
        <div className="relative w-56 shrink-0 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
          <div className="bg-foreground/20 group-hover:bg-foreground/40 absolute top-0 left-0 h-full w-full transition-colors duration-300"></div>
          <img
            src={logo.src}
            alt={logo.alt}
            className="absolute top-1/2 left-1/2 w-28 -translate-x-1/2 -translate-y-1/2"
          />
          <img src={thumbnail.src} alt={thumbnail.alt} className="h-full w-full object-cover" />
        </div>
        <div className="transition-transform duration-300 group-hover:translate-x-2">
          <h1 className="mb-2 flex items-center gap-x-3 text-2xl font-bold">{title}</h1>
          <p className="mb-2 group-hover:underline">{extract}</p>
          <span
            className={cn(
              'bg-secondary-200 text-secondary-900 inline-flex items-center gap-x-1 rounded px-2 py-1 text-sm',
              {
                'bg-secondary-200 text-secondary-900': type === 'client',
                'bg-primary-200 text-primary-900': type === 'personal',
              },
            )}
          >
            {pinned && <Pin className="size-3" />}
            {type === 'client' ? 'Client Work' : 'Personal Project'}
          </span>
        </div>
      </article>
    </Link>
  );
}
