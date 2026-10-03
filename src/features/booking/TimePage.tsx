import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../../app/StudioContext';
import { Button } from '../../components/ui/Button';
import { shortDate, dateLabel } from '../../lib/format';
import { weekDates, weekday, weekLabels } from '../../lib/schedule';
import {
  BookingHeading,
  BookingSideNote,
  BookingUnavailable,
  bookingUrl,
  timeRange,
  useBookingSelection,
} from './BookingShared';

const morning = ['09:00', '10:30', '11:45'];
const afternoon = ['13:00', '14:30', '16:00', '17:15', '18:30', '19:45'];
export function TimePage() {
  const selection = useBookingSelection();
  const { available } = useStudio();
  const navigate = useNavigate();
  const [date, setDate] = useState(selection.date);
  const [time, setTime] = useState(selection.time);
  const [week, setWeek] = useState(
    Math.min(2, Math.max(0, Math.floor((Number(selection.date.slice(-2)) - 12) / 7))),
  );
  const { professional, service } = selection;
  if (!professional || !service) return <BookingUnavailable />;
  const dates = weekDates('2026-10-12', week * 7);
  const validTime = time && available(date, time, service.duration, professional.id);
  return (
    <div className="time-page">
      <BookingHeading
        title="Escolha o horário"
        description={`${service.name} · ${service.duration}`}
        back={`/servico/${professional.id}`}
        step="06 · Data e horário"
      />
      <div className="booking-two-columns">
        <div className="booking-main-panel">
          <div className="time-professional-card">
            <img src={professional.avatar} alt="" />
            <div>
              <strong>{professional.name}</strong>
              <p>
                {professional.studio} · {professional.neighborhood}
              </p>
            </div>
            <MapPin size={18} />
          </div>
          <div className="calendar-heading time-calendar-heading">
            <button
              className="icon-button"
              aria-label="Semana anterior"
              disabled={week === 0}
              onClick={() => setWeek(week - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span>Outubro 2026</span>
            <button
              className="icon-button"
              aria-label="Próxima semana"
              disabled={week === 2}
              onClick={() => setWeek(week + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="date-picker booking-date-picker" role="group" aria-label="Escolha um dia">
            {dates.map((item) => (
              <button
                key={item}
                disabled={!item.startsWith('2026-10')}
                aria-pressed={date === item}
                aria-label={dateLabel(item)}
                className={date === item ? 'selected' : ''}
                onClick={() => {
                  setDate(item);
                  setTime('');
                }}
              >
                <span>{weekLabels[weekday(item)]}</span>
                <strong>{Number(item.slice(-2))}</strong>
              </button>
            ))}
          </div>
          <div className="section-heading available-heading">
            <h2>Horários disponíveis</h2>
            <span>Fuso de Brasília</span>
          </div>
          {[
            { label: 'MANHÃ', slots: morning },
            { label: 'TARDE', slots: afternoon },
          ].map(({ label, slots }) => (
            <div className="time-period" key={label}>
              <p>{label}</p>
              <div
                className="booking-time-grid"
                role="group"
                aria-label={`Horários da ${label.toLowerCase()}`}
              >
                {slots.map((slot) => (
                  <button
                    key={slot}
                    disabled={!available(date, slot, service.duration, professional.id)}
                    className={time === slot ? 'selected' : ''}
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {validTime ? (
            <div className="selected-time-note">
              <Clock3 size={15} />
              {weekLabels[weekday(date)].toLowerCase()}, {shortDate(date)} ·{' '}
              {timeRange(time, service.duration)}
            </div>
          ) : (
            <p className="choose-time-note">Escolha um dia e um horário para continuar.</p>
          )}
          <Button
            className="w-full"
            disabled={!validTime}
            onClick={() =>
              navigate(bookingUrl(professional.id, 'pagamento', service.id, date, time))
            }
          >
            Continuar
          </Button>
          <p className="demo-form-note">Agendamento demonstrativo · nenhuma reserva real.</p>
        </div>
        <BookingSideNote professional={professional} service={service} />
      </div>
    </div>
  );
}
