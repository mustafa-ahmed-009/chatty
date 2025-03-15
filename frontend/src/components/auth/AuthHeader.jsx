import { MessageSquare } from "lucide-react";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex flex-col items-center gap-2">
        <div
          className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
        >
          <MessageSquare className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mt-2">{title}</h1>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthHeader;
