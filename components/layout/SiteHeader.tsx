import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="signal-header">
      <a className="signal-skip" href="/#top">К содержимому</a>
      <Link className="signal-logo" href="/" aria-label="Главная — LOOP / FORM">LOOP <span>/</span> FORM</Link>
      <nav aria-label="Основная навигация">{siteConfig.nav.map(item => <a className="signal-nav-link" href={`/${item.href}`} key={item.href}>{item.label}</a>)}</nav>
      <a className="signal-header-contact" href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">Связаться <ArrowUpRight size={14} aria-hidden="true" /></a>
    </header>
  );
}
