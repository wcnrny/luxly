import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SlashIcon } from "lucide-react";

export function NavbarBreadcrumbs() {
  return (
    <Breadcrumb className="text-muted-foreground flex flex-col items-center gap-x-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Workspaces</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
