"use client";

import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "../modals/create-workspace";
import { UserOnboardingModal } from "../modals/user-onboarding-modal";
import { InvitePeopleModal } from "../modals/invite-people";
import { CreateDocumentModal } from "../modals/create-document";

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
      <CreateDocumentModal />
      <InvitePeopleModal />
      <UserOnboardingModal />
      <CreateWorkspaceModal />
    </>
  );
}
