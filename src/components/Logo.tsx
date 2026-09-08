// Шеврон у бурштиновому квадраті: суцільна плашка читається і на світлій,
// і на темній вкладці, на відміну від тонких ліній.
export const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#FFB54D" />
    <path
      d="M8.5 20.5 16 11.5l7.5 9"
      fill="none"
      stroke="#201C17"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
