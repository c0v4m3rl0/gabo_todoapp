import {
  useState,
} from "react";
import type { FormEvent } from "react";

interface TodoFormProps {
  onAdd: (nombre: string) => Promise<void>;
}

export default function TodoForm({
  onAdd,
}: TodoFormProps) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value = nombre.trim();

    if (!value) return;

    setLoading(true);

    await onAdd(value);

    setNombre("");
    setLoading(false);
  }

  return (
    <form
      className="todo-form"
      onSubmit={handleSubmit}
    >
      <input
        value={nombre}
        onChange={(event) =>
          setNombre(event.target.value)
        }
        placeholder="Escribe una tarea..."
      />

      <button
        className="primary-button"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}
