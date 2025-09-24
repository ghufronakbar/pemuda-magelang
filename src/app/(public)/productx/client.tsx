// client.tsx (Client Component)
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create Product"}
    </button>
  );
}

interface ProductsFormProps {
  action: (formData: FormData) => Promise<void>;
}

export const ProductsForm = ({ action }: ProductsFormProps) => {
  return (
    <form action={action} className="flex flex-col gap-3 max-w-md">
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border rounded px-3 py-2"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        className="border rounded px-3 py-2"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        className="border rounded px-3 py-2"
      />
      <SubmitButton />
    </form>
  );
};
