import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

import {
  getLocalTodos,
  saveLocalTodo,
  type LocalTodo,
} from "../lib/offlineDb";

import type { Todo } from "../components/TodoItem";

export default function TodoApp() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState("");
  const [online, setOnline] = useState(
    navigator.onLine,
  );

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener(
      "online",
      handleOnline,
    );

    window.addEventListener(
      "offline",
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline,
      );

      window.removeEventListener(
        "offline",
        handleOffline,
      );
    };
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    setUserId(user.id);

    await loadTodos(user.id);
  }

  async function loadTodos(id: string) {
    const localTodos =
      await getLocalTodos(id);

    if (!navigator.onLine) {
      setTodos(
        localTodos as Todo[],
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("tareas")
      .select("*")
      .eq("usuario_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setTodos(
        localTodos as Todo[],
      );

      return;
    }

    const formatted: Todo[] = data.map(
      (todo) => ({
        id: todo.id,
        usuarioId: todo.usuario_id,
        nombre: todo.nombre,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
      }),
    );

    setTodos(formatted);

    for (const todo of formatted) {
      await saveLocalTodo({
        id: todo.id,
        usuarioId: todo.usuarioId,
        nombre: todo.nombre,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        pendingSync: false,
      });
    }
  }

  async function addTodo(nombre: string) {
    if (!userId) return;

    const id = crypto.randomUUID();

    const now =
      new Date().toISOString();

    const localTodo: LocalTodo = {
      id,
      usuarioId: userId,
      nombre,
      createdAt: now,
      updatedAt: now,
      pendingSync: true,
    };

    await saveLocalTodo(localTodo);

    setTodos((current) => [
      {
        id,
        usuarioId: userId,
        nombre,
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ]);

    if (!navigator.onLine) {
      return;
    }

    const { error } = await supabase
      .from("tareas")
      .insert({
        id,
        usuario_id: userId,
        nombre,
      });

    if (error) {
      console.error(error);

      return;
    }

    await saveLocalTodo({
      ...localTodo,
      pendingSync: false,
    });
  }

  async function updateTodo(
    id: string,
    nombre: string,
  ) {
    const now =
      new Date().toISOString();

    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              nombre,
              updatedAt: now,
            }
          : todo,
      ),
    );

    const existing = todos.find(
      (todo) => todo.id === id,
    );

    if (!existing) return;

    await saveLocalTodo({
      ...existing,
      nombre,
      updatedAt: now,
      pendingSync: true,
    });

    if (!navigator.onLine) {
      return;
    }

    const { error } = await supabase
      .from("tareas")
      .update({
        nombre,
        updated_at: now,
      })
      .eq("id", id)
      .eq("usuario_id", userId);

    if (error) {
      console.error(error);
      return;
    }

    await saveLocalTodo({
      ...existing,
      nombre,
      updatedAt: now,
      pendingSync: false,
    });
  }

  async function deleteTodo(id: string) {
    setTodos((current) =>
      current.filter(
        (todo) => todo.id !== id,
      ),
    );

    if (!navigator.onLine) {
      await saveLocalTodo({
        id,
        usuarioId: userId,
        nombre: "",
        createdAt: "",
        updatedAt: new Date().toISOString(),
        pendingSync: true,
        deleted: true,
      });

      return;
    }

    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", userId);

    if (error) {
      console.error(error);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    navigate("/");
  }

  return (
    <main className="app-page">
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1>Mis tareas</h1>

            <span
              className={
                online
                  ? "connection online"
                  : "connection offline"
              }
            >
              {online
                ? "● Conectado"
                : "● Sin conexión"}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </header>

        <TodoForm onAdd={addTodo} />

        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
    </main>
  );
}
