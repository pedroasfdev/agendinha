export type CategoryId = 'unhas' | 'cabelo' | 'barbearia' | 'bem-estar' | 'estetica';
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}
export interface Professional {
  id: string;
  name: string;
  studio: string;
  category: CategoryId;
  title: string;
  specialty: string;
  experience: string;
  image: string;
  avatar: string;
  cover: string;
  neighborhood: string;
  address: string;
  distance: number;
  rating: number;
  reviews: number;
  availableToday: boolean;
  description: string;
  services: Service[];
}

export const professionals: Professional[] = [
  {
    id: 'studio-marina',
    name: 'Marina Costa',
    studio: 'Studio Marina',
    category: 'unhas',
    title: 'Manicure em gel',
    specialty: 'Nail designer',
    experience: '6 anos de experiência',
    image: '/images/nails.jpg',
    avatar: '/images/marina.jpg',
    cover: '/images/salon.jpg',
    neighborhood: 'Pinheiros',
    address: 'Rua dos Pinheiros, 870 · Pinheiros, São Paulo',
    distance: 1.2,
    rating: 4.9,
    reviews: 128,
    availableToday: true,
    description:
      'Um espaço acolhedor para cuidar das suas unhas com técnica, higiene e um atendimento sem pressa.',
    services: [
      {
        id: 'gel',
        name: 'Manicure em gel',
        description: 'Preparação, esmaltação e acabamento',
        price: 85,
        duration: '1h15',
      },
      {
        id: 'tradicional',
        name: 'Manicure tradicional',
        description: 'Cuticulagem e esmaltação',
        price: 55,
        duration: '50 min',
      },
      {
        id: 'spa',
        name: 'Spa das mãos',
        description: 'Esfoliação e hidratação profunda',
        price: 42,
        duration: '30 min',
      },
    ],
  },
  {
    id: 'atelie-21',
    name: 'Lívia Rocha',
    studio: 'Ateliê 21',
    category: 'cabelo',
    title: 'Corte + finalização',
    specialty: 'Hair stylist',
    experience: '8 anos de experiência',
    image: '/images/hair.jpg',
    avatar: '/images/marina.jpg',
    cover: '/images/salon.jpg',
    neighborhood: 'Vila Madalena',
    address: 'Rua Harmonia, 210 · Vila Madalena, São Paulo',
    distance: 2.4,
    rating: 4.9,
    reviews: 128,
    availableToday: true,
    description:
      'Seu cabelo, do seu jeito. Cortes personalizados e cuidado com cada detalhe em um ambiente leve e cheio de personalidade.',
    services: [
      {
        id: 'corte',
        name: 'Corte + finalização',
        description: 'Lavagem, corte e finalização',
        price: 110,
        duration: '1h',
      },
      {
        id: 'escova',
        name: 'Escova',
        description: 'Lavagem e escova modelada',
        price: 70,
        duration: '45 min',
      },
      {
        id: 'hidratacao',
        name: 'Hidratação profunda',
        description: 'Tratamento personalizado para seus fios',
        price: 90,
        duration: '50 min',
      },
    ],
  },
  {
    id: 'barbearia-raiz',
    name: 'Rafael Oliveira',
    studio: 'Barbearia Raiz',
    category: 'barbearia',
    title: 'Corte + barba',
    specialty: 'Barbeiro',
    experience: '10 anos de experiência',
    image: '/images/barber.jpg',
    avatar: '/images/barber.jpg',
    cover: '/images/barber.jpg',
    neighborhood: 'Pinheiros',
    address: 'Rua Teodoro Sampaio, 540 · Pinheiros, São Paulo',
    distance: 0.8,
    rating: 4.8,
    reviews: 96,
    availableToday: true,
    description:
      'A tradição da barbearia com um olhar atual. Um bom corte, uma conversa leve e um tempo só seu.',
    services: [
      {
        id: 'combo',
        name: 'Corte + barba',
        description: 'Corte personalizado e barba com toalha quente',
        price: 95,
        duration: '1h',
      },
      {
        id: 'corte',
        name: 'Corte masculino',
        description: 'Corte na tesoura ou máquina e finalização',
        price: 60,
        duration: '40 min',
      },
      {
        id: 'barba',
        name: 'Barba completa',
        description: 'Modelagem e hidratação da barba',
        price: 45,
        duration: '30 min',
      },
    ],
  },
  {
    id: 'espaco-sereno',
    name: 'Camila Alves',
    studio: 'Espaço Sereno',
    category: 'bem-estar',
    title: 'Massagem relaxante',
    specialty: 'Massoterapeuta',
    experience: '5 anos de experiência',
    image: '/images/wellness.jpg',
    avatar: '/images/marina.jpg',
    cover: '/images/wellness.jpg',
    neighborhood: 'Jardins',
    address: 'Alameda Jaú, 320 · Jardins, São Paulo',
    distance: 2.8,
    rating: 4.9,
    reviews: 74,
    availableToday: false,
    description:
      'Desacelere e reconecte-se. Um refúgio de tranquilidade com terapias pensadas para o seu bem-estar.',
    services: [
      {
        id: 'relaxante',
        name: 'Massagem relaxante',
        description: 'Relaxamento e alívio das tensões',
        price: 140,
        duration: '1h',
      },
      {
        id: 'pedras',
        name: 'Massagem com pedras quentes',
        description: 'Equilíbrio e relaxamento profundo',
        price: 180,
        duration: '1h15',
      },
    ],
  },
  {
    id: 'pele-leve',
    name: 'Juliana Santos',
    studio: 'Pele Leve',
    category: 'estetica',
    title: 'Limpeza de pele',
    specialty: 'Esteticista',
    experience: '7 anos de experiência',
    image: '/images/wellness.jpg',
    avatar: '/images/marina.jpg',
    cover: '/images/salon.jpg',
    neighborhood: 'Pinheiros',
    address: 'Rua Fradique Coutinho, 450 · Pinheiros, São Paulo',
    distance: 1.7,
    rating: 4.8,
    reviews: 83,
    availableToday: true,
    description:
      'Cuidado gentil e personalizado para a sua pele. Um momento de renovação com produtos e técnicas escolhidos para você.',
    services: [
      {
        id: 'limpeza',
        name: 'Limpeza de pele',
        description: 'Higienização, extração e hidratação',
        price: 120,
        duration: '1h',
      },
      {
        id: 'facial',
        name: 'Hidratação facial',
        description: 'Nutrição profunda e máscara calmante',
        price: 85,
        duration: '40 min',
      },
    ],
  },
];
