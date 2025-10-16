'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect } from 'react'

import { Rule } from '@/types/api/ruleType'
import { useGetAllRoles } from '@/hooks/api/useRole'
import { useUpdateRuleSteps } from '@/hooks/api/useRule'
import { StepsFormValues, StepsValidation } from './validation/RuleValidation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'

interface EditStepsModalProps {
  rule: Rule | null
  isOpen: boolean
  onClose: () => void
}

const stepLabels = ['Langkah 1: Pembuat (CREATE)', 'Langkah 2: Peninjau (REVIEW)', 'Langkah 3: Penyetuju (APPROVE)']

export const EditStepsModal = ({ rule, isOpen, onClose }: EditStepsModalProps) => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles()
  const { mutateAsync: updateSteps, isPending } = useUpdateRuleSteps()

  const form = useForm<StepsFormValues>({
    resolver: zodResolver(StepsValidation)
  })

  useEffect(() => {
    if (rule) {
      const sortedSteps = [...rule.steps].sort((a, b) => a.stepOrder - b.stepOrder)
      form.reset({
        steps: sortedSteps.map((step) => ({ roleId: step.role.id }))
      })
    }
  }, [rule, form])

  const handleFormSubmit = async (values: StepsFormValues) => {
    if (!rule) return

    const payload = {
      steps: [
        { stepOrder: 1, roleId: values.steps[0].roleId },
        { stepOrder: 2, roleId: values.steps[1].roleId },
        { stepOrder: 3, roleId: values.steps[2].roleId }
      ]
    }

    try {
      await updateSteps({ ruleId: rule.id, ...payload })
      toast.success('Langkah persetujuan berhasil diperbarui.')
      onClose()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan pada server.'
      toast.error('Gagal menyimpan perubahan.', { description: errorMessage })
    }
  }

  // ... sisa JSX tidak berubah
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        {!rule ? (
          <DynamicSkeleton variant="dialogForm" itemCount={3} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit Langkah untuk {rule.name}</DialogTitle>
              <DialogDescription>Atur role yang bertanggung jawab untuk setiap langkah.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
                {/* ... mapping FormField ... */}
                {stepLabels.map((label, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`steps.${index}.roleId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingRoles}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingRoles ? 'Memuat...' : 'Pilih role'} />
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
                ))}
                <DialogFooter className="pt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
