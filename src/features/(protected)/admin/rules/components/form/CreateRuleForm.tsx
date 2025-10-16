'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'

import { RuleFormValues, RuleFormValidation } from '../validation/RuleValidation'
import { useGetAllRoles } from '@/hooks/api/useRole'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CreateRuleFormProps {
  initialData?: Partial<RuleFormValues>
  onSubmit: (values: RuleFormValues) => Promise<void>
  isPending: boolean
  submitButtonText?: string
}

const stepLabels: Record<number, string> = {
  0: 'Langkah 1: Pembuat (CREATE)',
  1: 'Langkah 2: Peninjau (REVIEW)',
  2: 'Langkah 3: Penyetuju (APPROVE)'
}

export function CreateRuleForm({ initialData, onSubmit, isPending, submitButtonText = 'Simpan' }: CreateRuleFormProps) {
  const router = useRouter()
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles()

  const form = useForm<RuleFormValues>({
    resolver: zodResolver(RuleFormValidation),
    defaultValues: initialData || {
      name: '',
      minAmount: 0,
      maxAmount: null,
      steps: [
        { stepOrder: 1, stepType: 'CREATE', roleId: '' },
        { stepOrder: 2, stepType: 'REVIEW', roleId: '' },
        { stepOrder: 3, stepType: 'APPROVE', roleId: '' }
      ]
    }
  })

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  const { fields } = useFieldArray({
    control: form.control,
    name: 'steps'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Detail Aturan</CardTitle>
            <CardDescription>Isi nama dan rentang nominal untuk aturan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nama Aturan</FormLabel>
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
                    <FormLabel required>Nominal Minimal (Rp)</FormLabel>
                    <FormControl>
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

        <Card>
          <CardHeader>
            <CardTitle>Langkah Persetujuan</CardTitle>
            <CardDescription>Pilih role untuk setiap tahapan proses persetujuan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`steps.${index}.roleId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{stepLabels[index]}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingRoles}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingRoles ? 'Memuat roles...' : 'Pilih role'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rolesData?.data.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index < fields.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Menyimpan...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  )
}
