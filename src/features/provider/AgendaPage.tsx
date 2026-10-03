import { useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LockKeyhole,
  MoreVertical,
  Plus,
  UnlockKeyhole,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudio } from '../../app/StudioContext';
import { useDemo } from '../../app/DemoContext';
import { studioId } from '../../data/studio';
import type { TimeBlock } from '../../data/studio';
import type { Service } from '../../data/catalog';
import { dateLabel, initials } from '../../lib/format';
import { endTime, minutes, overlaps, weekDates, weekday, weekLabels } from '../../lib/schedule';
import { ProviderHeading } from './ProviderHeading';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';

const timelineTimes = [
  '09:00',
  '10:30',
  '11:00',
  '12:00',
  '13:00',
  '14:30',
  '16:00',
  '17:15',
  '18:15',
];
interface AgendaItem {
  id: string;
  name: string;
  time: string;
  date: string;
  service: Service | undefined;
  sample: boolean;
}
export function ProviderAgendaPage() {
  const {
    page,
    services,
    blocks,
    addBlock,
    removeBlock,
    available,
    sampleAppointments,
    cancelSampleAppointment,
  } = useStudio();
  const { user, allAppointments: appointments, addAppointment, cancelAppointment } = useDemo();
  const [date, setDate] = useState('2026-10-17');
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<'all' | 'free' | 'booked' | 'blocked'>('all');
  const [modal, setModal] = useState<'block' | 'appointment' | 'calendar' | null>(null);
  const [managed, setManaged] = useState<AgendaItem | null>(null);
  const [managedBlock, setManagedBlock] = useState<TimeBlock | null>(null);
  const [start, setStart] = useState('10:30');
  const [end, setEnd] = useState('11:30');
  const [reason, setReason] = useState('');
  const [clientName, setClientName] = useState('');
  const [serviceId, setServiceId] = useState(services.find((service) => service.active)?.id ?? '');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dayBookings: AgendaItem[] = [
    ...sampleAppointments.map((item) => ({
      id: item.id,
      name: item.customerName,
      date: item.date,
      time: item.time,
      service: services.find((service) => service.id === item.serviceId),
      sample: true,
    })),
    ...appointments
      .filter((item) => item.professionalId === studioId)
      .map((item) => ({
        id: item.id,
        name: item.customerName ?? user.name,
        date: item.date,
        time: item.time,
        service: item.serviceSnapshot ?? services.find((service) => service.id === item.serviceId),
        sample: false,
      })),
  ].filter((item) => item.date === date);
  const dayBlocks = blocks.filter((block) => block.date === date);
  const rows = [
    ...new Set([
      ...timelineTimes,
      ...dayBookings.map((item) => item.time),
      ...dayBlocks.map((block) => block.start),
    ]),
  ]
    .sort((a, b) => minutes(a) - minutes(b))
    .map((time) => {
      const booking = dayBookings.find((item) => time === item.time);
      const block = dayBlocks.find(
        (item) => minutes(time) >= minutes(item.start) && minutes(time) < minutes(item.end),
      );
      return { time, booking, block, free: !booking && !block && available(date, time, '30 min') };
    });
  const freeCount = rows.filter((row) => row.free).length;
  const dates = weekDates('2026-10-15', offset, 5);
  const openModal = (kind: 'block' | 'appointment' | 'calendar', time = '10:30') => {
    setModal(kind);
    setStart(time);
    setEnd(endTime(time, '1h'));
    setError('');
    setClientName('');
    setReason('');
  };
  return (
    <div className="provider-agenda-page">
      <ProviderHeading
        title="Minha agenda"
        description={dateLabel(date)}
        step="11 · Agenda"
        action={
          <button
            className="icon-button"
            aria-label="Adicionar agendamento à agenda"
            onClick={() => openModal('appointment')}
          >
            <CalendarPlus size={21} />
          </button>
        }
      />
      <div className="provider-agenda-grid">
        <div>
          <div className="provider-week-heading">
            <button
              className="icon-button"
              aria-label="Dias anteriores"
              disabled={offset <= -10}
              onClick={() => setOffset(offset - 5)}
            >
              <ChevronLeft size={17} />
            </button>
            <button className="text-link" onClick={() => openModal('calendar')}>
              <CalendarDays size={14} />
              Outubro 2026
            </button>
            <button
              className="icon-button"
              aria-label="Próximos dias"
              disabled={offset >= 10}
              onClick={() => setOffset(offset + 5)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="provider-date-strip">
            {dates.map((item) => (
              <button
                key={item}
                className={`${item === date ? 'selected' : ''} ${!page.days.includes(weekday(item)) ? 'day-off' : ''}`}
                aria-label={dateLabel(item)}
                aria-pressed={date === item}
                onClick={() => {
                  setDate(item);
                  setNotice('');
                }}
              >
                <span>{weekLabels[weekday(item)]}</span>
                <strong>{Number(item.slice(-2))}</strong>
              </button>
            ))}
          </div>
          <div className="agenda-chips">
            <button
              className={filter === 'free' ? 'active' : ''}
              aria-pressed={filter === 'free'}
              onClick={() => setFilter(filter === 'free' ? 'all' : 'free')}
            >
              <span className="chip-circle" />
              {freeCount} livres
            </button>
            <button
              className={filter === 'booked' || filter === 'all' ? 'active' : ''}
              aria-pressed={filter === 'booked'}
              onClick={() => setFilter(filter === 'booked' ? 'all' : 'booked')}
            >
              <CheckCircle2 size={12} />
              {dayBookings.length} marcados
            </button>
            <button
              className={filter === 'blocked' ? 'active' : ''}
              aria-pressed={filter === 'blocked'}
              onClick={() => setFilter(filter === 'blocked' ? 'all' : 'blocked')}
            >
              <LockKeyhole size={12} />
              {dayBlocks.length} {dayBlocks.length === 1 ? 'bloqueado' : 'bloqueados'}
            </button>
          </div>
          <div className="section-heading">
            <h2>Horários do dia</h2>
            <Link className="text-link" to="/prestador/pagina">
              Editar disponibilidade
            </Link>
          </div>
          <div className="provider-timeline">
            {rows
              .filter(
                (row) =>
                  filter === 'all' ||
                  (filter === 'booked' && row.booking) ||
                  (filter === 'blocked' && row.block) ||
                  (filter === 'free' && row.free),
              )
              .map(({ time, booking, block, free }) => (
                <div className="timeline-row" key={time}>
                  <span className="timeline-time">{time}</span>
                  {booking ? (
                    <button
                      className="timeline-booking"
                      onClick={() => setManaged(booking)}
                      aria-label={`Gerenciar agendamento de ${booking.name} às ${time}`}
                    >
                      <span className="booking-customer-avatar">{initials(booking.name)}</span>
                      <span>
                        <strong>{booking.name}</strong>
                        <small>
                          {booking.service?.name ?? 'Serviço'} · até{' '}
                          {endTime(time, booking.service?.duration ?? '1h')}
                        </small>
                      </span>
                      <MoreVertical size={17} />
                    </button>
                  ) : block ? (
                    <button
                      className="timeline-block"
                      onClick={() => setManagedBlock(block)}
                      aria-label={`Gerenciar bloqueio ${block.reason}`}
                    >
                      <span>
                        <LockKeyhole size={15} />
                      </span>
                      <span>
                        <strong>{block.reason}</strong>
                        <small>Bloqueado até {block.end}</small>
                      </span>
                    </button>
                  ) : free ? (
                    <button
                      className="timeline-free"
                      aria-label={`Adicionar agendamento às ${time}`}
                      onClick={() => openModal('appointment', time)}
                    >
                      <span>
                        <Plus size={17} />
                      </span>
                      Horário disponível
                    </button>
                  ) : (
                    <div className="timeline-unavailable">
                      <LockKeyhole size={13} />
                      <span>
                        {!page.days.includes(weekday(date)) ? 'Sem atendimento' : 'Indisponível'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
          {filter !== 'all' &&
            !rows.some(
              (row) =>
                (filter === 'booked' && row.booking) ||
                (filter === 'blocked' && row.block) ||
                (filter === 'free' && row.free),
            ) && <p className="agenda-empty-filter">Nenhum horário nesta categoria.</p>}
          <Button
            variant="secondary"
            className="w-full block-time-button"
            onClick={() => openModal('block')}
          >
            <LockKeyhole size={16} />
            Bloquear horário
          </Button>
          <p className="inline-status" role="status">
            {notice}
          </p>
        </div>
        <aside className="provider-agenda-aside">
          <div className="agenda-day-summary">
            <span className="heading-icon">
              <CalendarDays size={24} />
            </span>
            <p>SEU DIA, BEM ORGANIZADO</p>
            <h2>{dateLabel(date).split(',')[0]}</h2>
            <div>
              <strong>{dayBookings.length}</strong>
              <span>
                bons encontros
                <br />
                marcados para hoje
              </span>
            </div>
            <div className="daily-summary-line">
              <Clock3 size={16} />
              Atendimento das {page.opensAt} às {page.closesAt}
            </div>
            <div className="daily-summary-line">
              <UnlockKeyhole size={16} />
              {freeCount} horários livres na agenda
            </div>
          </div>
          <div className="care-note">
            <span>✳</span>
            <h3>
              Um respiro também
              <br />
              faz parte do dia.
            </h3>
            <p>
              Reserve intervalos e organize sua rotina para cuidar bem de quem chega — e de você.
            </p>
          </div>
        </aside>
      </div>
      {modal && (
        <Modal
          title={
            modal === 'block'
              ? 'Um tempo para você'
              : modal === 'calendar'
                ? 'Escolha um dia'
                : 'Adicionar agendamento'
          }
          onClose={() => setModal(null)}
        >
          {modal === 'calendar' ? (
            <form
              className="provider-form"
              onSubmit={(event) => {
                event.preventDefault();
                const diff = Math.round(
                  (new Date(`${date}T12:00:00Z`).getTime() -
                    new Date('2026-10-15T12:00:00Z').getTime()) /
                    86400000,
                );
                setOffset(Math.floor(diff / 5) * 5);
                setModal(null);
              }}
            >
              <Field
                label="Data da agenda"
                type="date"
                value={date}
                min="2026-10-01"
                max="2026-10-31"
                required
                onChange={(e) => setDate(e.target.value)}
              />
              <Button className="w-full">Ver dia</Button>
            </form>
          ) : (
            <form
              className="provider-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (modal === 'block') {
                  if (minutes(start) >= minutes(end)) {
                    setError('O término deve ser depois do início.');
                    return;
                  }
                  if (
                    dayBookings.some((item) =>
                      overlaps(
                        start,
                        end,
                        item.time,
                        endTime(item.time, item.service?.duration ?? '1h'),
                      ),
                    ) ||
                    dayBlocks.some((item) => overlaps(start, end, item.start, item.end))
                  ) {
                    setError(
                      'Este período já tem um agendamento ou bloqueio. Escolha outro intervalo.',
                    );
                    return;
                  }
                  addBlock({ date, start, end, reason: reason.trim() || 'Horário bloqueado' });
                  setNotice('Horário bloqueado nesta demonstração.');
                } else {
                  const service = services.find((item) => item.id === serviceId && item.active);
                  if (!service || !available(date, start, service.duration)) {
                    setError(
                      'Este horário não está disponível para a duração do serviço. Escolha outro.',
                    );
                    return;
                  }
                  addAppointment({
                    professionalId: studioId,
                    serviceId,
                    date,
                    time: start,
                    serviceSnapshot: service,
                    customerName: clientName.trim(),
                    forOtherClient: true,
                  });
                  setNotice('Agendamento adicionado à demonstração.');
                }
                setModal(null);
              }}
            >
              <p className="muted">{dateLabel(date)}</p>
              {modal === 'appointment' && (
                <>
                  <Field
                    label="Nome do cliente"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    minLength={3}
                    pattern=".*\S.*"
                  />
                  <label className="select-field">
                    <span>Serviço</span>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                    >
                      {services
                        .filter((service) => service.active)
                        .map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} · {service.duration}
                          </option>
                        ))}
                    </select>
                  </label>
                </>
              )}
              <div className="form-two-columns">
                <Field
                  label="Horário de início"
                  type="time"
                  required
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
                {modal === 'block' && (
                  <Field
                    label="Horário de término"
                    type="time"
                    required
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                )}
              </div>
              {modal === 'block' && (
                <Field
                  label="Motivo (opcional)"
                  placeholder="Ex.: Almoço, pausa, compromisso"
                  value={reason}
                  maxLength={60}
                  onChange={(e) => setReason(e.target.value)}
                />
              )}
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <Button className="w-full">
                {modal === 'block' ? 'Bloquear horário' : 'Adicionar à agenda'}
              </Button>
              <p className="demo-form-note">Demonstração visual · nenhuma mensagem será enviada.</p>
            </form>
          )}
        </Modal>
      )}
      {managed && (
        <Modal title="Detalhes do agendamento" onClose={() => setManaged(null)}>
          <div className="manage-booking">
            <h3>{managed.name}</h3>
            <p>{managed.service?.name}</p>
            <div>
              <CalendarDays size={17} />
              {dateLabel(managed.date)}
            </div>
            <div>
              <Clock3 size={17} />
              {managed.time}–{endTime(managed.time, managed.service?.duration ?? '1h')}
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setManaged(null)}>
            Voltar à agenda
          </Button>
          <button
            className="text-link cancel-link"
            onClick={() => {
              managed.sample ? cancelSampleAppointment(managed.id) : cancelAppointment(managed.id);
              setManaged(null);
              setNotice('Agendamento removido da demonstração.');
            }}
          >
            Cancelar agendamento demonstrativo
          </button>
        </Modal>
      )}
      {managedBlock && (
        <Modal title={managedBlock.reason} onClose={() => setManagedBlock(null)}>
          <div className="manage-booking">
            <p>{dateLabel(managedBlock.date)}</p>
            <div>
              <LockKeyhole size={18} />
              {managedBlock.start}–{managedBlock.end}
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              removeBlock(managedBlock.id);
              setManagedBlock(null);
              setNotice('Horário liberado na demonstração.');
            }}
          >
            <UnlockKeyhole size={17} />
            Liberar horário
          </Button>
        </Modal>
      )}
    </div>
  );
}
