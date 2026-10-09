import { Link as LinkIcon, LogOut } from "lucide-react";

import { LinkCard } from "../LinkCard/LinkCard";

import "./Sidebar.css";
import type { Link } from "../../types/link";

interface SidebarProps {
  username: string;
  links: Link[];
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export function Sidebar({ username, links, onDelete, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <LinkIcon size={20} />
          </div>

          <span>URL Lite</span>
        </div>
      </div>

      <div className="sidebar-title-row">
        <span>Meus links</span>
      </div>

      <div className="sidebar-links">
        {links.length === 0 ? (
          <div className="sidebar-empty">
            <LinkIcon size={20} />

            <p>Você ainda não criou links.</p>
          </div>
        ) : (
          links.map((link) => (
            <LinkCard key={link.id} link={link} onDelete={onDelete} />
          ))
        )}
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{username.charAt(0).toUpperCase()}</div>

        <div>
          <span className="sidebar-user-label">Usuário</span>

          <strong>{username}</strong>
        </div>
      </div>

      <div className="sidebar-footer">
        <button type="button" onClick={onLogout} className="logout-button">
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </aside>
  );
}
