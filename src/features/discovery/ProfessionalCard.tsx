import { ArrowUpRight, Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Professional } from '../../data/catalog';
import { currency } from '../../lib/format';
import { useDemo } from '../../app/DemoContext';

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { favorites, toggleFavorite } = useDemo();
  const favorite = favorites.includes(professional.id);
  return (
    <article className="professional-card">
      <Link
        to={`/servico/${professional.id}`}
        className="card-image-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img src={professional.image} alt="" className="card-image" loading="lazy" />
        {professional.availableToday && (
          <span className="availability">
            <span />
            Horários hoje
          </span>
        )}
      </Link>
      <div className="card-body">
        <div className="card-heading">
          <Link to={`/servico/${professional.id}`}>
            <h3>{professional.title}</h3>
          </Link>
          <ArrowUpRight size={17} className="card-arrow" />
        </div>
        <p className="card-professional">
          {professional.name} <span>·</span> {professional.studio}
        </p>
        <div className="card-rating">
          <Star size={13} />
          <strong>{professional.rating.toFixed(1).replace('.', ',')}</strong>
          <span>({professional.reviews} avaliações)</span>
        </div>
        <div className="card-bottom">
          <div>
            <p className="card-distance">
              <MapPin size={12} />
              {professional.distance.toFixed(1).replace('.', ',')} km <span>·</span>{' '}
              {professional.neighborhood}
            </p>
            <p className="card-price">
              a partir de <strong>{currency(professional.services[0].price)}</strong>
            </p>
          </div>
          <button
            type="button"
            className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
            onClick={() => toggleFavorite(professional.id)}
            aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${professional.studio} ${favorite ? 'dos' : 'aos'} favoritos`}
            aria-pressed={favorite}
          >
            <Heart size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
