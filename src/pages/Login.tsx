import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    navigate("/app");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>

        <label>Correo</label>

        <input
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />

        <label>Contraseña</label>

        <input
          type="password"
          value={contraseña}
          onChange={(event) =>
            setContraseña(event.target.value)
          }
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="auth-footer">
          ¿No tienes una cuenta?{" "}
          <Link to="/register">Registrarse</Link>
        </p>
      </form>
    </main>
  );
}
