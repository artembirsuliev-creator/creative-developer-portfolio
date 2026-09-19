import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="template-footer">
      <div className="container-shell flex flex-col gap-5 py-7 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. Сделано с вниманием.</p>
        <div className="flex items-center gap-5">
          <Link className="nav-link inline-flex items-center gap-1" href="#top">
            Наверх <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
