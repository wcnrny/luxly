"use client";

import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "../modals/create-workspace";

export function ModalProvider() {
  const [isMounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
}
