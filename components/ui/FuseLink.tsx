"use client";

import type { ReactNode } from "react";

import { FuseButton } from "./FuseButton";

const FUSE_BACKGROUND = "#6f32a8";

type FuseLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function FuseLink({ href, label, icon, className, ariaLabel }: FuseLinkProps) {
  const handleCommit = () => {
    if (href.startsWith("#")) {
      window.location.hash = href;
      return;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <FuseButton
      ariaLabel={ariaLabel}
      background={FUSE_BACKGROUND}
      className={className}
      color="#ffffff"
      doneLabel={label}
      fuse="bottom"
      fuseColor="#ead7ff"
      icon={icon}
      label={label}
      onCommit={handleCommit}
      pauseOnHover={false}
      radius={999}
      settle="reset"
      undoLabel="Отмена"
      undoWindow={320}
    />
  );
}
