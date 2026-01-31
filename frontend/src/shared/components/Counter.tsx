import { Button } from './Button';

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Counter({ value, onChange, min = 1, max = 99 }: CounterProps) {
  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="success"
        onClick={decrement}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center p-0"
      >
        -
      </Button>
      <span className="w-10 text-center font-semibold text-primary text-lg">{value}</span>
      <Button
        type="button"
        variant="success"
        onClick={increment}
        disabled={value >= max}
        className="w-8 h-8 flex items-center justify-center p-0"
      >
        +
      </Button>
    </div>
  );
}