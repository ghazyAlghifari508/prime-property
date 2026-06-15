"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { MultiSelect } from "@/components/common/MultiSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HADAP_OPTIONS,
  KAWASAN_OPTIONS,
  SIAP_OPTIONS,
  STATUS_OPTIONS,
  TIPE_OPTIONS,
} from "@/lib/constants";
import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/lib/property-schema";
import type { Hadap, Property } from "@/lib/types";
import { cn } from "@/lib/utils";

type FormInput = Record<string, unknown>;

type PropertyInput = {
  nama_property: string;
  group: string | null;
  lebar: number;
  panjang: number;
  hadap: Hadap[];
  tipe: "Ruko" | "Villa";
  tingkat: number;
  price: number;
  carport: boolean;
  status: "in_stock" | "sold_out";
  siap: "siap_huni" | "siap_kosong" | "siap_huni_renovasi";
  maps_link: string | null;
  kawasan: string[];
  unit: string | null;
};

interface Props {
  mode: "create" | "edit";
  initial?: Property;
  onSubmit: (input: FormInput) => void | Promise<void>;
  onSubmitAddAnother?: (
    input: FormInput,
    reset: () => void,
  ) => void | Promise<void>;
}

function toValues(p?: Property): PropertyFormValues {
  return {
    nama_property: p?.nama_property ?? "",
    group: p?.group ?? "",
    lebar: p?.lebar ?? 0,
    panjang: p?.panjang ?? 0,
    hadap: p?.hadap ?? [],
    tipe: p?.tipe ?? "Ruko",
    tingkat: p?.tingkat ?? 1,
    price: p?.price ?? 0,
    carport: p?.carport ?? false,
    status: p?.status ?? "in_stock",
    siap: p?.siap ?? "siap_huni",
    maps_link: p?.maps_link ?? "",
    kawasan: p?.kawasan ?? [],
    unit: p?.unit ?? "",
  };
}

function toInput(v: PropertyFormValues): PropertyInput {
  return {
    nama_property: v.nama_property.trim(),
    group: v.group?.trim() ? v.group.trim() : null,
    lebar: v.lebar,
    panjang: v.panjang,
    hadap: v.hadap,
    tipe: v.tipe,
    tingkat: v.tingkat,
    price: v.price,
    carport: v.carport,
    status: v.status,
    siap: v.siap,
    maps_link: v.maps_link?.trim() ? v.maps_link.trim() : null,
    kawasan: v.kawasan,
    unit: v.unit?.trim() ? v.unit.trim() : null,
  };
}

export function PropertyForm({
  mode,
  initial,
  onSubmit,
  onSubmitAddAnother,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: toValues(initial),
    mode: "onBlur",
  });

  const dirtyFields = form.formState.dirtyFields;
  const isDirty = (name: keyof PropertyFormValues) =>
    mode === "edit" && Boolean(dirtyFields[name]);

  async function submit(values: PropertyFormValues, addAnother: boolean) {
    setSubmitting(true);
    try {
      const input = toInput(values);
      if (addAnother && onSubmitAddAnother) {
        await onSubmitAddAnother(input, () => form.reset(toValues()));
      } else {
        await onSubmit(input);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // label dengan penanda dirty (AC-8.2)
  const Lbl = ({
    name,
    children,
    required,
  }: {
    name: keyof PropertyFormValues;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <FormLabel>
      {children}
      {required && <span className="text-prime-red"> *</span>}
      {isDirty(name) && (
        <span
          className="ml-1.5 inline-block size-1.5 rounded-full bg-prime-gold align-middle"
          title="Diubah"
        />
      )}
    </FormLabel>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => submit(v, false))}
        className="space-y-6"
      >
        <div className="overflow-hidden rounded-xl border border-border bg-prime-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-soft-gray/60 px-6 py-3">
            <span className="h-4 w-1 rounded-full bg-prime-gold" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-prime-black">
              Data Properti
            </h2>
          </div>
          <div className="grid gap-x-6 gap-y-5 p-6 md:grid-cols-2">
            {/* Nama */}
          <FormField
            control={form.control}
            name="nama_property"
            render={({ field }) => (
              <FormItem>
                <Lbl name="nama_property" required>
                  Nama Properti
                </Lbl>
                <FormControl>
                  <Input placeholder="cth. Aston Villas (Blok A1)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group */}
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <Lbl name="group">Group</Lbl>
                <FormControl>
                  <Input placeholder="cth. Mentari (opsional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lebar */}
          <FormField
            control={form.control}
            name="lebar"
            render={({ field }) => (
              <FormItem>
                <Lbl name="lebar" required>
                  Lebar (m)
                </Lbl>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={Number.isNaN(field.value) ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Panjang */}
          <FormField
            control={form.control}
            name="panjang"
            render={({ field }) => (
              <FormItem>
                <Lbl name="panjang" required>
                  Panjang (m)
                </Lbl>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={Number.isNaN(field.value) ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hadap (multi) */}
          <FormField
            control={form.control}
            name="hadap"
            render={({ field }) => (
              <FormItem>
                <Lbl name="hadap" required>
                  Hadap
                </Lbl>
                <FormControl>
                  <MultiSelect
                    options={HADAP_OPTIONS.map((h) => ({ value: h, label: h }))}
                    selected={field.value}
                    onChange={(v) => field.onChange(v as Hadap[])}
                    placeholder="Pilih arah hadap"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipe */}
          <FormField
            control={form.control}
            name="tipe"
            render={({ field }) => (
              <FormItem>
                <Lbl name="tipe" required>
                  Tipe
                </Lbl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tingkat */}
          <FormField
            control={form.control}
            name="tingkat"
            render={({ field }) => (
              <FormItem>
                <Lbl name="tingkat" required>
                  Tingkat (1–10)
                </Lbl>
                <FormControl>
                  <Input
                    type="number"
                    step={0.5}
                    min={1}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={Number.isNaN(field.value) ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <Lbl name="price" required>
                  Harga (Rp)
                </Lbl>
                <FormControl>
                  <Input
                    type="number"
                    step={1_000_000}
                    min={0}
                    placeholder="cth. 1350000000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={Number.isNaN(field.value) ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Lbl name="status" required>
                  Status
                </Lbl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Siap */}
          <FormField
            control={form.control}
            name="siap"
            render={({ field }) => (
              <FormItem>
                <Lbl name="siap" required>
                  Kesiapan
                </Lbl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SIAP_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kawasan (multi) */}
          <FormField
            control={form.control}
            name="kawasan"
            render={({ field }) => (
              <FormItem>
                <Lbl name="kawasan" required>
                  Kawasan
                </Lbl>
                <FormControl>
                  <MultiSelect
                    options={KAWASAN_OPTIONS.map((k) => ({
                      value: k,
                      label: k,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih kawasan"
                    searchPlaceholder="Cari kawasan…"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <Lbl name="unit">Unit</Lbl>
                <FormControl>
                  <Input
                    placeholder="cth. Ready Siap Huni (opsional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Maps link */}
          <FormField
            control={form.control}
            name="maps_link"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <Lbl name="maps_link">Tautan Google Maps</Lbl>
                <FormControl>
                  <Input
                    placeholder="https://www.google.com/maps/…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Carport */}
          <FormField
            control={form.control}
            name="carport"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md border border-border p-3",
                  )}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="carport"
                    />
                  </FormControl>
                  <label
                    htmlFor="carport"
                    className="text-sm font-medium text-prime-black"
                  >
                    Memiliki carport
                    {isDirty("carport") && (
                      <span className="ml-1.5 inline-block size-1.5 rounded-full bg-prime-gold align-middle" />
                    )}
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>

        {/* Aksi */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            <X className="mr-1 size-4" />
            Batal
          </Button>

          {mode === "create" && onSubmitAddAnother && (
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={form.handleSubmit((v) => submit(v, true))}
              className="border-prime-gold text-prime-gold-dark hover:bg-prime-gold/10"
            >
              Simpan & Tambah Lagi
            </Button>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="bg-prime-gold text-prime-black hover:bg-prime-gold-dark"
          >
            <Save className="mr-1 size-4" />
            {submitting
              ? "Menyimpan…"
              : mode === "create"
                ? "Simpan Properti"
                : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
