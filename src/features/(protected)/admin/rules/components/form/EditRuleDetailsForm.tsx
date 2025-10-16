'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { EditRuleDetailFormValues, EditRuleDetailValidation } from '../validation/RuleValidation'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface RuleDetailsFormProps {
  initialData?: EditRuleDetailFormValues
  onSubmit: (values: EditRuleDetailFormValues) => Promise<void>
  isPending: boolean
}

export function EditRuleDetailsForm({ initialData, onSubmit, isPending }: RuleDetailsFormProps) {
  const router = useRouter()
  const form = useForm<EditRuleDetailFormValues>({
    resolver: zodResolver(EditRuleDetailValidation),
    defaultValues: initialData
  })

  // useEffect untuk me-reset form ketika initialData berubah (setelah loading)
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Detail Aturan</CardTitle>
            <CardDescription>Ubah nama dan rentang nominal untuk aturan ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Aturan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pengadaan di Atas 50 Juta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Minimal (Rp)</FormLabel>
                    <FormControl>
                      {/* PERBAIKAN: Konversi ke Angka di onChange */}
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Maksimal (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Kosongkan jika tak terbatas"
                        {...field}
                        value={field.value ?? ''}
                        // PERBAIKAN: Konversi ke Angka atau null di onChange
                        onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
