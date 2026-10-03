import { useState } from 'react';
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Heart,
  LifeBuoy,
  LogOut,
  Mail,
  Pencil,
  Scissors,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemo } from '../../app/DemoContext';
import { initials } from '../../lib/format';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PageHeading } from '../../components/ui/PageHeading';
import { AppointmentCard } from '../booking/AppointmentCard';

export function ProfilePage() {
  const { user, updateUser, appointments, favorites } = useDemo();
  const [dialog, setDialog] = useState<
    'edit' | 'notifications' | 'privacy' | 'help' | 'settings' | null
  >(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [reminders, setReminders] = useState(true);
  const [news, setNews] = useState(false);
  const [saved, setSaved] = useState(false);
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const edit = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setSaved(false);
    setDialog('edit');
  };
  const titles = {
    edit: 'Seu perfil, do seu jeito',
    notifications: 'Notificações',
    privacy: 'Privacidade e segurança',
    help: 'Como podemos ajudar?',
    settings: 'Configurações da conta',
  };
  return (
    <div className="profile-page">
      <PageHeading
        eyebrow="SEU ESPAÇO DE CUIDADO"
        title="Meu perfil"
        action={
          <button
            type="button"
            className="icon-button"
            aria-label="Configurações da conta"
            onClick={() => setDialog('settings')}
          >
            <Settings size={20} />
          </button>
        }
      />
      <div className="profile-columns">
        <div className="profile-primary">
          <section className="profile-identity">
            <span className="avatar avatar-large">{initials(user.name)}</span>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className="profile-member">
                <Sparkles size={12} />
                Seu cuidado começa aqui
              </span>
            </div>
            <button
              type="button"
              className="icon-button profile-edit"
              aria-label="Editar perfil"
              onClick={edit}
            >
              <Pencil size={18} />
            </button>
          </section>
          <section className="profile-appointment">
            <div className="section-heading">
              <h2>Próximo horário</h2>
              <Link className="text-link" to="/agenda">
                Ver agenda <ChevronRight size={14} />
              </Link>
            </div>
            {appointments[0] ? (
              <AppointmentCard appointment={appointments[0]} />
            ) : (
              <div className="profile-empty">
                <p>Que tal reservar um momento para você?</p>
                <Link to="/explorar" className="text-link">
                  Encontrar um cuidado <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </section>
          <section className="profile-history">
            <div className="section-heading">
              <h2>Histórico</h2>
              <Link className="text-link" to="/agenda?tab=historico">
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            <Link className="history-card" to="/servico/atelie-21">
              <span className="heading-icon">
                <Scissors size={20} />
              </span>
              <div>
                <h3>Corte feminino</h3>
                <p>22 set · Studio Marina</p>
              </div>
              <strong>R$ 90</strong>
            </Link>
          </section>
          <Link className="profile-favorites" to="/favoritos">
            <span className="heading-icon">
              <Heart size={20} />
            </span>
            <div>
              <h3>Meus favoritos</h3>
              <p>
                {favorites.length
                  ? `${favorites.length} ${favorites.length === 1 ? 'profissional salvo' : 'profissionais salvos'} com carinho`
                  : 'Salve os profissionais que você ama'}
              </p>
            </div>
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="profile-secondary">
          <section className="account-section">
            <h2>Conta</h2>
            <div className="account-list">
              <button
                onClick={() => {
                  setSaved(false);
                  setDialog('notifications');
                }}
              >
                <span className="heading-icon">
                  <Bell size={20} />
                </span>
                <span>
                  <strong>Notificações</strong>
                  <small>Lembretes e novidades</small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button onClick={() => setDialog('privacy')}>
                <span className="heading-icon">
                  <ShieldCheck size={20} />
                </span>
                <span>
                  <strong>Privacidade e segurança</strong>
                  <small>Seu acesso e seus dados</small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                onClick={() => {
                  setDialog('help');
                  setHelpTopic(null);
                }}
              >
                <span className="heading-icon">
                  <LifeBuoy size={20} />
                </span>
                <span>
                  <strong>Ajuda</strong>
                  <small>Estamos pertinho de você</small>
                </span>
                <ChevronRight size={17} />
              </button>
            </div>
          </section>
          <div className="profile-care">
            <span>✳</span>
            <h3>
              Você também merece
              <br />
              estar na sua agenda.
            </h3>
            <p>Reserve um tempo para o que faz você se sentir bem.</p>
            <Link to="/explorar" className="text-link">
              Encontrar meu próximo cuidado <ChevronRight size={15} />
            </Link>
          </div>
          <Link className="profile-logout" to="/login">
            <LogOut size={16} />
            Sair da demonstração
          </Link>
          <Link
            className="profile-provider-access button button-secondary"
            to="/prestador/servicos"
          >
            <BriefcaseBusiness size={17} />
            Acessar área do prestador
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
      {dialog && (
        <Modal title={titles[dialog]} onClose={() => setDialog(null)}>
          {dialog === 'edit' && (
            <form
              className="profile-edit-form"
              onSubmit={(event) => {
                event.preventDefault();
                updateUser({ name: name.trim(), email, phone });
                setDialog(null);
              }}
            >
              <p className="muted modal-description">
                Uma pequena atualização para deixar tudo com a sua cara.
              </p>
              <Field
                label="Nome completo"
                icon={<UserRound size={18} />}
                autoComplete="name"
                required
                minLength={3}
                pattern=".*\S.*"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Field
                label="E-mail"
                type="email"
                icon={<Mail size={18} />}
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Field
                label="Celular"
                type="tel"
                icon={<Smartphone size={18} />}
                autoComplete="tel"
                required
                minLength={10}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <Button className="w-full" type="submit">
                Salvar alterações
              </Button>
            </form>
          )}
          {dialog === 'notifications' && (
            <>
              <p className="muted modal-description">Escolha o que você quer receber.</p>
              <div className="notification-options">
                <label>
                  <span>
                    <strong>Lembretes de agendamentos</strong>
                    <small>Para não perder seu momento de cuidado</small>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={reminders}
                    onChange={(event) => {
                      setReminders(event.target.checked);
                      setSaved(false);
                    }}
                  />
                </label>
                <label>
                  <span>
                    <strong>Novidades do Pertinho</strong>
                    <small>Novos profissionais e inspirações para você</small>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={news}
                    onChange={(event) => {
                      setNews(event.target.checked);
                      setSaved(false);
                    }}
                  />
                </label>
              </div>
              <Button className="w-full" onClick={() => setSaved(true)}>
                {saved ? (
                  <>
                    <Check size={18} />
                    Preferências salvas nesta sessão
                  </>
                ) : (
                  'Salvar preferências'
                )}
              </Button>
              <p className="demo-form-note">Nenhuma notificação é enviada nesta prévia.</p>
            </>
          )}
          {dialog === 'privacy' && (
            <div className="prose-modal">
              <span className="privacy-icon">
                <ShieldCheck size={30} />
              </span>
              <h3>Seu cuidado também está nos detalhes.</h3>
              <p>
                Esta versão é uma demonstração visual. Seus dados ficam apenas na memória desta
                sessão e não são enviados a um servidor.
              </p>
              <p>
                A autenticação, a alteração de senha e a gestão de dados estarão disponíveis após a
                implementação do backend.
              </p>
              <Button className="w-full" onClick={() => setDialog(null)}>
                Entendi
              </Button>
            </div>
          )}
          {dialog === 'settings' && (
            <>
              <div className="settings-list">
                <button onClick={edit}>
                  <UserRound size={19} />
                  Editar meus dados
                  <ChevronRight size={16} />
                </button>
                <button onClick={() => setDialog('notifications')}>
                  <Bell size={19} />
                  Minhas notificações
                  <ChevronRight size={16} />
                </button>
                <button onClick={() => setDialog('privacy')}>
                  <ShieldCheck size={19} />
                  Privacidade e segurança
                  <ChevronRight size={16} />
                </button>
                <Link to="/login">
                  <LogOut size={19} />
                  Sair da demonstração
                  <ChevronRight size={16} />
                </Link>
              </div>
              <p className="demo-form-note">Pertinho · prévia visual 1.0</p>
            </>
          )}
          {dialog === 'help' && (
            <>
              <p className="muted modal-description">
                Tudo para aproveitar seu momento com tranquilidade.
              </p>
              <div className="help-topics">
                {[
                  {
                    question: 'Como faço um agendamento?',
                    answer:
                      'Busque um profissional, escolha o serviço e toque em “Escolher horário”. Selecione um dia e um horário para adicionar um agendamento demonstrativo à sua agenda.',
                  },
                  {
                    question: 'Posso cancelar um agendamento?',
                    answer:
                      'Sim. Vá até a Agenda, toque em “Gerenciar agendamento” e escolha “Cancelar agendamento”. Nesta prévia, a mudança fica apenas na sua sessão.',
                  },
                  {
                    question: 'Os agendamentos são reais?',
                    answer:
                      'Ainda não. Esta versão serve para avaliar o visual e os fluxos. Nenhum profissional recebe uma reserva, nenhum pagamento é feito e nenhuma mensagem é enviada.',
                  },
                ].map(({ question, answer }) => (
                  <div key={question}>
                    <button
                      aria-expanded={helpTopic === question}
                      onClick={() => setHelpTopic(helpTopic === question ? null : question)}
                    >
                      {question}
                      <ChevronRight
                        className={helpTopic === question ? 'rotate-90' : ''}
                        size={17}
                      />
                    </button>
                    {helpTopic === question && <p>{answer}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
