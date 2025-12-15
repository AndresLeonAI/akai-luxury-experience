export interface MenuItem {
  name: string;
  description: string;
  price: number;
  featured?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  jpTitle?: string;
  subtitle?: string;
  items: MenuItem[];
}

export type ReservationStep = 'selection' | 'details' | 'confirmation';
