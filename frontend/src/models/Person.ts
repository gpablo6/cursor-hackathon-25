import type { Beverage } from './Beverage';
import type { Pupusa } from './Pupusa';

export interface Person {
  id: string;
  name: string;
  pupusas: Pupusa[];
  beverages: Beverage[];
}