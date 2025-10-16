'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useCreateRule } from '@/hooks/api/useRule'
import { PageContainer } from '@/components/layout/PageContainer'
import { CreateRuleForm } from '@/features/(protected)/admin/rules/components/form/CreateRuleForm'
import { RuleFormValues } from '@/features/(protected)/admin/rules/components/validation/RuleValidation'

export default function CreateRulePage() {
  const router = useRouter()
  const { mutateAsync: createRule, isPending } = useCreateRule()

  const handleSubmit = async (values: RuleFormValues) => {
    try {
      await createRule(values)
      toast.success('Aturan baru berhasil dibuat.')
      router.push('/admin/rules')
      router.refresh()
    } catch (err) {
      console.log(err)

      let description = 'Terjadi kesalahan yang tidak diketahui.'
      if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
        const rawMessage = (err as { message: string }).message

        if (rawMessage.startsWith('Validation Error: ')) {
          try {
            const jsonString = rawMessage.substring('Validation Error: '.length)
            const zodErrorObject = JSON.parse(jsonString)
            const nestedZodError = JSON.parse(zodErrorObject.message)
            description = nestedZodError[0]?.message || 'Terjadi kesalahan validasi.'
          } catch (parseError) {
            console.error('Gagal parse pesan error validasi:', parseError)
            description = rawMessage
          }
        } else {
          description = rawMessage
        }
      }

      toast.error('Gagal membuat aturan.', { description: description })
    }
  }

  return (
    <PageContainer title="Buat Aturan Persetujuan Baru">
      <CreateRuleForm onSubmit={handleSubmit} isPending={isPending} submitButtonText="Buat Aturan" />
    </PageContainer>
  )
}
