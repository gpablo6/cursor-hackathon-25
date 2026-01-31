# 🏗️ Arquitectura de PupusApp

## Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Entry Point"
        A[main.tsx] --> B[OrderProvider]
        B --> C[RouterProvider]
    end

    subgraph "Routing Layer"
        C --> D[routes.tsx]
        D --> E["/ - GroupForm"]
        D --> F["/order - PersonList"]
        D --> G["/summary - KitchenSummary"]
    end

    subgraph "State Management"
        B --> H[OrderContext]
        H --> I[orderReducer]
        I --> J[GroupOrder State]
    end

    subgraph "Domain Models"
        J --> K[GroupOrder]
        K --> L[Person[]]
        L --> M[Pupusa[]]
        N[DoughType] --> M
        O[Filling] --> M
    end

    subgraph "Features"
        E --> P[GroupForm]
        F --> Q[PersonList]
        F --> R[PersonCard]
        R --> S[PupusaForm Modal]
        G --> T[KitchenSummary]
        T --> U[SummaryTotals]
        T --> V[SummaryList]
    end

    subgraph "Shared Components"
        P --> W[Button]
        P --> X[Card]
        P --> Y[Counter]
        R --> Z[Modal]
        Q --> AA[Header]
        T --> AA
    end

    subgraph "Actions"
        I --> AB[CREATE_GROUP]
        I --> AC[RENAME_PERSON]
        I --> AD[ADD_PUPUSA]
        I --> AE[REMOVE_PUPUSA]
        I --> AF[RESET_ORDER]
    end

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#fff4e1
    style H fill:#ffe1f5
    style I fill:#ffe1f5
    style J fill:#e1ffe1
```

## Estructura de Carpetas

```
src/
├── app/                    # Configuración de la aplicación
│   ├── App.tsx            # Componente raíz (no usado actualmente)
│   └── routes.tsx         # Configuración de rutas React Router
│
├── models/                 # Modelos de dominio (TypeScript)
│   ├── Pupusa.ts          # Tipo: DoughType, Filling, Interface Pupusa
│   ├── Person.ts          # Interface Person
│   └── GroupOrder.ts      # Interface GroupOrder
│
├── state/                 # Gestión de estado global
│   ├── OrderContext.tsx  # React Context Provider
│   └── orderReducer.ts    # Reducer con acciones
│
├── features/              # Features organizados por pantalla
│   ├── group/
│   │   └── GroupForm.tsx  # Pantalla 1: Crear grupo
│   │
│   ├── person/
│   │   ├── PersonList.tsx # Pantalla 2: Lista de personas
│   │   ├── PersonCard.tsx # Tarjeta individual de persona
│   │   └── PupusaForm.tsx # Modal para agregar pupusas
│   │
│   └── summary/
│       ├── KitchenSummary.tsx # Pantalla 3: Resumen cocina
│       ├── SummaryTotals.tsx  # Totales por masa
│       └── SummaryList.tsx     # Lista agregada
│
├── shared/                # Componentes reutilizables
│   ├── components/
│   │   ├── Button.tsx     # Botón con variantes
│   │   ├── Card.tsx       # Contenedor con sombra
│   │   ├── Counter.tsx    # Contador +/- para cantidad
│   │   └── Modal.tsx     # Modal overlay
│   │
│   └── layout/
│       ├── Header.tsx     # Header con navegación
│       └── Page.tsx       # Wrapper de página
│
├── main.tsx              # Punto de entrada
└── index.css             # Estilos globales (Tailwind)
```

## Flujo de Datos

### 1. Inicialización
```
main.tsx
  └─> OrderProvider (Context)
      └─> RouterProvider
          └─> Routes
```

### 2. Creación de Grupo
```
GroupForm
  └─> dispatch(CREATE_GROUP)
      └─> orderReducer
          └─> Crea GroupOrder con Person[]
              └─> Navigate to /order
```

### 3. Agregar Pupusas
```
PersonCard
  └─> Abre Modal
      └─> PupusaForm
          └─> dispatch(ADD_PUPUSA)
              └─> orderReducer
                  └─> Agrega/Actualiza pupusa en Person
                      └─> Estado actualizado
```

### 4. Resumen
```
KitchenSummary
  └─> Lee order del Context
      └─> Agrega pupusas de todas las personas
          └─> Agrupa por dough + filling
              └─> Muestra SummaryTotals + SummaryList
                  └─> WhatsApp: Genera mensaje formateado
```

## Estado Global

```typescript
GroupOrder | null
├── groupName: string
└── people: Person[]
    ├── id: string
    ├── name: string
    └── pupusas: Pupusa[]
        ├── id: string
        ├── dough: 'maiz' | 'arroz'
        ├── filling: Filling (11 tipos)
        └── quantity: number
```

## Acciones del Reducer

| Acción          | Payload                    | Efecto                       |
| --------------- | -------------------------- | ---------------------------- |
| `CREATE_GROUP`  | `{groupName, peopleCount}` | Crea GroupOrder con personas |
| `RENAME_PERSON` | `{personId, newName}`      | Actualiza nombre de persona  |
| `ADD_PUPUSA`    | `{personId, pupusa}`       | Agrega/consolida pupusa      |
| `REMOVE_PUPUSA` | `{personId, pupusaId}`     | Elimina pupusa               |
| `RESET_ORDER`   | -                          | Resetea a null               |

## Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router v6** - Routing (basename: '/pupas/')
- **TailwindCSS** - Estilos
- **React Context + useReducer** - Estado global
- **Poppins Font** - Tipografía

## Patrones de Diseño

1. **Feature-based Structure** - Organización por features
2. **Context API Pattern** - Estado global compartido
3. **Reducer Pattern** - Mutaciones inmutables
4. **Component Composition** - Componentes reutilizables
5. **Container/Presentational** - Separación de lógica y UI

## Flujo de Navegación

```
/ (GroupForm)
  └─> Crear grupo
      └─> /order (PersonList)
          ├─> Agregar pupusas por persona
          └─> Ver resumen
              └─> /summary (KitchenSummary)
                  └─> Enviar a WhatsApp
```
