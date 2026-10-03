import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCatalog } from '../../app/StudioContext';
import { useDemo } from '../../app/DemoContext';
import { currency } from '../../lib/format';
import { Button } from '../../components/ui/Button';
import { bookingUrl } from '../booking/BookingShared';

export function ServicePage() {
  const professionals = useCatalog();
  const { id } = useParams();
  const professional = professionals.find((item) => item.id === id);
  const { favorites, toggleFavorite } = useDemo();
  const [selectedId, setSelectedId] = useState('');
  const navigate = useNavigate();
  if (!professional || !professional.services.length)
    return (
      <div className="empty-state">
        <MapPin size={32} />
        <h1>Não encontramos esse profissional</h1>
        <p>Que tal descobrir um novo cuidado pertinho de você?</p>
        <Link className="button button-primary" to="/explorar">
          Explorar profissionais
        </Link>
      </div>
    );
  const selected =
    professional.services.find((service) => service.id === selectedId) ?? professional.services[0];
  const favorite = favorites.includes(professional.id);
  return (
    <div className="service-page">
      <div className="service-title-row">
        <div>
          <Link to="/explorar" className="icon-button" aria-label="Voltar para explorar">
            <ArrowLeft size={21} />
          </Link>
          <div>
            <p className="eyebrow">UM BOM ENCONTRO</p>
            <h1>{professional.studio}</h1>
          </div>
        </div>
        <button
          type="button"
          className={`icon-button service-favorite ${favorite ? 'is-favorite' : ''}`}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(professional.id)}
        >
          <Heart size={20} />
        </button>
      </div>
      <div className="service-columns">
        <div className="service-main-column">
          <div className="service-cover">
            <img
              src={professional.cover}
              alt={`Ambiente de atendimento de ${professional.studio}`}
            />
            <span>
              <BadgeCheck size={14} />
              Um espaço de confiança
            </span>
          </div>
          <section className="professional-info">
            <div className="professional-info-top">
              <img src={professional.avatar} alt={professional.name} />
              <div>
                <h2>
                  {professional.name}
                  <BadgeCheck size={15} />
                </h2>
                <p>
                  {professional.specialty} · {professional.experience}
                </p>
              </div>
              <span className="service-rating">
                <Star size={16} />
                <strong>{professional.rating.toFixed(1).replace('.', ',')}</strong>
              </span>
            </div>
            <div className="professional-badges">
              <span>
                <MapPin size={13} />
                {professional.distance.toFixed(1).replace('.', ',')} km
              </span>
              <span>
                <MessageCircle size={13} />
                {professional.reviews} avaliações
              </span>
              <span className="verified-badge">
                <ShieldCheck size={13} />
                {professional.category === 'barbearia' ? 'Verificado' : 'Verificada'}
              </span>
            </div>
            <p className="professional-description">{professional.description}</p>
          </section>
          <section className="service-about">
            <h2>Um lugar para se sentir bem</h2>
            <div>
              <span className="heading-icon">
                <MapPin size={20} />
              </span>
              <div>
                <h3>{professional.neighborhood}, São Paulo</h3>
                <p>{professional.address}</p>
              </div>
            </div>
            <div>
              <span className="heading-icon">
                <Clock3 size={20} />
              </span>
              <div>
                <h3>Cuidado no seu tempo</h3>
                <p>Segunda a sábado, das 9h às 18h</p>
              </div>
            </div>
          </section>
          <section className="review-highlight">
            <div className="review-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <blockquote>
              “Atendimento impecável, ambiente acolhedor e muito cuidado em cada detalhe. Já quero
              voltar!”
            </blockquote>
            <span>
              <span className="avatar avatar-tiny">BC</span>
              <span>
                Beatriz C. <small>· Avaliação demonstrativa</small>
              </span>
              <CheckCircle2 size={14} />
            </span>
          </section>
        </div>
        <aside className="service-booking-column">
          <div className="service-selection">
            <p className="eyebrow">ESSE MOMENTO É SEU</p>
            <h2>Escolha seu serviço</h2>
            <p className="service-selection-description">
              Um cuidado na medida do que você precisa.
            </p>
            <div className="service-list" role="radiogroup" aria-label="Serviço desejado">
              {professional.services.map((service) => (
                <label
                  className={`service-option ${selected.id === service.id ? 'selected' : ''}`}
                  key={service.id}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={selected.id === service.id}
                    onChange={() => setSelectedId(service.id)}
                  />
                  <span className="service-radio">
                    {selected.id === service.id && <Check size={13} />}
                  </span>
                  <span className="service-option-info">
                    <strong>{service.name}</strong>
                    <small>{service.description}</small>
                  </span>
                  <span className="service-option-price">
                    <strong>{currency(service.price)}</strong>
                    <small>{service.duration}</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="service-footer">
              <div>
                <span>Total</span>
                <strong>{currency(selected.price)}</strong>
              </div>
              <Button onClick={() => navigate(bookingUrl(professional.id, 'horario', selected.id))}>
                Escolher horário <ArrowRight size={17} />
              </Button>
            </div>
            <p className="service-reassurance">
              <ShieldCheck size={14} />
              Escolha seu horário com tranquilidade.
            </p>
          </div>
          <div className="care-note">
            <span>✳</span>
            <h3>
              Não é só um serviço.
              <br />É um tempo para você.
            </h3>
            <p>Cada detalhe pensado para o seu bem-estar, do primeiro clique ao último cuidado.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
