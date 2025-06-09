import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  text?: string;
}

export default function Loading({ className, text = "Chargement..." }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full min-h-[200px] gap-4", className)}>
      <div className="relative w-20 h-20">
        {/* Premier cercle - rotation lente */}
        <div className="absolute w-full h-full border-4 border-primary/20 rounded-full animate-pulse"></div>
        {/* Deuxième cercle - rotation moyenne */}
        <div className="absolute w-full h-full border-4 border-primary/40 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        {/* Troisième cercle - rotation rapide */}
        <div className="absolute w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-primary/80 text-lg font-medium animate-pulse">{text}</p>
    </div>
  );
}
