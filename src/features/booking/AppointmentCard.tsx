import { CalendarDays, CheckCircle2, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Appointment } from '../../app/DemoContext';
import { useCatalog } from '../../app/StudioContext';
import { shortDate } from '../../lib/format';

export function AppointmentCard({
  appointment,
  action,
}: {
  appointment: Appointment;
  action?: () => void;
}) {
  const professionals = useCatalog();
  const professional = professionals.find((pro) => pro.id === appointment.professionalId);
  const service =
    appointment.serviceSnapshot ??
    professional?.services.find((item) => item.id === appointment.serviceId);
  if (!professional || !service) return null;
  return (
    <article className="appointment-card">
      <div className="appointment-top">
        <img src={professional.avatar} alt="" />
        <div>
          <Link to={`/servico/${professional.id}`}>
            <h3>{service.name}</h3>
          </Link>
          <p>
            {professional.name} · {professional.studio}
          </p>
        </div>
        <span className="confirmed-badge">
          <CheckCircle2 size={12} />
          Confirmado
        </span>
      </div>
      <div className="appointment-details">
        <span>
          <CalendarDays size={13} />
          {shortDate(appointment.date)}
        </span>
        <span>
          <Clock3 size={13} />
          {appointment.time}
        </span>
        <span>
          <MapPin size={13} />
          {professional.neighborhood}
        </span>
      </div>
      {action && (
        <div className="appointment-action">
          <button type="button" className="text-link" onClick={action}>
            Gerenciar agendamento
          </button>
        </div>
      )}
    </article>
  );
}
