import { useState } from 'react';
import { CalendarDays, Clock3, MapPin, Plus, Scissors } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDemo } from '../../app/DemoContext';
import type { Appointment } from '../../app/DemoContext';
import { useCatalog } from '../../app/StudioContext';
import { PageHeading } from '../../components/ui/PageHeading';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { currency, dateLabel } from '../../lib/format';
import { AppointmentCard } from './AppointmentCard';

export function AgendaPage() {
  const professionals = useCatalog();
  const { appointments, cancelAppointment } = useDemo();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'upcoming' | 'past'>(
    searchParams.get('tab') === 'historico' ? 'past' : 'upcoming',
  );
  const [selected, setSelected] = useState<Appointment | null>(
    appointments.find((item) => item.id === searchParams.get('agendamento')) ?? null,
  );
  const [confirmCancel, setConfirmCancel] = useState(false);
  const professional = professionals.find((pro) => pro.id === selected?.professionalId);
  const service =
    selected?.serviceSnapshot ??
    professional?.services.find((item) => item.id === selected?.serviceId);
  return (
    <div className="agenda-page">
      <PageHeading
        eyebrow="UM TEMPO SÓ SEU"
        title="Minha agenda"
        description="Seus próximos momentos de cuidado, todos aqui."
        action={
          <Link className="button button-primary new-booking" to="/explorar">
            <Plus size={17} />
            Novo cuidado
          </Link>
        }
      />
      <div className="tab-bar">
        <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
          Próximos <span>{appointments.length}</span>
        </button>
        <button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>
          Histórico
        </button>
      </div>
      {tab === 'upcoming' ? (
        appointments.length ? (
          <>
            <p className="agenda-section-label">JÁ PODE COLOCAR NA SUA ROTINA</p>
            <div className="agenda-grid">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  action={() => {
                    setSelected(appointment);
                    setConfirmCancel(false);
                  }}
                />
              ))}
            </div>
            <div className="agenda-tip">
              <span>✳</span>
              <div>
                <h3>Seu tempo merece esse cuidado.</h3>
                <p>Chegue alguns minutinhos antes e aproveite seu momento com calma.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <CalendarDays size={35} strokeWidth={1.3} />
            <h3>Seu próximo cuidado está por vir</h3>
            <p>Explore os profissionais da sua região e reserve um tempo para você.</p>
            <Link className="button button-primary" to="/explorar">
              Encontrar um cuidado
            </Link>
          </div>
        )
      ) : (
        <div className="history-full">
          <span className="heading-icon">
            <Scissors size={21} />
          </span>
          <div>
            <h3>Corte feminino</h3>
            <p>22 set · Studio Marina</p>
            <span className="completed-badge">Concluído</span>
          </div>
          <strong>{currency(90)}</strong>
          <Link className="text-link" to="/servico/atelie-21">
            Agendar de novo
          </Link>
        </div>
      )}
      {selected && professional && service && (
        <Modal
          title={confirmCancel ? 'Cancelar este cuidado?' : 'Seu agendamento'}
          onClose={() => setSelected(null)}
        >
          {confirmCancel ? (
            <>
              <p className="muted modal-description">
                O agendamento demonstrativo será removido da sua agenda. Você pode escolher um novo
                horário quando quiser.
              </p>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  cancelAppointment(selected.id);
                  setSelected(null);
                }}
              >
                Sim, cancelar agendamento
              </Button>
              <Button
                variant="secondary"
                className="w-full mt-3"
                onClick={() => setConfirmCancel(false)}
              >
                Manter meu cuidado
              </Button>
            </>
          ) : (
            <>
              <div className="manage-booking">
                <h3>{service.name}</h3>
                <p>
                  {professional.name} · {professional.studio}
                </p>
                <div>
                  <CalendarDays size={18} />
                  <span>{dateLabel(selected.date)}</span>
                </div>
                <div>
                  <Clock3 size={18} />
                  <span>
                    {selected.time} · {service.duration}
                  </span>
                </div>
                <div>
                  <MapPin size={18} />
                  <span>{professional.address}</span>
                </div>
                <div className="manage-price">
                  <span>Total</span>
                  <strong>{currency(service.price)}</strong>
                </div>
              </div>
              <Link className="button button-primary w-full" to={`/servico/${professional.id}`}>
                Ver profissional
              </Link>
              <button className="text-link cancel-link" onClick={() => setConfirmCancel(true)}>
                Cancelar agendamento
              </button>
              <p className="demo-form-note">Este agendamento é demonstrativo.</p>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
