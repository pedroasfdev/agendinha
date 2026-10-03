import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Service } from '../data/catalog';
import { professionals } from '../data/catalog';
import type { PaymentId } from '../data/studio';

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
}
export interface Appointment {
  id: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  serviceSnapshot?: Service;
  paidTotal?: number;
  paymentMethod?: PaymentId;
  customerName?: string;
  forOtherClient?: boolean;
}
interface DemoState {
  user: DemoUser;
  updateUser: (user: DemoUser) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  appointments: Appointment[];
  allAppointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  cancelAppointment: (id: string) => void;
}
const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [user, updateUser] = useState<DemoUser>({
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 98765-4321',
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allAppointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'demo-appointment',
      professionalId: 'studio-marina',
      serviceId: 'gel',
      date: '2026-10-17',
      time: '14:30',
      serviceSnapshot: professionals[0].services[0],
      paidTotal: 89.9,
      paymentMethod: 'credit',
    },
  ]);
  const appointments = allAppointments.filter((item) => !item.forOtherClient);
  const toggleFavorite = (id: string) =>
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const created = { ...appointment, id: crypto.randomUUID() };
    setAppointments((current) =>
      [...current, created].sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
      ),
    );
    return created;
  };
  const cancelAppointment = (id: string) =>
    setAppointments((current) => current.filter((item) => item.id !== id));
  return (
    <DemoContext.Provider
      value={{
        user,
        updateUser,
        favorites,
        toggleFavorite,
        appointments,
        allAppointments,
        addAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo precisa de DemoProvider');
  return context;
}
