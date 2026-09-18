import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FuseLink } from "@/components/ui/FuseLink";
import { siteConfig } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="template-header relative z-10">
      <div className="container-shell flex min-h-20 items-center justify-between gap-6">
        <Link className="template-brand group" href="/" aria-label="Главная страница — LOOP / FORM">
          <span className="template-brand-word">{siteConfig.brand.first}</span>
          <span aria-hidden="true" className="template-brand-slash">/</span>
          <span className="template-brand-word">{siteConfig.brand.second}</span>
        </Link>
        <nav aria-label="Основная навигация" className="flex items-center gap-4 sm:gap-7">
          {siteConfig.nav.slice(0, 3).map((item) => (
            <a className="nav-link hidden sm:inline-flex" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <FuseLink
            ariaLabel="Обсудить проект"
            className="template-header-cta"
            href="#contact"
            icon={<ArrowUpRight aria-hidden="true" className="size-4" />}
            label="Обсудить проект"
          />
        </nav>
      </div>
    </header>
  );
}
