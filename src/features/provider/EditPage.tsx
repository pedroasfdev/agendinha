import { useRef, useState } from 'react';
import { ArrowLeft, Camera, Check, Clock3, Eye, ImagePlus, MapPin, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudio } from '../../app/StudioContext';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { ProviderHeading } from './ProviderHeading';
import { minutes } from '../../lib/schedule';

const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
export function ProviderEditPage() {
  const { page, savePage } = useStudio();
  const [draft, setDraft] = useState(page);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const upload = (file: File | undefined, field: 'cover' | 'avatar') => {
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) ||
      file.size > 4 * 1024 * 1024
    ) {
      setError('Escolha uma imagem JPG, PNG, WebP ou AVIF de até 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({ ...current, [field]: String(reader.result) }));
      setError('');
      setNotice('');
    };
    reader.onerror = () => setError('Não foi possível abrir essa imagem. Tente outra.');
    reader.readAsDataURL(file);
  };
  const change = <K extends keyof typeof draft>(field: K, value: (typeof draft)[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setNotice('');
    setError('');
  };
  return (
    <div className="provider-edit-page">
      <ProviderHeading
        title="Editar minha página"
        description="Informações visíveis para clientes"
        step="10 · Editar página"
        action={
          <Link to="/prestador/servicos" className="icon-button" aria-label="Voltar para serviços">
            <ArrowLeft size={20} />
          </Link>
        }
      />
      <div className="provider-edit-grid">
        <form
          className="provider-page-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.days.length) {
              setError('Selecione pelo menos um dia de atendimento.');
              return;
            }
            if (minutes(draft.opensAt) >= minutes(draft.closesAt)) {
              setError('O horário de encerramento deve ser depois da abertura.');
              return;
            }
            savePage({
              ...draft,
              name: draft.name.trim(),
              address: draft.address.trim(),
              description: draft.description.trim(),
            });
            setError('');
            setNotice('Sua página foi atualizada nesta demonstração.');
          }}
        >
          <div className="page-cover-editor">
            <img src={draft.cover} alt="Capa da sua página" />
            <button type="button" onClick={() => coverInput.current?.click()}>
              <Camera size={15} />
              Trocar capa
            </button>
            <div className="page-avatar-editor">
              <img src={draft.avatar} alt="Foto do prestador" />
              <button
                type="button"
                aria-label="Trocar foto de perfil"
                onClick={() => avatarInput.current?.click()}
              >
                <Camera size={13} />
              </button>
            </div>
          </div>
          <input
            hidden
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => upload(e.target.files?.[0], 'cover')}
          />
          <input
            hidden
            ref={avatarInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => upload(e.target.files?.[0], 'avatar')}
          />
          <Field
            label="Nome da página"
            icon={<Store size={17} />}
            value={draft.name}
            onChange={(e) => change('name', e.target.value)}
            required
            minLength={3}
            pattern=".*\S.*"
            maxLength={60}
          />
          <label className="textarea-field">
            <span>Descrição</span>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => change('description', e.target.value)}
              required
              minLength={10}
              maxLength={400}
            />
          </label>
          <Field
            label="Local de atendimento"
            icon={<MapPin size={17} />}
            value={draft.address}
            onChange={(e) => change('address', e.target.value)}
            required
            minLength={5}
            pattern=".*\S.*"
            maxLength={160}
          />
          <fieldset className="working-days">
            <legend>Dias e horários de atendimento</legend>
            <div>
              {dayNames.map((label, index) => {
                const day = (index + 1) % 7;
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={draft.days.includes(day)}
                    className={draft.days.includes(day) ? 'selected' : ''}
                    onClick={() =>
                      change(
                        'days',
                        draft.days.includes(day)
                          ? draft.days.filter((value) => value !== day)
                          : [...draft.days, day],
                      )
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="form-two-columns time-fields">
            <Field
              label="Abertura"
              type="time"
              icon={<Clock3 size={16} />}
              required
              value={draft.opensAt}
              onChange={(e) => change('opensAt', e.target.value)}
            />
            <Field
              label="Encerramento"
              type="time"
              icon={<Clock3 size={16} />}
              required
              value={draft.closesAt}
              onChange={(e) => change('closesAt', e.target.value)}
            />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            {notice ? (
              <>
                <Check size={18} />
                Alterações salvas
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
          <p className="inline-status" role="status">
            {notice}
          </p>
        </form>
        <aside className="page-preview">
          <div className="preview-label">
            <Eye size={16} />
            PRÉVIA DA SUA PÁGINA
          </div>
          <img className="preview-cover" src={draft.cover} alt="" />
          <div className="preview-content">
            <img src={draft.avatar} alt="" />
            <h2>{draft.name || 'Nome da sua página'}</h2>
            <p>{draft.description || 'Uma descrição com a sua cara.'}</p>
            <span>
              <MapPin size={14} />
              {draft.address || 'Local de atendimento'}
            </span>
            <Link className="button button-secondary w-full" to="/servico/studio-marina">
              Visualizar página publicada <Eye size={16} />
            </Link>
          </div>
          <div className="preview-note">
            <ImagePlus size={19} />
            <p>
              Boas fotos contam sua história. Escolha imagens que mostrem o cuidado do seu espaço.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
