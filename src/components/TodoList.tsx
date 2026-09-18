import TodoItem, {
  type Todo,
} from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    nombre: string,
  ) => Promise<void>;
}

export default function TodoList({
  todos,
  onDelete,
  onUpdate,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No tienes tareas todavía.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
