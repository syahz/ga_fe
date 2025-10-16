'use client'

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import React from 'react'

import { PageContainer } from '@/components/layout/PageContainer'
import { useGetRuleById, useUpdateRule } from '@/hooks/api/useRule'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { EditRuleDetailsForm } from '@/features/(protected)/admin/rules/components/form/EditRuleDetailsForm'
import { EditRuleDetailFormValues } from '@/features/(protected)/admin/rules/components/validation/RuleValidation'

export default function EditRuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: ruleData, isLoading, error } = useGetRuleById(id)
  const { mutateAsync: updateRule, isPending } = useUpdateRule()

  const handleSubmit = async (values: EditRuleDetailFormValues) => {
    try {
      await updateRule({ id, ...values })
      toast.success('Detail aturan berhasil diperbarui.')
      router.push('/admin/rules')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan pada server.'
      toast.error('Gagal memperbarui aturan.', { description: errorMessage })
    }
  }

  if (isLoading) {
    return (
      <PageContainer title="Edit Aturan">
        <DynamicSkeleton variant="pageForm" itemCount={2} titleWidth="w-1/2" />
      </PageContainer>
    )
  }

  if (error || !ruleData) {
    return (
      <PageContainer title="Error">
        <p className="text-center text-destructive">Gagal memuat data aturan.</p>
      </PageContainer>
    )
  }

  // Ubah format data dari API agar sesuai dengan form
  const initialFormData: EditRuleDetailFormValues = {
    name: ruleData.name,
    minAmount: Number(ruleData.minAmount),
    maxAmount: ruleData.maxAmount ? Number(ruleData.maxAmount) : null
  }

  return (
    <PageContainer title="Edit Detail Aturan">
      <EditRuleDetailsForm initialData={initialFormData} onSubmit={handleSubmit} isPending={isPending} />
    </PageContainer>
  )
}
