import { useState } from 'react';
import { CalendarHeart, CheckCircle2, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useDemo } from '../../app/DemoContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.2-2 2.8v2.4h3.2c1.9-1.7 3-4.1 3-7Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-0.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2H3v2.6C4.7 19.7 8.1 22 12 22Z"
      />
      <path fill="#FBBC05" d="M6.3 13.8a6 6 0 0 1 0-3.6V7.6H3a10 10 0 0 0 0 8.8l3.3-2.6Z" />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.6 9.6 0 0 0 12 2C8.1 2 4.7 4.3 3 7.6l3.3 2.6C7.1 7.8 9.4 6 12 6Z"
      />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dialog, setDialog] = useState<'forgot' | 'google' | null>(null);
  const [sent, setSent] = useState(false);
  return (
    <>
      <div className="auth-page-label">
        <span className="client-badge">VISÃO CLIENTE</span>
        <span>01 · Login</span>
      </div>
      <div className="login-intro">
        <span className="login-symbol">
          <CalendarHeart size={29} strokeWidth={1.3} />
        </span>
        <p className="eyebrow coral">PERTINHO</p>
        <h1>
          Seu tempo,
          <br className="desktop-break" /> bem cuidado<span className="coral-dot">.</span>
        </h1>
        <p className="muted">
          Encontre profissionais de confiança e agende
          <br className="desktop-break" /> serviços perto de você.
        </p>
      </div>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          updateUser({ ...user, email });
          navigate('/explorar');
        }}
      >
        <Field
          label="E-mail"
          type="email"
          icon={<Mail size={18} />}
          placeholder="seu.email@exemplo.com"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          label="Senha"
          type="password"
          icon={<LockKeyhole size={18} />}
          placeholder="Sua senha"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className="text-link forgot-link"
          type="button"
          onClick={() => {
            setDialog('forgot');
            setSent(false);
          }}
        >
          Esqueci minha senha
        </button>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <div className="auth-or">
          <span />
          ou
          <span />
        </div>
        <Button
          variant="secondary"
          type="button"
          className="w-full google-button"
          onClick={() => setDialog('google')}
        >
          <GoogleIcon />
          Continuar com Google
        </Button>
        <p className="demo-form-note">
          Prévia visual · entre com um e-mail e uma senha de 8 caracteres.
        </p>
      </form>
      <p className="auth-switch">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
      {dialog === 'forgot' && (
        <Modal
          title={sent ? 'Tudo pronto para a próxima etapa' : 'Vamos recuperar seu acesso'}
          onClose={() => setDialog(null)}
        >
          {sent ? (
            <div className="success-content">
              <CheckCircle2 size={44} />
              <p>
                Na versão final, você receberá um link de recuperação por e-mail. Esta é uma
                demonstração visual; nenhum e-mail foi enviado.
              </p>
              <Button className="w-full" onClick={() => setDialog(null)}>
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <p className="muted modal-description">
                Informe o e-mail da sua conta para visualizar o fluxo de recuperação.
              </p>
              <Field
                label="E-mail"
                type="email"
                icon={<Mail size={18} />}
                autoComplete="email"
                required
                defaultValue={email}
                placeholder="seu.email@exemplo.com"
              />
              <Button className="w-full mt-6">Continuar</Button>
            </form>
          )}
        </Modal>
      )}
      {dialog === 'google' && (
        <Modal title="Entrar com Google" onClose={() => setDialog(null)}>
          <div className="google-preview">
            <GoogleIcon />
            <p>
              A conexão com o Google estará disponível após a implementação do backend. Você pode
              explorar todas as telas com o perfil demonstrativo.
            </p>
            <Button className="w-full" onClick={() => navigate('/explorar')}>
              Explorar a demonstração
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
