const ButtonLoading = ({ text = 'Đang xử lý...' }: { text?: string }) => (
  <div className="flex items-center justify-center gap-2">
    <svg
      className="w-5 h-5 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <span>{text}</span>
  </div>
);

export default ButtonLoading;
