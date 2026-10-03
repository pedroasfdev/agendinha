import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  Store,
  WalletCards,
} from 'lucide-react';
import { Brand } from '../../components/ui/Brand';
import { useStudio } from '../../app/StudioContext';
import { initials } from '../../lib/format';

const navigation = [
  { to: '/prestador/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/prestador/servicos', label: 'Serviços', icon: BriefcaseBusiness },
  { to: '/prestador/pagamentos', label: 'Pagamentos', icon: WalletCards },
  { to: '/prestador/pagina', label: 'Minha página', icon: Store },
];
export function ProviderLayout() {
  const { page } = useStudio();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Pertinho — ${navigation.find((item) => item.to === pathname)?.label ?? 'Área do prestador'}`;
  }, [pathname]);
  return (
    <div className="app-shell provider-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-section-label">SEU NEGÓCIO, BEM CUIDADO</div>
        <nav className="desktop-nav" aria-label="Navegação do prestador">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={20} strokeWidth={1.5} />
              {label}
              <span className="nav-dot" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <Store size={25} strokeWidth={1.4} />
          <h3>
            Seu talento.
            <br />
            Nossa conexão.
          </h3>
          <p>Uma página com a sua cara, para bons encontros acontecerem.</p>
          <Link to="/servico/studio-marina">
            Ver minha página <ArrowUpRight size={17} />
          </Link>
        </div>
        <Link className="sidebar-login" to="/explorar">
          <ArrowLeftRight size={17} />
          Ir para visão cliente
        </Link>
        <div className="sidebar-footer">
          PERTINHO DE QUEM CUIDA <span>✳</span>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <p className="topbar-caption">
            Seu negócio, bem cuidado
            <span className="topbar-caption-dot" />
          </p>
          <div className="topbar-actions">
            <Link to="/explorar" className="provider-role-switch">
              <ArrowLeftRight size={15} />
              <span>Visão cliente</span>
            </Link>
            <Link to="/prestador/pagina" className="topbar-user" aria-label="Editar minha página">
              <span className="avatar avatar-small">{initials(page.name)}</span>
              <span>{page.name}</span>
            </Link>
          </div>
        </header>
        <main id="main-content" className="page-content provider-content">
          <Outlet />
        </main>
        <footer className="desktop-footer">
          <span>© 2026 Pertinho. Seu negócio, bem cuidado.</span>
          <span>
            Gente que cuida de gente <Heart size={12} />
          </span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegação do prestador no celular">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            <Icon size={21} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
