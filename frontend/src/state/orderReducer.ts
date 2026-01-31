import type { Beverage } from '../models/Beverage';
import type { GroupOrder } from '../models/GroupOrder';
import type { Person } from '../models/Person';
import type { Pupusa } from '../models/Pupusa';

export type OrderAction =
  | { type: 'CREATE_GROUP'; payload: { groupName: string; peopleCount: number } }
  | { type: 'UPDATE_GROUP'; payload: { groupName: string } }
  | { type: 'ADD_PERSON' }
  | { type: 'RENAME_PERSON'; payload: { personId: string; newName: string } }
  | { type: 'ADD_PUPUSA'; payload: { personId: string; pupusa: Omit<Pupusa, 'id'> } }
  | { type: 'REMOVE_PUPUSA'; payload: { personId: string; pupusaId: string } }
  | { type: 'ADD_BEVERAGE'; payload: { personId: string; beverage: Omit<Beverage, 'id'> } }
  | { type: 'REMOVE_BEVERAGE'; payload: { personId: string; beverageId: string } }
  | { type: 'RESET_ORDER' };

export const initialState: GroupOrder | null = null;

export function orderReducer(state: GroupOrder | null, action: OrderAction): GroupOrder | null {
  switch (action.type) {
    case 'CREATE_GROUP': {
      const { groupName, peopleCount } = action.payload;
      const people: Person[] = Array.from({ length: peopleCount }, (_, i) => ({
        id: `person-${i + 1}`,
        name: `Persona ${i + 1}`,
        pupusas: [],
        beverages: [],
      }));

      return {
        groupName,
        people,
      };
    }

    case 'UPDATE_GROUP': {
      if (!state) return state;
      const { groupName } = action.payload;
      return { ...state, groupName: groupName.trim() };
    }

    case 'ADD_PERSON': {
      if (!state) return state;
      if (state.people.length >= 20) return state;
      const n = state.people.length + 1;
      const newPerson: Person = {
        id: `person-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: `Persona ${n}`,
        pupusas: [],
        beverages: [],
      };
      return { ...state, people: [...state.people, newPerson] };
    }

    case 'RENAME_PERSON': {
      if (!state) return state;
      const { personId, newName } = action.payload;

      return {
        ...state,
        people: state.people.map(person =>
          person.id === personId
            ? { ...person, name: newName }
            : person
        ),
      };
    }

    case 'ADD_PUPUSA': {
      if (!state) return state;
      const { personId, pupusa } = action.payload;

      return {
        ...state,
        people: state.people.map(person => {
          if (person.id !== personId) return person;

          // Misma combinación = mismo relleno, masa, tamaño y con/sin queso
          const sameCombo = (p: typeof pupusa) =>
            p.dough === pupusa.dough &&
            p.filling === pupusa.filling &&
            p.size === pupusa.size &&
            p.withCheese === pupusa.withCheese;

          const existingIndex = person.pupusas.findIndex(sameCombo);

          if (existingIndex >= 0) {
            // Ya existe esa combinación: solo actualizar cantidad y precio (no sumar)
            const updatedPupusas = [...person.pupusas];
            updatedPupusas[existingIndex] = {
              ...updatedPupusas[existingIndex],
              quantity: pupusa.quantity,
              priceUSD: pupusa.priceUSD,
            };
            return { ...person, pupusas: updatedPupusas };
          }

          // Combinación nueva: agregar como nueva pupusa
          const newPupusa: Pupusa = {
            ...pupusa,
            id: `pupusa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          return { ...person, pupusas: [...person.pupusas, newPupusa] };
        }),
      };
    }

    case 'REMOVE_PUPUSA': {
      if (!state) return state;
      const { personId, pupusaId } = action.payload;

      return {
        ...state,
        people: state.people.map(person =>
          person.id === personId
            ? { ...person, pupusas: person.pupusas.filter(pupusa => pupusa.id !== pupusaId) }
            : person
        ),
      };
    }

    case 'ADD_BEVERAGE': {
      if (!state) return state;
      const { personId, beverage } = action.payload;

      return {
        ...state,
        people: state.people.map(person => {
          if (person.id !== personId) return person;
          const newBeverage: Beverage = {
            ...beverage,
            id: `beverage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          return { ...person, beverages: [...person.beverages, newBeverage] };
        }),
      };
    }

    case 'REMOVE_BEVERAGE': {
      if (!state) return state;
      const { personId, beverageId } = action.payload;

      return {
        ...state,
        people: state.people.map(person =>
          person.id === personId
            ? { ...person, beverages: person.beverages.filter(b => b.id !== beverageId) }
            : person
        ),
      };
    }

    case 'RESET_ORDER': {
      return null;
    }

    default:
      return state;
  }
}