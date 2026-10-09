import { Check, Clipboard, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

import "./LinkCard.css";
import type { Link } from "../../types/link";

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.shortLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="link-card">
      <div className="link-card-content">
        <a
          className="link-card-short-url"
          href={link.shortLink}
          target="_blank"
          rel="noreferrer"
        >
          {link.shortLink}
        </a>

        <p className="link-card-original" title={link.originalLink}>
          {link.originalLink}
        </p>
      </div>

      <div className="link-card-actions">
        <button
          type="button"
          className="icon-button"
          onClick={handleCopy}
          title="Copiar link"
          aria-label="Copiar link"
        >
          {copied ? <Check size={17} /> : <Clipboard size={17} />}
        </button>

        <a
          className="icon-button"
          href={link.shortLink}
          target="_blank"
          rel="noreferrer"
          title="Abrir link"
          aria-label="Abrir link"
        >
          <ExternalLink size={17} />
        </a>

        <button
          type="button"
          className="icon-button danger"
          onClick={() => onDelete(link.id)}
          title="Excluir link"
          aria-label="Excluir link"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
