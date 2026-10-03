import { useState } from 'react';
import { ArrowRight, Check, CreditCard, LockKeyhole, ShieldCheck, Ticket } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDemo } from '../../app/DemoContext';
import { useStudio } from '../../app/StudioContext';
import { studioId, initialPaymentOptions } from '../../data/studio';
import type { PaymentId } from '../../data/studio';
import { money } from '../../lib/format';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { paymentIcons } from '../../components/ui/PaymentIcon';
import {
  BookingHeading,
  BookingSideNote,
  BookingSummary,
  BookingUnavailable,
  bookingUrl,
  useBookingSelection,
} from './BookingShared';

export function CheckoutPage() {
  const { professional, service, date, time } = useBookingSelection();
  const { user, addAppointment } = useDemo();
  const { paymentOptions, available } = useStudio();
  const navigate = useNavigate();
  const options = (professional?.id === studioId ? paymentOptions : initialPaymentOptions).filter(
    (option) => option.enabled,
  );
  const [methodId, setMethodId] = useState<PaymentId>(options[0]?.id ?? 'credit');
  const [dialog, setDialog] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(false);
  const [couponStatus, setCouponStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!professional || !service) return <BookingUnavailable />;
  if (!time)
    return <Navigate replace to={bookingUrl(professional.id, 'horario', service.id, date)} />;
  const method = options.find((option) => option.id === methodId) ?? options[0];
  const MethodIcon = method ? paymentIcons[method.id] : CreditCard;
  const fee = method?.online ? 4.9 : 0;
  const discountValue = discount ? Math.round(service.price * 10) / 100 : 0;
  const total = Math.round((service.price + fee - discountValue) * 100) / 100;
  const pay = () => {
    if (submitting) return;
    if (!method || !available(date, time, service.duration, professional.id)) {
      setError(
        !method
          ? 'Escolha um meio de pagamento disponível.'
          : 'Este horário ficou indisponível. Volte e escolha outro horário.',
      );
      return;
    }
    setSubmitting(true);
    const appointment = addAppointment({
      professionalId: professional.id,
      serviceId: service.id,
      date,
      time,
      serviceSnapshot: { ...service },
      paidTotal: total,
      paymentMethod: method.id,
      customerName: user.name,
    });
    navigate(`/confirmacao/${appointment.id}`, { replace: true });
  };
  return (
    <div className="checkout-page">
      <BookingHeading
        title="Revise e pague"
        description="Confira os dados antes de finalizar"
        back={bookingUrl(professional.id, 'horario', service.id, date, time)}
        step="07 · Pagamento"
      />
      <div className="booking-two-columns">
        <div className="booking-main-panel">
          <section>
            <div className="section-heading">
              <h2>Resumo do agendamento</h2>
            </div>
            <BookingSummary professional={professional} service={service} date={date} time={time} />
          </section>
          <section className="checkout-payment-section">
            <div className="section-heading">
              <h2>Forma de pagamento</h2>
              <button className="text-link" onClick={() => setDialog(true)}>
                Alterar
              </button>
            </div>
            <button className="checkout-method-card" onClick={() => setDialog(true)}>
              <span className="heading-icon">
                <MethodIcon size={20} />
              </span>
              <span>
                <strong>
                  {method?.id === 'credit'
                    ? 'Visa terminando em 4242'
                    : (method?.name ?? 'Selecionar pagamento')}
                </strong>
                <small>
                  {method?.id === 'credit'
                    ? 'Crédito · 1x · cartão demonstrativo'
                    : method?.online
                      ? 'Pagamento demonstrativo no app'
                      : 'Pagamento no atendimento'}
                </small>
              </span>
              <span className="method-selected">
                <Check size={13} />
              </span>
            </button>
          </section>
          <form
            className="coupon-field"
            onSubmit={(event) => {
              event.preventDefault();
              if (coupon.trim().toUpperCase() === 'PERTINHO10') {
                setDiscount(true);
                setCouponStatus('Cupom aplicado: 10% no serviço.');
              } else {
                setDiscount(false);
                setCouponStatus('Cupom não encontrado. Experimente PERTINHO10 nesta prévia.');
              }
            }}
          >
            <Ticket size={17} />
            <input
              aria-label="Cupom de desconto"
              placeholder="Cupom de desconto"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="submit" aria-label="Aplicar cupom">
              <ArrowRight size={18} />
            </button>
          </form>
          {couponStatus && (
            <p role="status" className={`coupon-status ${discount ? 'coupon-applied' : ''}`}>
              {couponStatus}
              {discount && (
                <button
                  onClick={() => {
                    setDiscount(false);
                    setCoupon('');
                    setCouponStatus('');
                  }}
                >
                  Remover
                </button>
              )}
            </p>
          )}
          <div className="checkout-total">
            <div>
              <span>Serviço</span>
              <strong>{money(service.price)}</strong>
            </div>
            <div>
              <span>Taxa de serviço</span>
              <strong>{money(fee)}</strong>
            </div>
            {discount && (
              <div className="discount-line">
                <span>Desconto</span>
                <strong>− {money(discountValue)}</strong>
              </div>
            )}
            <div className="checkout-grand-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <Button
            className="w-full checkout-pay-button"
            disabled={submitting || !method}
            onClick={pay}
          >
            <LockKeyhole size={17} />
            {method?.online ? `Pagar ${money(total)}` : 'Confirmar e pagar no local'}
          </Button>
          <p className="checkout-security">
            <ShieldCheck size={13} />
            {method?.online ? 'Prévia de pagamento seguro' : 'Pagamento combinado no atendimento'}
          </p>
          <p className="demo-form-note">Demonstração visual · nenhum valor será cobrado.</p>
        </div>
        <BookingSideNote professional={professional} service={service} />
      </div>
      {dialog && (
        <Modal title="Como você prefere pagar?" onClose={() => setDialog(false)}>
          <div className="client-payment-options">
            {options.map((option) => {
              const Icon = paymentIcons[option.id];
              return (
                <button
                  key={option.id}
                  aria-pressed={method?.id === option.id}
                  onClick={() => {
                    setMethodId(option.id);
                    setDialog(false);
                  }}
                >
                  <span className="heading-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <strong>
                      {option.id === 'credit' ? 'Visa terminando em 4242' : option.name}
                    </strong>
                    <small>
                      {option.id === 'credit'
                        ? 'Cartão demonstrativo · crédito em 1x'
                        : option.id === 'pix'
                          ? 'Pix demonstrativo, sem QR Code real'
                          : option.online
                            ? 'Pagamento no app'
                            : 'Pagamento no atendimento'}
                    </small>
                  </span>
                  {method?.id === option.id && <Check size={18} />}
                </button>
              );
            })}
          </div>
          <p className="demo-form-note">Não informe dados bancários ou de cartão nesta prévia.</p>
        </Modal>
      )}
    </div>
  );
}
