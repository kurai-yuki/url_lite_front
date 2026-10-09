import "./Loading.css";

interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Carregando..." }: LoadingProps) {
  return (
    <div className="loading">
      <span className="loading-spinner" />
      <span>{text}</span>
    </div>
  );
}
