/**
 * Predefined beverages common in Salvadoran pupuserías.
 * Stored as a flat list; categories are internal only and not shown in the UI.
 */
const BEVERAGES_BY_CATEGORY: Record<string, string[]> = {
  sodas: [
    'Coca-Cola',
    'Coca-Cola Light',
    'Pepsi',
    'Mirinda',
    'Fanta Naranja',
    'Fresca',
    'Sprite',
    '7Up',
    'Kolashampan',
    'Tropical',
    'Canada Dry',
  ],
  beers: [
    'Pilsener',
    'Suprema',
    'Golden',
    'Regia',
    'Corona',
    'Modelo Especial',
    'Budweiser',
    'Michelob Ultra',
  ],
  naturalJuices: [
    'Jugo de naranja',
    'Jugo de piña',
    'Jugo de mora',
    'Jugo de tamarindo',
    'Jugo de maracuyá',
    'Jugo de mango',
    'Jugo de guayaba',
    'Jugo de fresa',
    'Jugo de limón',
  ],
  traditional: [
    'Horchata',
    'Ensalada',
    'Cebada',
    'Tamarindo',
    'Jamaica',
    'Chan',
    'Arrayán',
  ],
  smoothies: [
    'Licuado de banano',
    'Licuado de fresa',
    'Licuado de papaya',
    'Licuado de mango',
    'Licuado de piña',
    'Licuado de zapote',
    'Licuado de guineo con avena',
    'Licuado de chocolate',
  ],
  hotDrinks: [
    'Café negro',
    'Café con leche',
    'Chocolate caliente',
    'Atole de elote',
    'Atole de piña',
    'Atole de maíz tostado',
  ],
  water: [
    'Agua pura',
    'Agua embotellada',
    'Agua con gas',
  ],
};

/** Flat list of all beverage names for selection (no category headers in UI). */
export const BEVERAGE_NAMES: string[] = Object.values(BEVERAGES_BY_CATEGORY).flat();
