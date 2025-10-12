"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps {
  identifier?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}
export const PasswordField = ({
  identifier = "password",
  value,
  onChange,
  label = "Password",
}: PasswordFieldProps) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id={identifier}
          name={identifier}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="pr-10"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export const SubmitButton = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full cursor-pointer" disabled={pending || loading}>
      {pending || loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Memproses…
        </>
      ) : (
        children
      )}
    </Button>
  );
};
