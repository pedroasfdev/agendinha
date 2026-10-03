import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Flower2,
  LocateFixed,
  MapPin,
  Navigation,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  WandSparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../app/StudioContext';
import type { CategoryId } from '../../data/catalog';
import { useDemo } from '../../app/DemoContext';
import { ProfessionalCard } from './ProfessionalCard';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { currency } from '../../lib/format';

const categories = [
  { id: 'unhas', label: 'Unhas', icon: Sparkles },
  { id: 'cabelo', label: 'Cabelo', icon: Scissors },
  { id: 'barbearia', label: 'Barbearia', icon: Scissors },
  { id: 'bem-estar', label: 'Bem-estar', icon: Flower2 },
  { id: 'estetica', label: 'Estética', icon: WandSparkles },
] as const;

export function ExplorePage({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const professionals = useCatalog();
  const { user, favorites } = useDemo();
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [query, setQuery] = useState('');
  const [highRated, setHighRated] = useState(false);
  const [today, setToday] = useState(false);
  const [nearby, setNearby] = useState(true);
  const [sort, setSort] = useState('recommended');
  const [dialog, setDialog] = useState<'filters' | 'location' | 'map' | null>(null);
  const [neighborhood, setNeighborhood] = useState('Pinheiros');
  const normalized = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const filtered = useMemo(() => {
    const items = professionals.filter(
      (pro) =>
        pro.services.length > 0 &&
        (!category || pro.category === category) &&
        (!favoritesOnly || favorites.includes(pro.id)) &&
        (!highRated || pro.rating >= 4.9) &&
        (!today || pro.availableToday) &&
        (!nearby || pro.distance <= 3) &&
        normalized(
          `${pro.title} ${pro.name} ${pro.studio} ${pro.neighborhood} ${pro.specialty}`,
        ).includes(normalized(query)),
    );
    if (sort === 'distance') items.sort((a, b) => a.distance - b.distance);
    if (sort === 'price') items.sort((a, b) => a.services[0].price - b.services[0].price);
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [professionals, category, favoritesOnly, favorites, highRated, today, nearby, query, sort]);
  const clearFilters = () => {
    setCategory(null);
    setQuery('');
    setHighRated(false);
    setToday(false);
    setNearby(true);
    setSort('recommended');
  };

  return (
    <div className="explore-page">
      {!favoritesOnly ? (
        <section className="explore-hero">
          <div className="hero-copy">
            <p className="hero-greeting">
              Olá, {user.name.split(' ')[0]} <span>☀</span>
            </p>
            <h1>
              <span className="mobile-hero-title">O que vamos cuidar hoje?</span>
              <span className="desktop-hero-title">
                Um momento só seu.
                <br />
                <span>Bem pertinho.</span>
              </span>
            </h1>
            <p className="hero-description">
              Bons profissionais, cuidado de verdade.
              <br />
              Encontre o seu próximo momento de bem-estar.
            </p>
            <div className="hero-trust">
              <span className="trust-avatars">
                <img src="/images/marina.jpg" alt="" />
                <img src="/images/barber.jpg" alt="" />
                <img src="/images/hair.jpg" alt="" />
              </span>
              <span>
                <strong>Cuide de você com confiança</strong>
                <span>Profissionais verificados na sua região</span>
              </span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/images/salon.jpg"
              alt="Salão acolhedor com cadeiras de atendimento e plantas"
            />
            <div className="hero-image-overlay" />
            <span className="hero-image-caption">SEU NOVO LUGAR FAVORITO</span>
            <div className="hero-floating-card">
              <span>
                <CalendarDays size={22} strokeWidth={1.5} />
              </span>
              <div>
                <strong>Um cuidado que cabe no seu dia</strong>
                <p>Escolha, agende e aproveite.</p>
              </div>
              <BadgeCheck size={19} />
            </div>
          </div>
          <button
            className="mobile-location"
            type="button"
            aria-label="Alterar localização"
            onClick={() => setDialog('location')}
          >
            <MapPin size={19} />
          </button>
        </section>
      ) : (
        <div className="page-heading">
          <div>
            <p className="eyebrow">PARA VOLTAR SEMPRE</p>
            <h1>
              Meus favoritos<span className="coral-dot">.</span>
            </h1>
            <p className="muted heading-description">
              Os profissionais que conquistaram seu coração.
            </p>
          </div>
          <span className="heading-icon">
            <HeartIcon />
          </span>
        </div>
      )}

      <section className="discovery-controls" aria-label="Buscar e filtrar serviços">
        <div className="search-row">
          <div className="search-box">
            <Search size={20} strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Buscar serviço ou profissional"
              aria-label="Buscar serviço ou profissional"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" aria-label="Abrir filtros" onClick={() => setDialog('filters')}>
              <SlidersHorizontal size={19} strokeWidth={1.5} />
            </button>
          </div>
          <button className="location-select" type="button" onClick={() => setDialog('location')}>
            <MapPin size={17} />
            <span>{neighborhood}, São Paulo</span>
            <ChevronDown size={15} />
          </button>
        </div>
        <div className="category-row">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`category-button ${category === id ? 'active' : ''}`}
              onClick={() => setCategory(category === id ? null : id)}
              aria-pressed={category === id}
            >
              <span className="category-icon">
                <Icon size={23} strokeWidth={1.4} />
              </span>
              <span>{label}</span>
            </button>
          ))}
          <div className="category-note">
            <span className="tiny-sparkle">✳</span>
            <p>
              Seu cuidado começa
              <br />
              com uma escolha.
            </p>
          </div>
        </div>
        <div className="filters-row">
          <div className="filter-chips">
            <button
              type="button"
              className={`filter-chip ${nearby ? 'active' : ''}`}
              aria-pressed={nearby}
              onClick={() => setNearby(!nearby)}
            >
              <Navigation size={14} />
              Até 3 km
            </button>
            <button
              type="button"
              className={`filter-chip ${highRated ? 'active' : ''}`}
              aria-pressed={highRated}
              onClick={() => setHighRated(!highRated)}
            >
              <Star size={14} />
              4,9+
            </button>
            <button
              type="button"
              className={`filter-chip ${today ? 'active' : ''}`}
              aria-pressed={today}
              onClick={() => setToday(!today)}
            >
              <CalendarDays size={14} />
              Hoje
            </button>
            {(category || highRated || today || query) && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={12} />
                Limpar
              </button>
            )}
          </div>
          <button type="button" className="text-link map-link" onClick={() => setDialog('map')}>
            <MapPin size={15} />
            Ver mapa
          </button>
        </div>
      </section>

      <section className="results-section">
        <div className="section-heading">
          <div>
            <h2>
              {favoritesOnly
                ? 'Salvos com carinho'
                : query
                  ? 'Encontramos para você'
                  : category
                    ? `${categories.find((item) => item.id === category)?.label} perto de você`
                    : 'Perto de você'}
              <span className="result-count">{filtered.length}</span>
            </h2>
            <p className="results-description">
              {favoritesOnly
                ? 'Seu próximo cuidado já tem endereço.'
                : 'Descubra bons encontros na sua vizinhança.'}
            </p>
          </div>
          <label className="sort-select">
            <span>Ordenar por:</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Ordenar profissionais"
            >
              <option value="recommended">Recomendados</option>
              <option value="distance">Mais próximos</option>
              <option value="price">Menor preço</option>
              <option value="rating">Melhor avaliação</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <button className="mobile-map text-link" onClick={() => setDialog('map')}>
            Ver mapa
          </button>
        </div>
        {filtered.length > 0 ? (
          <div className="professional-grid">
            {filtered.map((pro) => (
              <ProfessionalCard professional={pro} key={pro.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={30} strokeWidth={1.3} />
            <h3>
              {favoritesOnly && favorites.length === 0
                ? 'Seus favoritos ficam aqui'
                : 'Ainda não encontramos esse cuidado'}
            </h3>
            <p>
              {favoritesOnly && favorites.length === 0
                ? 'Toque no coração de um profissional para salvar.'
                : 'Tente outro termo ou ajuste os filtros para encontrar mais opções.'}
            </p>
            {favoritesOnly && favorites.length === 0 ? (
              <Link className="button button-primary" to="/explorar">
                Explorar profissionais
              </Link>
            ) : (
              <Button variant="secondary" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </section>
      <div className="explore-bottom-note">
        <BadgeCheck size={18} />
        <p>
          Gente que cuida. <strong>Profissionais verificados, momentos bem cuidados.</strong>
        </p>
        <span>
          PERTINHO DE VOCÊ <ArrowRight size={15} />
        </span>
      </div>

      {dialog === 'filters' && (
        <Modal title="Do seu jeito" onClose={() => setDialog(null)}>
          <p className="muted modal-description">Encontre o cuidado ideal para o seu dia.</p>
          <div className="filter-modal-options">
            {[
              {
                label: 'Até 3 km de você',
                description: 'Profissionais na sua vizinhança',
                value: nearby,
                setter: setNearby,
                icon: Navigation,
              },
              {
                label: 'Avaliações 4,9 ou mais',
                description: 'Os favoritos de quem já foi',
                value: highRated,
                setter: setHighRated,
                icon: Star,
              },
              {
                label: 'Horários para hoje',
                description: 'Um cuidado sem esperar',
                value: today,
                setter: setToday,
                icon: CalendarDays,
              },
            ].map(({ label, description, value, setter, icon: Icon }) => (
              <label className="filter-modal-option" key={label}>
                <Icon size={20} />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} />
              </label>
            ))}
          </div>
          <Button className="w-full" onClick={() => setDialog(null)}>
            Ver {filtered.length} profissionais <ArrowRight size={17} />
          </Button>
        </Modal>
      )}
      {dialog === 'location' && (
        <Modal title="Onde vamos cuidar de você?" onClose={() => setDialog(null)}>
          <p className="muted modal-description">
            Escolha uma região para explorar. As distâncias são ilustrativas nesta demonstração.
          </p>
          <div className="location-options">
            {['Pinheiros', 'Vila Madalena', 'Jardins'].map((place) => (
              <button
                type="button"
                key={place}
                onClick={() => {
                  setNeighborhood(place);
                  setDialog(null);
                }}
              >
                <span className="heading-icon">
                  <MapPin size={20} />
                </span>
                <span>
                  <strong>{place}</strong>
                  <small>São Paulo, SP</small>
                </span>
                {neighborhood === place && <Check size={18} />}
              </button>
            ))}
          </div>
          <div className="demo-note">
            <LocateFixed size={16} />
            Localização ilustrativa para a prévia visual.
          </div>
        </Modal>
      )}
      {dialog === 'map' && (
        <Modal title="Pertinho de você" onClose={() => setDialog(null)} wide>
          <p className="muted modal-description">
            Uma prévia dos profissionais na região. Mapa ilustrativo.
          </p>
          <div className="illustrated-map">
            <div className="map-park">
              Praça
              <br />
              Benedito Calixto
            </div>
            <span className="map-street street-one">R. dos Pinheiros</span>
            <span className="map-street street-two">R. Fradique Coutinho</span>
            {filtered.slice(0, 4).map((pro, index) => (
              <Link key={pro.id} className={`map-pin map-pin-${index}`} to={`/servico/${pro.id}`}>
                <MapPin size={17} />
                {currency(pro.services[0].price)}
              </Link>
            ))}
            <span className="map-you">
              <span />
              Você está aqui
            </span>
          </div>
          <div className="map-list">
            {filtered.map((pro) => (
              <Link key={pro.id} to={`/servico/${pro.id}`}>
                <img src={pro.image} alt="" />
                <div>
                  <strong>{pro.studio}</strong>
                  <span>
                    {pro.title} · {pro.distance.toFixed(1).replace('.', ',')} km
                  </span>
                </div>
                <ArrowRight size={17} />
              </Link>
            ))}
            {!filtered.length && (
              <p className="muted">Nenhum profissional com os filtros atuais.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function HeartIcon() {
  return <span aria-hidden="true">♡</span>;
}
