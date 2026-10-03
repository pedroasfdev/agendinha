import { CalendarDays, CalendarPlus, Check, Clock3, MapPin, Route } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDemo } from '../../app/DemoContext';
import { useCatalog } from '../../app/StudioContext';
import { ViewBadge } from '../../components/ui/ViewBadge';
import { Button } from '../../components/ui/Button';
import { dateLabel, money } from '../../lib/format';
import { endTime } from '../../lib/schedule';
import { BookingUnavailable, timeRange } from './BookingShared';

const escapeCalendar = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
export function ConfirmationPage() {
  const { bookingId } = useParams();
  const { appointments, user } = useDemo();
  const professionals = useCatalog();
  const appointment = appointments.find((item) => item.id === bookingId);
  const professional = professionals.find((pro) => pro.id === appointment?.professionalId);
  const service =
    appointment?.serviceSnapshot ??
    professional?.services.find((item) => item.id === appointment?.serviceId);
  if (!appointment || !professional || !service) return <BookingUnavailable />;
  const localPayment =
    appointment.paymentMethod === 'cash' || appointment.paymentMethod === 'terminal';
  const download = () => {
    const stamp = (time: string) =>
      new Date(`${appointment.date}T${time}:00-03:00`)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    const text = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pertinho//Agenda demonstrativa//PT-BR',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@pertinho.demo`,
      `DTSTAMP:${new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '')}`,
      `DTSTART:${stamp(appointment.time)}`,
      `DTEND:${stamp(endTime(appointment.time, service.duration))}`,
      `SUMMARY:${escapeCalendar(`${service.name} — ${professional.studio} (demonstração)`)}`,
      `LOCATION:${escapeCalendar(professional.address)}`,
      'DESCRIPTION:Agendamento demonstrativo. Nenhuma reserva real foi realizada.',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pertinho-agendamento-demo.ics';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="confirmation-page">
      <ViewBadge step="08 · Confirmação" />
      <div className="confirmation-intro">
        <span className="confirmation-check">
          <Check size={31} strokeWidth={1.5} />
        </span>
        <h1>Agendamento confirmado!</h1>
        <p>
          Tudo certo, {user.name.split(' ')[0]}. Seu próximo
          <br />
          momento de cuidado está na agenda.
        </p>
        <span className="confirmation-number">
          AGENDAMENTO #PT-
          {appointment.id === 'demo-appointment'
            ? '1742'
            : appointment.id.replace(/-/g, '').slice(0, 4).toUpperCase()}
        </span>
      </div>
      <div className="confirmation-details-card">
        <div className="confirmation-service">
          <div>
            <h2>{service.name}</h2>
            <p>com {professional.name}</p>
          </div>
          <span>
            {localPayment ? 'PAGAR NO LOCAL' : 'PAGO'} ·{' '}
            {money(appointment.paidTotal ?? service.price)}
          </span>
        </div>
        <div className="confirmation-detail-row">
          <span className="heading-icon">
            <CalendarDays size={18} />
          </span>
          <div>
            <span>Data</span>
            <strong>{dateLabel(appointment.date)}</strong>
          </div>
        </div>
        <div className="confirmation-detail-row">
          <span className="heading-icon">
            <Clock3 size={18} />
          </span>
          <div>
            <span>Horário</span>
            <strong>{timeRange(appointment.time, service.duration)}</strong>
          </div>
        </div>
        <div className="confirmation-detail-row">
          <span className="heading-icon">
            <MapPin size={18} />
          </span>
          <div>
            <span>Local</span>
            <strong>{professional.address}</strong>
          </div>
        </div>
      </div>
      <div className="confirmation-actions">
        <Link className="button button-primary w-full" to={`/agenda?agendamento=${appointment.id}`}>
          <Route size={17} />
          Acompanhar agendamento
        </Link>
        <Button variant="secondary" className="w-full" onClick={download}>
          <CalendarPlus size={17} />
          Adicionar ao calendário
        </Button>
        <Link className="text-link" to="/">
          Voltar ao início
        </Link>
      </div>
      <p className="demo-form-note">Confirmação demonstrativa · sem pagamento ou reserva real.</p>
    </div>
  );
}
