"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/components/property/PropertyForm";
import { updateProperty } from "@/lib/actions/properties";
import type { Property } from "@/lib/types";

interface Props {
  mode: "edit";
  property: Property;
}

export function PropertyFormClient({ mode, property }: Props) {
  const router = useRouter();

  async function handleUpdate(input: Record<string, unknown>) {
    const res = await updateProperty(property.id, input);
    if (res.ok) {
      toast.success("Perubahan tersimpan.");
      router.push(`/agent/dashboard/${property.id}`);
    } else {
      toast.error(res.error);
    }
  }

  return <PropertyForm mode={mode} initial={property} onSubmit={handleUpdate} />;
}
