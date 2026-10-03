import { ArrowLeft, BadgeCheck, Heart, Star } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { Brand } from '../../components/ui/Brand';

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <aside className="auth-visual">
        <img
          className="auth-visual-image"
          src="/images/salon.jpg"
          alt="Salão de beleza com ambiente acolhedor"
        />
        <div className="auth-visual-shade" />
        <Brand />
        <div className="auth-visual-copy">
          <span className="auth-visual-tag">
            <Heart size={13} /> UM TEMPO SÓ SEU
          </span>
          <h2>
            Pequenas pausas.
            <br />
            Grandes cuidados<span>.</span>
          </h2>
          <p>
            A beleza de encontrar bons profissionais,
            <br />
            bem pertinho de você.
          </p>
          <div className="auth-testimonial">
            <div className="testimonial-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <blockquote>
              “Meu momento favorito da semana.
              <br />É tão bom ter quem cuida da gente.”
            </blockquote>
            <span>
              <img src="/images/marina.jpg" alt="" />
              <span>
                <strong>Um cuidado que faz bem</strong>
                <small>É isso que nos inspira.</small>
              </span>
              <BadgeCheck size={20} />
            </span>
          </div>
        </div>
        <p className="auth-visual-footer">BELEZA E BEM-ESTAR, NO SEU TEMPO.</p>
      </aside>
      <div className="auth-content">
        <header className="auth-topbar">
          <Brand />
          <Link className="text-link" to="/explorar">
            <ArrowLeft size={15} />
            <span>Explorar serviços</span>
          </Link>
        </header>
        <div className="auth-form-container">
          <Outlet />
        </div>
        <footer className="auth-footer">
          <Heart size={12} />
          Feito para o seu bem-estar.
        </footer>
      </div>
    </main>
  );
}
