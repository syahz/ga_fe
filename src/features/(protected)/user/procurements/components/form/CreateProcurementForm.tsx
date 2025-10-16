'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ProcurementFormValidation, ProcurementFormValues } from '../validation/ProcurementValidation'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface CreateProcurementFormProps {
  onSubmit: (values: ProcurementFormValues) => Promise<void>
  isPending: boolean
}

export function CreateProcurementForm({ onSubmit, isPending }: CreateProcurementFormProps) {
  const router = useRouter()
  const { data: unitsData, isLoading: isLoadingUnits } = useGetAllUnits()

  const form = useForm<ProcurementFormValues>({
    resolver: zodResolver(ProcurementFormValidation),
    defaultValues: {
      letterNumber: '',
      letterAbout: '',
      nominal: 0,
      incomingLetterDate: '',
      unitId: '',
      letterFile: undefined
    }
    // --------------------------------
  })

  // Helper untuk menangani file input
  const fileRef = form.register('letterFile')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Detail Pengajuan</CardTitle>
            <CardDescription>Isi semua informasi yang diperlukan untuk membuat pengajuan pengadaan baru.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... FormField untuk letterNumber dan incomingLetterDate ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="letterNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Surat</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 123/B.01/2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="incomingLetterDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Surat Masuk</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="letterAbout"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perihal</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pengadaan Alat Tulis Kantor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nominal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        value={field.value === 0 ? '' : field.value}
                        placeholder="Contoh: 1500000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ... FormField untuk unitId ... */}
              <FormField
                name="unitId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Pengaju</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingUnits}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih unit..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitsData?.data.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* ... FormField untuk letterFile ... */}
            <FormField
              name="letterFile"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>File Surat (PDF)</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".pdf" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Mengirim...' : 'Kirim Pengajuan'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
