// src/pages/admin/Login.tsx
//
// Formulario de acceso para el panel admin. Sin estilos elaborados
// (eso queda para quien integre el diseño de Mori 1.0, si aplica a
// esta pantalla). Al autenticar, redirige a la ruta desde la que
// RutaProtegida haya rebotado al usuario (o a /admin por defecto).

import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destino = (location.state as { from?: string })?.from ?? '/admin';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    navigate(destino, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Acceso administrador</h1>

      <div>
        <label htmlFor="email">Correo</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}
