export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Symbole AZ uniquement */}
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto"
      >
        <g transform="translate(10, 5)">
          {/* Forme A simplifié */}
          <path
            d="M 0 45 L 18 0 L 30 0 L 30 12 L 16 45 Z"
            fill="currentColor"
          />

          {/* Forme Z simplifié */}
          <path
            d="M 35 0 L 80 0 L 80 8 L 50 22 L 80 37 L 80 45 L 35 45 L 35 37 L 65 23 L 35 8 Z"
            fill="currentColor"
          />
        </g>
      </svg>

      {/* Initiales texte (visible desktop uniquement) */}
      <span className="hidden text-xl font-bold tracking-tight md:inline">
        AZ
      </span>
    </div>
  );
}
