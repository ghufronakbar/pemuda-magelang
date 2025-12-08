"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormUser } from "@/context/form-user-context";
import { ProfileSection } from "./profile-section";
import { PasswordSection } from "./password-section";

export function FormProfile() {
  const { loading } = useFormUser();

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="animate-pulse col-span-1 ">
          <CardHeader>
            <CardTitle>Memuat Data</CardTitle>
            <CardDescription>Harap tunggu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
        <Card className="animate-pulse col-span-1 ">
          <CardHeader>
            <CardTitle>Memuat Data</CardTitle>
            <CardDescription>Harap tunggu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <ProfileSection className="col-span-1" />
      <PasswordSection className="col-span-1" />
    </div>
  );
}
