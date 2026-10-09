import { Check, Copy, Link2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { LinkCard } from "../../components/LinkCard/LinkCard";
import { Loading } from "../../components/Loading/Loading";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { UrlInput } from "../../components/UrlInput/UrlInput";

import "./Home.css";
import {
  createShortLink,
  deleteUserLink,
  getUserLinksByUsername,
} from "../../services/link-service";
import type { UserLink } from "../../types/user-link";
import { useAuth } from "../../hooks/useAuth";

export function Home() {
  const { user, logout } = useAuth();

  const [links, setLinks] = useState<UserLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const loadLinks = useCallback(async () => {
    if (!user) return;

    setLoadingLinks(true);

    try {
      const result = await getUserLinksByUsername(user.username);
      setLinks(result);
    } catch {
      setError("Não foi possível carregar seus links.");
    } finally {
      setLoadingLinks(false);
    }
  }, [user]);

  useEffect(() => {
    loadLinks();
  }, [user, loadLinks]);

  const handleCreateLink = async (originalUrl: string) => {
    if (!user) {
      return;
    }

    setError("");
    setCreatedUrl("");
    setCopied(false);
    setCreating(true);

    try {
      const createShortLinkBody = {
        longLink: originalUrl,
        username: user.username,
      };
      const response = await createShortLink(createShortLinkBody);

      setCreatedUrl(response.shortLink);

      setLinks((current) => [response, ...current]);
    } catch {
      setError("Não foi possível criar o link.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este link?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUserLink(linkId);
      const userLinks = await getUserLinksByUsername(user.username);

      setLinks(userLinks);

      setCreatedUrl("");
    } catch {
      setError("Não foi possível excluir o link.");
    }
  };

  const handleCopy = async () => {
    if (!createdUrl) {
      return;
    }

    await navigator.clipboard.writeText(createdUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-layout">
      <Sidebar
        username={user.username}
        links={links}
        onDelete={handleDelete}
        onLogout={logout}
      />

      <main className="home-main">
        <div className="home-content">
          <header className="home-header">
            <div>
              <span className="home-eyebrow">Encurtador de URLs</span>

              <h1>Olá, {user.username}!</h1>

              <p>
                Transforme links longos em URLs simples e fáceis de
                compartilhar.
              </p>
            </div>
          </header>

          <section className="create-section" id="create-link">
            <div className="section-icon">
              <Link2 size={22} />
            </div>

            <div className="create-section-heading">
              <h2>Encurtar um novo link</h2>

              <p>Cole sua URL abaixo para gerar um link curto.</p>
            </div>

            <UrlInput onSubmit={handleCreateLink} loading={creating} />

            {error && <div className="home-error">{error}</div>}

            {createdUrl && (
              <div className="created-link">
                <div className="created-link-info">
                  <span>Seu link está pronto</span>

                  <a href={createdUrl} target="_blank" rel="noreferrer">
                    {createdUrl}
                  </a>
                </div>

                <button type="button" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check size={17} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={17} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            )}
          </section>

          <section className="recent-links">
            <div className="recent-links-header">
              <div>
                <h2>Seus links</h2>
                <p>Links encurtados recentemente.</p>
              </div>

              <span className="link-count">{links.length}</span>
            </div>

            {loadingLinks ? (
              <div className="links-loading">
                <Loading text="Carregando links..." />
              </div>
            ) : links.length === 0 ? (
              <div className="links-empty">
                <div className="links-empty-icon">
                  <Link2 size={24} />
                </div>

                <h3>Nenhum link ainda</h3>

                <p>Crie seu primeiro link usando o campo acima.</p>
              </div>
            ) : (
              <div className="home-links-list">
                {links.map((link) => (
                  <LinkCard key={link.id} link={link} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
