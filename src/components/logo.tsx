export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        SKIP HIRE
      </h1>
      <p className="text-xl font-light mt-1 tracking-widest text-muted-foreground">
        With A Difference
      </p>
    </div>
  );
} 