import { Loader2 } from "lucide-react";

const Button = ({ children, isLoading, disabled, ...props }) => {
  return (
    <button className="btn btn-primary w-full" disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
