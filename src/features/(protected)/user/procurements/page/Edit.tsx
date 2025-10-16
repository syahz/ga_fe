'use client'

import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { useUpdateProcurement } from '@/hooks/api/useProcurement'
import { EditProcurementForm } from '../components/form/EditProcurementForm'
import { useParams, useRouter } from 'next/navigation'
import { EditProcurementFormValues } from '@/features/(protected)/user/procurements/components/validation/ProcurementValidation'

export default function CreateProcurementPage() {
  const params = useParams()
  const router = useRouter()
  const letterId = params.letterId as string
  const { mutateAsync: updateProcurement, isPending } = useUpdateProcurement(letterId)

  const handleSubmit = async (values: EditProcurementFormValues) => {
    try {
      const file = values.letterFile && values.letterFile.length > 0 ? values.letterFile[0] : undefined
      console.table({ ...values, letterFile: file })
      await updateProcurement({
        ...values,
        letterFile: file
      })
      toast.success('Pengajuan berhasil diubah.')
      router.push('/user/procurements')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengubah pengajuan.', { description: err instanceof Error ? err.message : '' })
    }
  }

  return (
    <PageContainer title="Edit Pengajuan">
      <EditProcurementForm onSubmit={handleSubmit} isPending={isPending} letterId={letterId} />
    </PageContainer>
  )
}
