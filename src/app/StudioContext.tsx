import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { professionals } from '../data/catalog';
import {
  initialBlocks,
  initialPaymentOptions,
  initialStudioPage,
  initialStudioServices,
  sampleStudioAppointments,
  studioId,
} from '../data/studio';
import type { PaymentOption, StudioPage, StudioService, TimeBlock } from '../data/studio';
import { useDemo } from './DemoContext';
import { endTime, minutes, overlaps, weekday } from '../lib/schedule';

interface StudioState {
  page: StudioPage;
  savePage: (page: StudioPage) => void;
  services: StudioService[];
  saveServices: (services: StudioService[]) => void;
  paymentOptions: PaymentOption[];
  savePayments: (options: PaymentOption[]) => void;
  blocks: TimeBlock[];
  addBlock: (block: Omit<TimeBlock, 'id'>) => void;
  removeBlock: (id: string) => void;
  sampleAppointments: typeof sampleStudioAppointments;
  cancelSampleAppointment: (id: string) => void;
  available: (date: string, time: string, duration: string, professionalId?: string) => boolean;
}
const StudioContext = createContext<StudioState | null>(null);
export function StudioProvider({ children }: { children: ReactNode }) {
  const { allAppointments: appointments } = useDemo();
  const [page, savePage] = useState(initialStudioPage);
  const [services, saveServices] = useState(initialStudioServices);
  const [paymentOptions, savePayments] = useState(initialPaymentOptions);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [sampleAppointments, setSampleAppointments] = useState(sampleStudioAppointments);
  const cancelSampleAppointment = (id: string) =>
    setSampleAppointments((current) => current.filter((item) => item.id !== id));
  const addBlock = (block: Omit<TimeBlock, 'id'>) =>
    setBlocks((current) => [...current, { ...block, id: crypto.randomUUID() }]);
  const removeBlock = (id: string) =>
    setBlocks((current) => current.filter((block) => block.id !== id));
  const available = (date: string, time: string, duration: string, professionalId = studioId) => {
    const end = endTime(time, duration);
    const isMarina = professionalId === studioId;
    if (
      !date ||
      !time ||
      (isMarina &&
        (!page.days.includes(weekday(date)) ||
          minutes(time) < minutes(page.opensAt) ||
          minutes(end) > minutes(page.closesAt)))
    )
      return false;
    if (
      isMarina &&
      blocks.some((block) => block.date === date && overlaps(time, end, block.start, block.end))
    )
      return false;
    if (
      isMarina &&
      sampleAppointments.some(
        (item) =>
          item.date === date &&
          overlaps(
            time,
            end,
            item.time,
            endTime(
              item.time,
              services.find((service) => service.id === item.serviceId)?.duration ?? '50 min',
            ),
          ),
      )
    )
      return false;
    return !appointments.some(
      (item) =>
        item.professionalId === professionalId &&
        item.date === date &&
        overlaps(
          time,
          end,
          item.time,
          endTime(
            item.time,
            item.serviceSnapshot?.duration ??
              (isMarina
                ? services
                : professionals.find((pro) => pro.id === professionalId)?.services
              )?.find((service) => service.id === item.serviceId)?.duration ??
              '1h',
          ),
        ),
    );
  };
  return (
    <StudioContext.Provider
      value={{
        page,
        savePage,
        services,
        saveServices,
        paymentOptions,
        savePayments,
        blocks,
        addBlock,
        removeBlock,
        available,
        sampleAppointments,
        cancelSampleAppointment,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}
export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio precisa de StudioProvider');
  return context;
}
export function useCatalog() {
  const { page, services } = useStudio();
  return useMemo(
    () =>
      professionals.map((pro) =>
        pro.id === studioId
          ? {
              ...pro,
              studio: page.name,
              address: page.address,
              description: page.description,
              cover: page.cover,
              avatar: page.avatar,
              title: services.find((service) => service.active)?.name ?? pro.title,
              services: services.filter((service) => service.active),
            }
          : pro,
      ),
    [page, services],
  );
}
