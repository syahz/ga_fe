'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserResponse } from '@/types/api/user'
import React from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useUpdateAccountAuditor } from '@/hooks/api/useUser'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateAccountAuditorFormValues, UpdateAccountAuditorValidation } from '../validation/AccountValidation'

interface UpdateAuditorFormProps {
  auditorData: NonNullable<UserResponse['auditor']>
}

export const UpdateAuditorForm = ({ auditorData }: UpdateAuditorFormProps) => {
  const updateAcountAuditor = useUpdateAccountAuditor()

  // 👈 2. Hapus useEffect dan inisialisasi defaultValues di sini
  const form = useForm<UpdateAccountAuditorFormValues>({
    resolver: zodResolver(UpdateAccountAuditorValidation),
    defaultValues: {
      registration_number: auditorData?.registration_number ?? '',
      phone_number: auditorData?.phone_number ?? '',
      jenis_kelamin: (auditorData?.jenis_kelamin as 'L' | 'P') ?? 'L',
      pendidikan: auditorData?.pendidikan ?? ''
    }
  })

  // 👈 3. Implementasikan logika onSubmit
  const onSubmit = (values: UpdateAccountAuditorFormValues) => {
    updateAcountAuditor.mutate(values, {
      onSuccess: () => {
        toast.success('Profil auditor berhasil diperbarui!')
        // Reset form dengan value baru agar 'isDirty' kembali false
        form.reset(values)
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Gagal memperbarui profil auditor.'
        toast.error(message)
      }
    })
  }

  // Ambil state 'isDirty' untuk mengecek perubahan
  const { isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Profil Auditor</CardTitle>
            <CardDescription>Lengkapi informasi spesifik Anda sebagai auditor.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nomor Registrasi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nomor Handphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jenis_kelamin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pendidikan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Pendidikan Terakhir</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {/* 👈 4. Buat tombol menjadi interaktif */}
            <Button type="submit" disabled={!isDirty || updateAcountAuditor.isPending}>
              {updateAcountAuditor.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
