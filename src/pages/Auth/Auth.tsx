import { Link as LinkIcon } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { createUser, getUserByusername } from "../../services/user-service";

import "./Auth.css";
import type { AuthMode } from "../../types/auth-mode";
import { AxiosError } from "axios";

export function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      setError("Digite um username.");
      return;
    }

    if (normalizedUsername.length < 3) {
      setError("O username precisa ter pelo menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = isLogin
        ? await getUserByusername(normalizedUsername)
        : await createUser(normalizedUsername);

      login(response);

      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Não foi possível realizar a operação.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setUsername("");
    setError("");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <LinkIcon size={22} />
          </div>

          <span>URL Lite</span>
        </div>

        <div className="auth-heading">
          <h1>{isLogin ? "Bem-vindo de volta" : "Crie sua conta"}</h1>

          <p>
            {isLogin
              ? "Entre para gerenciar seus links."
              : "Crie seu usuário para começar a encurtar links."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Digite seu username"
            autoComplete="username"
            disabled={loading}
            autoFocus
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <>
              <span>Não possui uma conta?</span>

              <button
                type="button"
                onClick={() => handleModeChange("register")}
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              <span>Já possui uma conta?</span>

              <button type="button" onClick={() => handleModeChange("login")}>
                Entrar
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
