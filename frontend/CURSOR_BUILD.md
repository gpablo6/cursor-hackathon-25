🫓 PupusApp – React Frontend Build Spec
1. Tech Stack (MANDATORY)

React 18

TypeScript

Vite

TailwindCSS

State management: React Context + useReducer

No backend (frontend-only, in-memory state)

No auth

Ignore pricing / money logic (optional placeholder only)

2. App Goal

Build a mobile-first web app to simplify pupusa ordering in El Salvador by:

Creating a group order

Splitting the order by person

Letting each person add pupusas (masa + relleno + cantidad)

Generating a kitchen-friendly summary aggregated by type

The app flow is linear and simple:

Crear grupo

Agregar pupusas por persona

Ver resumen para cocina

3. Routing Strategy

Use React Router with 3 routes:

/            → Group creation
/order       → Person ordering
/summary     → Kitchen summary

4. Folder Structure (REQUIRED)
src/
│
├── app/
│   ├── App.tsx
│   └── routes.tsx
│
├── models/
│   ├── Pupusa.ts
│   ├── Person.ts
│   └── GroupOrder.ts
│
├── state/
│   ├── OrderContext.tsx
│   └── orderReducer.ts
│
├── features/
│   ├── group/
│   │   └── GroupForm.tsx
│   │
│   ├── person/
│   │   ├── PersonList.tsx
│   │   ├── PersonCard.tsx
│   │   └── PupusaForm.tsx
│   │
│   └── summary/
│       ├── KitchenSummary.tsx
│       ├── SummaryTotals.tsx
│       └── SummaryList.tsx
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Counter.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       └── Page.tsx
│
├── index.css
└── main.tsx

5. Domain Models (SOURCE OF TRUTH)
Pupusa
export type DoughType = 'maiz' | 'arroz';

export type Filling =
  | 'queso'
  | 'frijoles_con_queso'
  | 'revueltas'
  | 'chicharron'
  | 'loroco'
  | 'ayote';

export interface Pupusa {
  id: string;
  dough: DoughType;
  filling: Filling;
  quantity: number;
}

Person
export interface Person {
  id: string;
  name: string;
  pupusas: Pupusa[];
}

GroupOrder
export interface GroupOrder {
  groupName: string;
  people: Person[];
}

6. Global State Rules

There is only one active GroupOrder

Stored in React Context

Mutations only via reducer actions

Reducer Actions (minimum)
CREATE_GROUP
RENAME_PERSON
ADD_PUPUSA
REMOVE_PUPUSA
RESET_ORDER

7. Screen Specifications
🟠 Screen 1: Group Creation (/)

UI

App logo + title

Input: Group name

Counter: Number of people

Button: “Comenzar Pedido”

Behavior

Creates GroupOrder

Auto-generates Person[] as:

Persona 1, Persona 2, …

Navigates to /order

🟠 Screen 2: Person Ordering (/order)

Layout

Header with:

Group name

Number of people

Back button

“Nuevo” (reset)

For each person

PersonCard

Editable name

List of pupusas (if any)

“Agregar Pupusa” button

🧩 Pupusa Form (inline or modal)

Controls

Tipo de masa: Maíz / Arroz

Relleno (selectable cards)

Cantidad (+ / -)

Buttons:

Cancelar

Agregar

Rules

Quantity ≥ 1

Each “Agregar” creates a Pupusa entry

🟢 Screen 3: Kitchen Summary (/summary)

Purpose
This screen is read-only.

UI

Totals by masa (Maíz / Arroz)

Aggregated list:

“Maíz – Queso: 2”

“Arroz – Revueltas: 3”

Total pupusas count

Aggregation Logic

Flatten all people’s pupusas

Group by dough + filling

Sum quantities

8. Tailwind Guidelines

Mobile-first

Use soft shadows, rounded cards

Orange (#F97316) for actions

Green for summary / confirmation

No inline styles

No CSS modules

9. Explicit Non-Goals (DO NOT BUILD)

Authentication

Backend / API

Payments

Persistence

User accounts

10. Expected Outcome

By following this spec, the app should:

Match the provided Lovable UI screens

Be easy to extend later

Be readable and maintainable

Avoid overengineering