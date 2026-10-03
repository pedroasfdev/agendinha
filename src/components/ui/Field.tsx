import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}
export function Field({ label, icon, error, type, id, ...props }: Props) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <div className={`field-control ${error ? 'field-invalid' : ''}`}>
        {icon && <span className="field-icon">{icon}</span>}
        <input
          id={fieldId}
          type={type === 'password' && visible ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="field-eye"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${fieldId}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
