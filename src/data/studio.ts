import type { Service } from './catalog';
import { professionals } from './catalog';

export interface StudioService extends Service {
  active: boolean;
}
export interface StudioPage {
  name: string;
  description: string;
  address: string;
  cover: string;
  avatar: string;
  days: number[];
  opensAt: string;
  closesAt: string;
}
export type PaymentId = 'credit' | 'pix' | 'debit' | 'cash' | 'terminal';
export interface PaymentOption {
  id: PaymentId;
  name: string;
  description: string;
  enabled: boolean;
  online: boolean;
}
export interface TimeBlock {
  id: string;
  date: string;
  start: string;
  end: string;
  reason: string;
}
export interface StudioAppointment {
  id: string;
  customerName: string;
  serviceId: string;
  date: string;
  time: string;
}
export const studioId = 'studio-marina';
const marina = professionals.find((pro) => pro.id === studioId)!;
export const initialStudioPage: StudioPage = {
  name: marina.studio,
  description: marina.description,
  address: 'Rua das Flores, 218 · Pinheiros',
  cover: marina.cover,
  avatar: marina.avatar,
  days: [1, 2, 3, 4, 5, 6],
  opensAt: '09:00',
  closesAt: '19:00',
};
export const initialStudioServices: StudioService[] = [
  ...marina.services.map((service) => ({ ...service, active: true })),
  {
    id: 'nail-art',
    name: 'Nail art personalizada',
    description: 'Arte e detalhes feitos para você',
    price: 35,
    duration: '40 min',
    active: false,
  },
];
export const initialPaymentOptions: PaymentOption[] = [
  {
    id: 'credit',
    name: 'Cartão de crédito',
    description: 'Receba em até 2 dias úteis · taxa 4,9%',
    enabled: true,
    online: true,
  },
  {
    id: 'pix',
    name: 'Pix',
    description: 'Confirmação imediata · taxa 1,5%',
    enabled: true,
    online: true,
  },
  {
    id: 'debit',
    name: 'Cartão de débito',
    description: 'Receba em 1 dia útil · taxa 2,9%',
    enabled: false,
    online: true,
  },
  {
    id: 'cash',
    name: 'Dinheiro',
    description: 'Cobrança feita por você no atendimento',
    enabled: true,
    online: false,
  },
  {
    id: 'terminal',
    name: 'Maquininha própria',
    description: 'Crédito, débito ou aproximação',
    enabled: true,
    online: false,
  },
];
export const sampleStudioAppointments: StudioAppointment[] = [
  {
    id: 'camila-demo',
    customerName: 'Camila Freitas',
    serviceId: 'tradicional',
    date: '2026-10-17',
    time: '09:00',
  },
  {
    id: 'juliana-demo',
    customerName: 'Juliana Lima',
    serviceId: 'tradicional',
    date: '2026-10-17',
    time: '17:15',
  },
];
export const initialBlocks: TimeBlock[] = [
  { id: 'intervalo-demo', date: '2026-10-17', start: '12:00', end: '13:00', reason: 'Intervalo' },
];
