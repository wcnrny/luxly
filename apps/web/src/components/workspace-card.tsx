"use client";
import { type Workspace } from "@luxly/prisma";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <Card
      key={workspace.id}
      className="p-4 border rounded-lg flex flex-col gap-y-2"
    >
      <CardHeader>
        <CardTitle>{workspace.name}</CardTitle>
        <CardDescription>{workspace.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant={"ghost"}>
          <Link href={"/document/" + workspace.id}>Go to the document!</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
