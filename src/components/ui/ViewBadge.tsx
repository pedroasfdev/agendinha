import { ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ViewBadge({ provider = false, step }: { provider?: boolean; step: string }) {
  return (
    <div className="view-badge-row">
      <span className={`client-badge ${provider ? 'provider-badge' : ''}`}>
        VISÃO {provider ? 'PRESTADOR' : 'CLIENTE'}
      </span>
      <span className="view-badge-step">
        {step}
        {provider && (
          <Link
            to="/explorar"
            className="provider-mobile-exit"
            aria-label="Ir para visão cliente"
            title="Visão cliente"
          >
            <ArrowLeftRight size={15} />
          </Link>
        )}
      </span>
    </div>
  );
}
