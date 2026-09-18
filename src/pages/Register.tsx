import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
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

    const {
      data,
      error: signUpError,
    } = await supabase.auth.signUp({
      email: correo,
      password: contraseña,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("No se pudo crear el usuario.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("usuarios")
      .insert({
        id: data.user.id,
        nombre,
        correo,
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    navigate("/app");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>

        <label>Nombre</label>

        <input
          type="text"
          value={nombre}
          onChange={(event) =>
            setNombre(event.target.value)
          }
          placeholder="Tu nombre"
          required
        />

        <label>Correo</label>

        <input
          type="email"
          value={correo}
          onChange={(event) =>
            setCorreo(event.target.value)
          }
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
          minLength={6}
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
          {loading
            ? "Creando cuenta..."
            : "Registrarse"}
        </button>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  );
}
