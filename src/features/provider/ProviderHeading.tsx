import type { ReactNode } from 'react';
import { ViewBadge } from '../../components/ui/ViewBadge';

export function ProviderHeading({
  title,
  description,
  step,
  action,
}: {
  title: string;
  description: string;
  step: string;
  action?: ReactNode;
}) {
  return (
    <>
      <ViewBadge provider step={step} />
      <div className="provider-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </div>
    </>
  );
}
