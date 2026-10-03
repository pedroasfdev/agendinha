import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Eye,
  Flower2,
  GripVertical,
  Hand,
  MoreHorizontal,
  Paintbrush,
  Plus,
  Sparkles,
  Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudio } from '../../app/StudioContext';
import type { StudioService } from '../../data/studio';
import { currency } from '../../lib/format';
import { durationMinutes } from '../../lib/schedule';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { Switch } from '../../components/ui/Switch';
import { ProviderHeading } from './ProviderHeading';

const icons = [Sparkles, Hand, Flower2, Paintbrush];
export function ProviderServicesPage() {
  const { page, services, saveServices } = useStudio();
  const [ordering, setOrdering] = useState(false);
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState<StudioService | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const reorder = (index: number, direction: number) => {
    const next = [...services];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    saveServices(next);
  };
  return (
    <div className="provider-services-page">
      <ProviderHeading
        title="Meus serviços"
        description="Gerencie o que aparece na sua página"
        step="09 · Serviços"
        action={
          <button
            className="icon-button"
            aria-label="Mais opções de serviços"
            onClick={() => setMenu(true)}
          >
            <MoreHorizontal size={21} />
          </button>
        }
      />
      <div className="provider-services-grid">
        <div>
          <div className="published-card">
            <div>
              <span>PÁGINA PUBLICADA</span>
              <h2>{page.name}</h2>
              <p>pertinho.app/studio-marina</p>
            </div>
            <Link to="/servico/studio-marina">
              <Eye size={12} />
              Visualizar
            </Link>
          </div>
          <div className="provider-stats">
            <div>
              <strong>{services.filter((service) => service.active).length}</strong>
              <span>serviços ativos</span>
            </div>
            <div>
              <strong>42</strong>
              <span>agendamentos/mês</span>
            </div>
          </div>
          <section>
            <div className="section-heading">
              <h2>Lista de serviços</h2>
              <button className="text-link" onClick={() => setOrdering(!ordering)}>
                {ordering ? 'Concluir ordem' : 'Ordenar'}
              </button>
            </div>
            <div className="provider-service-list">
              {services.map((service, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <article
                    key={service.id}
                    className={`provider-service-row ${!service.active ? 'service-inactive' : ''}`}
                  >
                    <span className="heading-icon">
                      <Icon size={20} strokeWidth={1.4} />
                    </span>
                    <button
                      className="provider-service-name"
                      onClick={() => setEditing(service)}
                      aria-label={`Editar ${service.name}`}
                    >
                      <strong>{service.name}</strong>
                      <span>
                        {service.duration} · {currency(service.price)}
                      </span>
                    </button>
                    <Switch
                      checked={service.active}
                      label={`Ativar ${service.name}`}
                      onChange={(active) => {
                        saveServices(
                          services.map((item) =>
                            item.id === service.id ? { ...item, active } : item,
                          ),
                        );
                        setNotice(
                          `${service.name} ${active ? 'ativado' : 'desativado'} na página.`,
                        );
                      }}
                    />
                    {ordering ? (
                      <span className="reorder-buttons">
                        <button
                          aria-label={`Mover ${service.name} para cima`}
                          disabled={index === 0}
                          onClick={() => reorder(index, -1)}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          aria-label={`Mover ${service.name} para baixo`}
                          disabled={index === services.length - 1}
                          onClick={() => reorder(index, 1)}
                        >
                          <ArrowDown size={13} />
                        </button>
                      </span>
                    ) : (
                      <button
                        className="service-grip"
                        aria-label={`Ordenar ${service.name}`}
                        onClick={() => setOrdering(true)}
                      >
                        <GripVertical size={16} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            <Button
              variant="secondary"
              className="add-service-button w-full"
              onClick={() => setEditing('new')}
            >
              <Plus size={17} />
              Adicionar novo serviço
            </Button>
            <p role="status" className="inline-status">
              {notice}
            </p>
          </section>
        </div>
        <aside className="provider-desktop-note">
          <span className="large-asterisk">✳</span>
          <h2>
            Seu talento merece
            <br />
            ser encontrado.
          </h2>
          <p>
            Deixe seus serviços claros, atualizados e com a sua cara. É o primeiro passo para um bom
            encontro.
          </p>
          <div>
            <Eye size={20} />
            <span>Os serviços ativos aparecem para seus clientes.</span>
          </div>
          <div>
            <Store size={20} />
            <span>Preços e duração ajudam cada pessoa a escolher seu cuidado.</span>
          </div>
          <Link className="text-link" to="/prestador/pagina">
            Dar um toque na minha página <ChevronRight size={15} />
          </Link>
        </aside>
      </div>
      {editing && (
        <ServiceEditor
          service={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(service) => {
            saveServices(
              editing === 'new'
                ? [...services, service]
                : services.map((item) => (item.id === service.id ? service : item)),
            );
            setNotice('Serviço salvo na demonstração.');
            setEditing(null);
          }}
        />
      )}
      {menu && (
        <Modal title="Sua página de serviços" onClose={() => setMenu(false)}>
          <div className="settings-list">
            <Link to="/prestador/pagina">
              <Store size={19} />
              Editar minha página
              <ChevronRight size={17} />
            </Link>
            <Link to="/servico/studio-marina">
              <Eye size={19} />
              Visualizar como cliente
              <ChevronRight size={17} />
            </Link>
            <button
              onClick={() => {
                setOrdering(true);
                setMenu(false);
              }}
            >
              <GripVertical size={19} />
              Ordenar serviços
              <ChevronRight size={17} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function ServiceEditor({
  service,
  onClose,
  onSave,
}: {
  service: StudioService | null;
  onClose: () => void;
  onSave: (service: StudioService) => void;
}) {
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [price, setPrice] = useState(service?.price.toString() ?? '');
  const [duration, setDuration] = useState(
    service ? durationMinutes(service.duration).toString() : '',
  );
  return (
    <Modal title={service ? 'Editar serviço' : 'Um novo cuidado na sua página'} onClose={onClose}>
      <form
        className="provider-form"
        onSubmit={(event) => {
          event.preventDefault();
          const mins = Number(duration);
          onSave({
            id: service?.id ?? crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            duration:
              mins >= 60
                ? `${Math.floor(mins / 60)}h${mins % 60 ? String(mins % 60).padStart(2, '0') : ''}`
                : `${mins} min`,
            active: service?.active ?? true,
          });
        }}
      >
        <Field
          label="Nome do serviço"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
          pattern=".*\S.*"
          maxLength={70}
          placeholder="Ex.: Manicure em gel"
        />
        <Field
          label="Descrição do serviço"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          pattern=".*\S.*"
          maxLength={150}
          placeholder="Conte o que está incluído"
        />
        <div className="form-two-columns">
          <Field
            label="Preço (R$)"
            type="number"
            min="1"
            max="9999"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Field
            label="Duração (minutos)"
            type="number"
            min="10"
            max="480"
            step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Salvar serviço
        </Button>
        <p className="demo-form-note">Alterações disponíveis apenas nesta sessão.</p>
      </form>
    </Modal>
  );
}
