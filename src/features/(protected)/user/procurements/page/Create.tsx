'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { useCreateProcurement } from '@/hooks/api/useProcurement'
import { CreateProcurementForm } from '@/features/(protected)/user/procurements/components/form/CreateProcurementForm'
import { ProcurementFormValues } from '@/features/(protected)/user/procurements/components/validation/ProcurementValidation'

export default function CreateProcurementPage() {
  const router = useRouter()
  const { mutateAsync: createProcurement, isPending } = useCreateProcurement()

  const handleSubmit = async (values: ProcurementFormValues) => {
    try {
      // Ambil file dari FileList
      const file = values.letterFile[0]
      console.table(values)
      await createProcurement({
        ...values,
        letterFile: file
      })
      toast.success('Pengajuan baru berhasil dibuat.')
      router.push('/user/procurements')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Gagal membuat pengajuan.', { description: err instanceof Error ? err.message : '' })
    }
  }

  return (
    <PageContainer title="Buat Pengajuan Baru">
      <CreateProcurementForm onSubmit={handleSubmit} isPending={isPending} />
    </PageContainer>
  )
}
