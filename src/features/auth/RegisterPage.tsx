import { useState } from 'react';
import { ArrowLeft, Check, LockKeyhole, Mail, Smartphone, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useDemo } from '../../app/DemoContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { updateUser } = useDemo();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState<'terms' | 'privacy' | null>(null);
  const strength =
    password.length < 8
      ? Number(password.length > 0)
      : 1 +
        Number(/[A-Z]/.test(password) && /[a-z]/.test(password)) +
        Number(/\d/.test(password)) +
        Number(/[^a-zA-Z0-9]/.test(password));
  return (
    <>
      <div className="auth-page-label">
        <span className="client-badge">VISÃO CLIENTE</span>
        <span>02 · Cadastro</span>
      </div>
      <div className="register-heading">
        <Link to="/login" className="icon-button" aria-label="Voltar para login">
          <ArrowLeft size={21} />
        </Link>
        <div>
          <h1>
            Crie sua conta<span className="coral-dot">.</span>
          </h1>
          <p className="muted">Leva menos de 2 minutos</p>
        </div>
      </div>
      <form
        className="auth-form register-form"
        onSubmit={(event) => {
          event.preventDefault();
          updateUser({ name: name.trim(), email, phone });
          navigate('/explorar');
        }}
      >
        <Field
          label="Nome completo"
          type="text"
          icon={<UserRound size={18} />}
          placeholder="Como podemos chamar você?"
          autoComplete="name"
          minLength={3}
          pattern=".*\S.*"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
          label="Celular"
          type="tel"
          icon={<Smartphone size={18} />}
          placeholder="(11) 98765-4321"
          autoComplete="tel"
          minLength={10}
          pattern="[0-9() +\-]{10,16}"
          maxLength={16}
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <div>
          <Field
            label="Senha"
            type="password"
            icon={<LockKeyhole size={18} />}
            placeholder="Pelo menos 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="password-strength">
            <div>
              {[1, 2, 3, 4].map((level) => (
                <span key={level} className={strength >= level ? `strength-${strength}` : ''} />
              ))}
            </div>
            <small>
              {password.length === 0
                ? 'Uma senha só sua, para cuidar do seu acesso'
                : strength <= 1
                  ? 'Adicione letras, números e símbolos'
                  : strength === 2
                    ? 'Senha razoável'
                    : 'Senha forte'}
            </small>
          </div>
        </div>
        <div className="terms-row">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              required
              aria-label="Aceito os Termos de Uso e a Política de Privacidade"
            />
            <span>
              <Check size={12} />
            </span>
          </label>
          <p>
            Li e aceito os{' '}
            <button type="button" onClick={() => setTerms('terms')}>
              Termos de Uso
            </button>{' '}
            e a{' '}
            <button type="button" onClick={() => setTerms('privacy')}>
              Política de Privacidade.
            </button>
          </p>
        </div>
        <div className="register-submit">
          <Button className="w-full" type="submit">
            Criar minha conta
          </Button>
          <p className="demo-form-note">
            Cadastro demonstrativo. Os dados ficam apenas nesta sessão.
          </p>
        </div>
      </form>
      <p className="auth-switch register-switch">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
      {terms && (
        <Modal
          title={terms === 'terms' ? 'Termos de Uso — prévia' : 'Política de Privacidade — prévia'}
          onClose={() => setTerms(null)}
        >
          <div className="prose-modal">
            <p>
              O Pertinho está em fase de desenvolvimento visual. Os perfis, preços, avaliações e
              agendamentos apresentados são demonstrativos.
            </p>
            <p>
              {terms === 'terms'
                ? 'Os termos definitivos serão apresentados antes do lançamento. Nenhum agendamento nesta prévia representa uma reserva real ou gera cobrança.'
                : 'As informações preenchidas ficam na memória do navegador durante esta sessão. Não há envio de dados, autenticação real ou armazenamento em servidor nesta etapa.'}
            </p>
          </div>
          <Button className="w-full" onClick={() => setTerms(null)}>
            Entendi
          </Button>
        </Modal>
      )}
    </>
  );
}
