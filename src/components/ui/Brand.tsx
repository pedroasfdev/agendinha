import { CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand ${compact ? 'brand-compact' : ''}`}
      aria-label="Pertinho, página inicial"
    >
      <span className="brand-symbol">
        <CalendarHeart size={25} strokeWidth={1.5} />
      </span>
      {!compact && (
        <span>
          pertinho<span className="brand-dot">.</span>
        </span>
      )}
    </Link>
  );
}
