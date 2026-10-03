import type { ReactNode } from 'react';
import { ArrowLeft, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCatalog } from '../../app/StudioContext';
import { ViewBadge } from '../../components/ui/ViewBadge';
import type { Professional, Service } from '../../data/catalog';
import { currency, dateLabel } from '../../lib/format';
import { endTime } from '../../lib/schedule';

export function useBookingSelection() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const professionals = useCatalog();
  const professional = professionals.find((pro) => pro.id === id);
  const service = professional?.services.find(
    (item) => item.id === (params.get('servico') ?? professional?.services[0]?.id),
  );
  const rawDate = params.get('data') ?? '2026-10-17';
  const date = /^2026-10-(0[1-9]|[12]\d|3[01])$/.test(rawDate) ? rawDate : '2026-10-17';
  const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(params.get('horario') ?? '')
    ? params.get('horario')!
    : '';
  return { professional, service, date, time };
}
export function bookingUrl(
  id: string,
  stage: 'horario' | 'pagamento',
  serviceId: string,
  date?: string,
  time?: string,
) {
  const params = new URLSearchParams({ servico: serviceId });
  if (date) params.set('data', date);
  if (time) params.set('horario', time);
  return `/agendamento/${id}/${stage}?${params}`;
}
export function BookingHeading({
  title,
  description,
  back,
  step,
}: {
  title: string;
  description: string;
  back: string;
  step: string;
}) {
  return (
    <>
      <ViewBadge step={step} />
      <div className="booking-page-heading">
        <Link className="icon-button" to={back} aria-label="Voltar à etapa anterior">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
}
export function BookingUnavailable() {
  return (
    <div className="empty-state">
      <CalendarDays size={32} />
      <h1>Vamos escolher outro cuidado?</h1>
      <p>Este serviço não está disponível. Explore os serviços ativos para continuar.</p>
      <Link className="button button-primary" to="/explorar">
        Explorar profissionais
      </Link>
    </div>
  );
}
export function BookingSummary({
  professional,
  service,
  date,
  time,
  children,
}: {
  professional: Professional;
  service: Service;
  date: string;
  time: string;
  children?: ReactNode;
}) {
  return (
    <div className="checkout-summary-card">
      <div className="checkout-service">
        <img src={professional.avatar} alt="" />
        <div>
          <h3>{service.name}</h3>
          <p>
            {professional.name} · {professional.studio}
          </p>
        </div>
        <strong>{currency(service.price)}</strong>
      </div>
      <div className="checkout-details">
        <p>
          <CalendarDays size={15} />
          <span>{dateLabel(date)}</span>
        </p>
        <p>
          <Clock3 size={15} />
          <span>
            {time} · duração de {service.duration}
          </span>
        </p>
        <p>
          <MapPin size={15} />
          <span>{professional.address}</span>
        </p>
      </div>
      {children}
    </div>
  );
}
export function BookingSideNote({
  professional,
  service,
}: {
  professional: Professional;
  service: Service;
}) {
  return (
    <aside className="booking-side-note">
      <img src={professional.cover} alt="" />
      <div>
        <span>UM TEMPO SÓ SEU</span>
        <h2>
          Já pode desacelerar.
          <br />
          Seu cuidado está pertinho.
        </h2>
        <p>
          {service.name}, com {professional.name.split(' ')[0]}. Um pequeno momento que faz uma
          grande diferença no seu dia.
        </p>
        <div>
          <MapPin size={15} />
          {professional.neighborhood}, São Paulo
        </div>
        <div>
          <Clock3 size={15} />
          {service.duration} de cuidado para você
        </div>
        <span className="booking-side-sparkle">✳</span>
      </div>
    </aside>
  );
}
export const timeRange = (time: string, duration: string) => `${time}–${endTime(time, duration)}`;
