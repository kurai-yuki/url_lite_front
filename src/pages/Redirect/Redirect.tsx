import { Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Loading } from "../../components/Loading/Loading";
import { getLinkById } from "../../services/link-service";
import type { RedirectStatus } from "../../types/redirect-status";

import "./Redirect.css";

export function Redirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<RedirectStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (!id) {
        setStatus("not-found");
        return;
      }

      try {
        const link = await getLinkById(id);

        if (cancelled) {
          return;
        }

        await new Promise((resolves) => {
          setTimeout(() => {
            resolves(undefined);
          }, 2000);
        });
        window.location.href = link.originalLink;
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof Error && error.message === "LINK_NOT_FOUND") {
          setStatus("not-found");
        } else {
          setStatus("error");
        }
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <main className="redirect-page">
        <div className="redirect-card">
          <div className="redirect-logo">
            <div className="redirect-logo-icon">
              <LinkIcon size={22} />
            </div>

            <span>URL Lite</span>
          </div>

          <Loading text="Redirecionando..." />

          <p className="redirect-description">
            Estamos encontrando o destino do seu link.
          </p>
        </div>
      </main>
    );
  }

  if (status === "not-found") {
    return (
      <main className="redirect-page">
        <div className="redirect-card">
          <div className="redirect-logo">
            <div className="redirect-logo-icon">
              <LinkIcon size={22} />
            </div>

            <span>URL Lite</span>
          </div>

          <div className="redirect-error-icon">
            <LinkIcon size={24} />
          </div>

          <h1>Link inexistente</h1>

          <p className="redirect-description">
            O link que você tentou acessar não existe ou não está mais
            disponível.
          </p>

          <button type="button" onClick={() => navigate("/login")}>
            Ir para o URL Lite
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="redirect-page">
      <div className="redirect-card">
        <div className="redirect-logo">
          <div className="redirect-logo-icon">
            <LinkIcon size={22} />
          </div>

          <span>URL Lite</span>
        </div>

        <h1>Não foi possível redirecionar</h1>

        <p className="redirect-description">
          Ocorreu um erro ao tentar encontrar o destino deste link.
        </p>

        <button type="button" onClick={() => navigate("/login")}>
          Ir para o URL Lite
        </button>
      </div>
    </main>
  );
}
