import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Landmark,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStudio } from '../../app/StudioContext';
import type { PaymentId } from '../../data/studio';
import { money } from '../../lib/format';
import { ProviderHeading } from './ProviderHeading';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

import { paymentIcons } from '../../components/ui/PaymentIcon';
export function ProviderPaymentsPage() {
  const { paymentOptions, savePayments } = useStudio();
  const [draft, setDraft] = useState(paymentOptions);
  const [dialog, setDialog] = useState<'help' | 'fees' | 'bank' | 'payout' | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const toggle = (id: PaymentId, enabled: boolean) => {
    setDraft((current) => current.map((item) => (item.id === id ? { ...item, enabled } : item)));
    setSaved(false);
    setError('');
  };
  return (
    <div className="provider-payments-page">
      <ProviderHeading
        title="Meios de pagamento"
        description="Escolha como seus clientes podem pagar"
        step="12 · Pagamentos"
        action={
          <button
            className="icon-button"
            aria-label="Ajuda sobre pagamentos"
            onClick={() => setDialog('help')}
          >
            <CircleHelp size={20} />
          </button>
        }
      />
      <div className="provider-payments-grid">
        <div>
          <button className="payout-card" onClick={() => setDialog('payout')}>
            <div>
              <span>PRÓXIMO REPASSE</span>
              <strong>{money(842.5)}</strong>
              <p>Segunda, 19 de outubro</p>
            </div>
            <span>
              <Landmark size={22} strokeWidth={1.4} />
            </span>
          </button>
          <section className="payment-options-section">
            <div className="section-heading">
              <h2>Aceitos no app</h2>
              <button className="text-link" onClick={() => setDialog('fees')}>
                Ver taxas
              </button>
            </div>
            <div className="provider-payment-options">
              {draft
                .filter((option) => option.online)
                .map((option) => {
                  const Icon = paymentIcons[option.id];
                  return (
                    <div
                      className={`provider-payment-row ${!option.enabled ? 'payment-disabled' : ''}`}
                      key={option.id}
                    >
                      <span className="heading-icon">
                        <Icon size={19} strokeWidth={1.5} />
                      </span>
                      <div>
                        <strong>
                          {option.name}
                          {option.id === 'credit' && (
                            <span className="recommended-badge">
                              <Sparkles size={10} />
                              Recomendado
                            </span>
                          )}
                        </strong>
                        <small>{option.description}</small>
                      </div>
                      <Switch
                        label={`Aceitar ${option.name}`}
                        checked={option.enabled}
                        onChange={(enabled) => toggle(option.id, enabled)}
                      />
                    </div>
                  );
                })}
            </div>
          </section>
          <section className="payment-options-section">
            <div className="section-heading">
              <h2>Pagamento no local</h2>
            </div>
            <div className="provider-payment-options">
              {draft
                .filter((option) => !option.online)
                .map((option) => {
                  const Icon = paymentIcons[option.id];
                  return (
                    <div
                      className={`provider-payment-row ${!option.enabled ? 'payment-disabled' : ''}`}
                      key={option.id}
                    >
                      <span className="heading-icon">
                        <Icon size={19} strokeWidth={1.5} />
                      </span>
                      <div>
                        <strong>{option.name}</strong>
                        <small>{option.description}</small>
                      </div>
                      <Switch
                        label={`Aceitar ${option.name}`}
                        checked={option.enabled}
                        onChange={(enabled) => toggle(option.id, enabled)}
                      />
                    </div>
                  );
                })}
            </div>
          </section>
          <button className="verified-bank" onClick={() => setDialog('bank')}>
            <CheckCircle2 size={17} />
            <span>
              <strong>Conta de recebimento verificada</strong>
              <small>Banco Inter · final 0091</small>
            </span>
            <ChevronRight size={17} />
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button
            className="w-full"
            onClick={() => {
              if (!draft.some((option) => option.enabled)) {
                setError('Mantenha pelo menos um meio de pagamento disponível.');
                return;
              }
              savePayments(draft);
              setSaved(true);
            }}
          >
            {saved ? (
              <>
                <Check size={17} />
                Preferências salvas
              </>
            ) : (
              'Salvar preferências'
            )}
          </Button>
          <p className="inline-status" role="status">
            {saved ? 'As opções foram atualizadas na demonstração do cliente.' : ''}
          </p>
        </div>
        <aside className="provider-desktop-note payments-note">
          <ShieldCheck size={35} strokeWidth={1.3} />
          <h2>
            Mais opções.
            <br />
            Mais tranquilidade.
          </h2>
          <p>Do pagamento ao próximo encontro, deixe seus clientes à vontade para escolher.</p>
          <div>
            <QrCode size={21} />
            <span>Pix para quem prefere praticidade.</span>
          </div>
          <div>
            <CreditCard size={21} />
            <span>Cartões para um cuidado que cabe na rotina.</span>
          </div>
          <p className="muted payment-preview-note">
            Valores, taxas e conta bancária ilustrativos. Nenhuma transação é realizada nesta
            prévia.
          </p>
        </aside>
      </div>
      {dialog && (
        <Modal
          title={
            dialog === 'fees'
              ? 'Taxas demonstrativas'
              : dialog === 'bank'
                ? 'Sua conta de recebimento'
                : dialog === 'payout'
                  ? 'Próximo repasse — prévia'
                  : 'Pagamentos no Pertinho'
          }
          onClose={() => setDialog(null)}
        >
          <div className="prose-modal">
            {dialog === 'fees' ? (
              <>
                <p>
                  Valores de exemplo para revisar a interface. As condições comerciais serão
                  definidas antes do lançamento.
                </p>
                <div className="fee-table">
                  <div>
                    <span>Cartão de crédito</span>
                    <strong>4,9%</strong>
                  </div>
                  <div>
                    <span>Pix</span>
                    <strong>1,5%</strong>
                  </div>
                  <div>
                    <span>Cartão de débito</span>
                    <strong>2,9%</strong>
                  </div>
                  <div>
                    <span>Pagamento no local</span>
                    <strong>Sem taxa nesta prévia</strong>
                  </div>
                </div>
              </>
            ) : dialog === 'bank' ? (
              <>
                <span className="privacy-icon">
                  <Landmark size={28} />
                </span>
                <h3>Banco Inter · final 0091</h3>
                <p>
                  Conta e verificação ilustrativas. Não há conexão bancária ou armazenamento de
                  dados financeiros nesta etapa.
                </p>
              </>
            ) : dialog === 'payout' ? (
              <>
                <h3>{money(842.5)}</h3>
                <p>Previsão ilustrativa: segunda-feira, 19 de outubro de 2026.</p>
                <p>Esse valor é demonstrativo; nenhum repasse está programado.</p>
              </>
            ) : (
              <>
                <p>
                  Escolha os meios de pagamento que deseja exibir no fluxo do cliente e salve suas
                  preferências.
                </p>
                <p>
                  Os pagamentos no app, repasses e verificação de conta serão implementados após a
                  aprovação visual.
                </p>
              </>
            )}
          </div>
          <Button className="w-full" onClick={() => setDialog(null)}>
            Entendi
          </Button>
        </Modal>
      )}
    </div>
  );
}
