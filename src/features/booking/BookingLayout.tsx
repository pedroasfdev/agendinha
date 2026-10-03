import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Heart } from 'lucide-react';
import { Brand } from '../../components/ui/Brand';

export function BookingLayout() {
  const { pathname } = useLocation();
  const step = pathname.includes('/confirmacao/') ? 3 : pathname.endsWith('/pagamento') ? 2 : 1;
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Pertinho — ${step === 1 ? 'Escolha o horário' : step === 2 ? 'Revise e pague' : 'Agendamento confirmado'}`;
  }, [pathname, step]);
  return (
    <div className={`booking-layout ${step === 3 ? 'confirmation-layout' : ''}`}>
      <header className="booking-topbar">
        <Brand />
        <Link to="/explorar" className="text-link">
          <ArrowLeft size={15} />
          Voltar a explorar
        </Link>
      </header>
      <nav className="booking-progress" aria-label="Etapas do agendamento">
        {['Data e horário', 'Pagamento', 'Confirmação'].map((label, index) => (
          <div
            key={label}
            className={index + 1 <= step ? 'current' : ''}
            aria-current={index + 1 === step ? 'step' : undefined}
          >
            <span>{index + 1 < step ? <Check size={13} /> : `0${index + 1}`}</span>
            <p>{label}</p>
            {index < 2 && <i />}
          </div>
        ))}
      </nav>
      <main className="booking-page-content">
        <Outlet />
      </main>
      <footer className="booking-layout-footer">
        <Heart size={12} />
        Um cuidado de cada vez. Bem pertinho.
      </footer>
    </div>
  );
}
