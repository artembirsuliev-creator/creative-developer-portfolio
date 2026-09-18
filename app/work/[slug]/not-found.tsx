import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell relative z-10 flex min-h-[60svh] flex-col justify-center py-20">
      <p className="eyebrow mb-5 text-accent">404</p>
      <h1 className="display max-w-3xl text-6xl font-medium tracking-[-0.07em]">Этот проект уже недоступен.</h1>
      <Link className="link-arrow mt-10" href="/#work">Назад к проектам</Link>
    </main>
  );
}
