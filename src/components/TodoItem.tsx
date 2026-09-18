import {
  useState,
} from "react";

export interface Todo {
  id: string;
  usuarioId: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    nombre: string,
  ) => Promise<void>;
}

export default function TodoItem({
  todo,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.nombre);

  async function handleUpdate() {
    const nombre = value.trim();

    if (!nombre) return;

    await onUpdate(todo.id, nombre);

    setEditing(false);
  }

  return (
    <li className="todo-item">
      {editing ? (
        <input
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          autoFocus
        />
      ) : (
        <span>{todo.nombre}</span>
      )}

      <div className="todo-actions">
        {editing ? (
          <button
            className="edit-button"
            onClick={handleUpdate}
          >
            Guardar
          </button>
        ) : (
          <button
            className="edit-button"
            onClick={() =>
              setEditing(true)
            }
          >
            Editar
          </button>
        )}

        <button
          className="delete-button"
          onClick={() =>
            onDelete(todo.id)
          }
          title="Eliminar tarea"
        >
          ×
        </button>
      </div>
    </li>
  );
}
