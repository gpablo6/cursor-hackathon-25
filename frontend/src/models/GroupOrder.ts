import type { Person } from './Person';

export interface GroupOrder {
  groupName: string;
  people: Person[];
}