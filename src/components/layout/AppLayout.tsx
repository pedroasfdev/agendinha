import { useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  Home,
  LogIn,
  MapPin,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Brand } from '../ui/Brand';
import { useDemo } from '../../app/DemoContext';
import { initials } from '../../lib/format';

const navigation = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/explorar', label: 'Buscar', icon: Search },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
];

export function AppLayout() {
  const { user } = useDemo();
  const { pathname } = useLocation();
  const title = pathname.startsWith('/servico')
    ? 'Um cuidado do seu jeito'
    : pathname === '/perfil'
      ? 'Meu espaço'
      : pathname === '/agenda'
        ? 'Seus momentos de cuidado'
        : pathname === '/favoritos'
          ? 'Seus lugares favoritos'
          : 'Seu tempo, bem cuidado';
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Pertinho — ${title}`;
  }, [pathname, title]);

  return (
    <div className={`app-shell ${pathname.startsWith('/servico') ? 'service-layout' : ''}`}>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-section-label">SEU MOMENTO</div>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink end to={to} key={to}>
              <Icon size={20} strokeWidth={1.7} />
              {label}
              <span className="nav-dot" />
            </NavLink>
          ))}
          <NavLink to="/favoritos">
            <Heart size={20} strokeWidth={1.7} />
            Favoritos
            <span className="nav-dot" />
          </NavLink>
        </nav>
        <div className="sidebar-note">
          <span className="sidebar-note-icon">
            <Sparkles size={22} strokeWidth={1.5} />
          </span>
          <h3>
            Cuidar de você
            <br />
            cabe na sua rotina.
          </h3>
          <p>Encontre seu próximo momento de pausa.</p>
          <Link to="/explorar">
            Vamos encontrar <ArrowUpRight size={17} />
          </Link>
        </div>
        <Link to="/login" className="sidebar-login">
          <LogIn size={17} />
          Entrar em outra conta
        </Link>
        <Link to="/prestador/servicos" className="sidebar-login provider-access">
          <BriefcaseBusiness size={17} />
          Área do prestador
        </Link>
        <div className="sidebar-footer">
          FEITO PARA O SEU BEM-ESTAR <span>✳</span>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <p className="topbar-caption">
            {title}
            <span className="topbar-caption-dot" />
          </p>
          <div className="topbar-actions">
            <Link
              to="/prestador/servicos"
              className="icon-button client-role-switch"
              aria-label="Ir para área do prestador"
              title="Área do prestador"
            >
              <BriefcaseBusiness size={18} />
            </Link>
            <Link to="/explorar" className="topbar-location">
              <MapPin size={15} />
              <span>Pinheiros, São Paulo</span>
            </Link>
            <span className="topbar-divider" />
            <Link to="/favoritos" className="icon-button topbar-heart" aria-label="Meus favoritos">
              <Heart size={19} />
            </Link>
            <Link to="/perfil" className="topbar-user" aria-label="Abrir meu perfil">
              <span className="avatar avatar-small">{initials(user.name)}</span>
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>
        <main id="main-content" className="page-content">
          <Outlet />
        </main>
        <footer className="desktop-footer">
          <span>© 2026 Pertinho. Um tempo só seu.</span>
          <span>
            Beleza, cuidado e boas conexões <Heart size={12} />
          </span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegação no celular">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink end to={to} key={to}>
            <Icon size={21} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
