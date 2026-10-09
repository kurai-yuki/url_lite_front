import { Link as LinkIcon } from "lucide-react";
import { useState, type SubmitEvent } from "react";

import "./UrlInput.css";

interface UrlInputProps {
  onSubmit: (url: string) => Promise<void>;
  loading?: boolean;
}

export function UrlInput({ onSubmit, loading = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!url.trim()) {
      setError("Digite uma URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Digite uma URL válida.");
      return;
    }

    await onSubmit(url.trim());

    setUrl("");
  };

  return (
    <form className="url-input-form" onSubmit={handleSubmit}>
      <div className="url-input-wrapper">
        <LinkIcon className="url-input-icon" size={20} />

        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://exemplo.com"
          disabled={loading}
          autoComplete="url"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Encurtando..." : "Encurtar"}
        </button>
      </div>

      {error && <p className="url-input-error">{error}</p>}
    </form>
  );
}
