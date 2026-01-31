export type DoughType = 'maiz' | 'arroz';

export type PupusaSize = 'pequena' | 'normal' | 'grande';

// Base fillings (no cheese variants) - EXACT ORDER REQUIRED
export type Filling =
  | 'frijol'          // Frijol
  | 'revueltas'       // Revueltas (fixed: pork + bean + cheese, cannot add extra cheese)
  | 'queso'           // Queso (cheese-only pupusa, cannot add extra cheese)
  | 'jalapeno'        // Jalapeño
  | 'chicharron'      // Chicharrón
  | 'cochinito'       // Cochinito
  | 'chorizo'         // Chorizo
  | 'loroco'          // Loroco
  | 'papelillo'       // Papelillo
  | 'mora'            // Mora
  | 'mango'           // Mango
  | 'camaron'         // Camarón
  | 'pescado'         // Pescado
  | 'ajo'             // Ajo
  | 'jamon'           // Jamón
  | 'pepperoni'       // Pepperoni
  | 'hongo'           // Hongo / Champiñón
  | 'loca'            // Loca (mixed, already includes cheese, cannot add extra cheese)
  | 'pollo'           // Pollo
  | 'carne'           // Carne
  | 'ayote'           // Ayote
  | 'pina'            // Piña
  | 'jocote'          // Jocote
  | 'garrobo'         // Garrobo
  | 'cusuco'          // Cusuco
  | 'conejo';         // Conejo

export interface Pupusa {
  id: string;
  dough: DoughType;
  filling: Filling;
  withCheese: boolean;  // Optional cheese (disabled for 'queso' and 'revueltas')
  size: PupusaSize;
  quantity: number;
  priceUSD: number;     // Price in USD (manual input, default $0.50)
}