interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarColors = [
  { bg: '#FFE5D9', text: '#C1502E' },  // Soft peach
  { bg: '#D4E7C5', text: '#4A7C59' },  // Soft green
  { bg: '#BFD7EA', text: '#2E5266' },  // Soft blue
  { bg: '#E8D5C4', text: '#8B5A3C' },  // Soft brown
  { bg: '#F0C1E1', text: '#8E4585' },  // Soft pink
  { bg: '#C9E4CA', text: '#3D7C47' },  // Mint
  { bg: '#FFF4E0', text: '#B8860B' },  // Soft yellow
  { bg: '#E0D4F7', text: '#6B46C1' },  // Soft purple
];

function getColorForName(name: string): { bg: string; text: string } {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'P';
  return trimmed[0].toUpperCase();
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const { bg, text } = getColorForName(name);
  const initial = getInitial(name);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold shrink-0 ${className}`}
      style={{ backgroundColor: bg, color: text }}
      aria-label={`Avatar for ${name}`}
    >
      {initial}
    </div>
  );
}
