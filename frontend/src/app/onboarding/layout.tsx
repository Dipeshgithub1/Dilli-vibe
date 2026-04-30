import { Suspense } from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
          <div className="animate-spin text-2xl">⟳</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
