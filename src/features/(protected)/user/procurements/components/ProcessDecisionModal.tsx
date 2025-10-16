'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { ProcessDecision, Procurement } from '@/types/api/procurementType'
import { useProcessDecision, useGetProcurementLetterFile } from '@/hooks/api/useProcurement'
import { ProcessDecisionValidation, ProcessDecisionFormValues } from './validation/ProcurementValidation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import your PdfViewer component and disable Server-Side Rendering (SSR) for it
const PdfViewer = dynamic(() => import('@/components/ui/pdf-viewer').then((mod) => mod.PdfViewer), {
  ssr: false, // This is the key part
  loading: () => <p>Loading PDF Viewer...</p> // Optional loading indicator
})
interface ProcessDecisionModalProps {
  procurement: Procurement | null
  isOpen: boolean
  onClose: () => void
}

export function ProcessDecisionModal({ procurement, isOpen, onClose }: ProcessDecisionModalProps) {
  const processDecision = useProcessDecision(procurement!.id)
  const fileName = procurement?.letterFile?.split('/')?.pop()
  const { data: letterBlob, isLoading: isPdfLoading, error: pdfError } = useGetProcurementLetterFile(fileName)

  const router = useRouter()

  const form = useForm<ProcessDecisionFormValues>({
    resolver: zodResolver(ProcessDecisionValidation),
    defaultValues: {
      decision: undefined as 'APPROVE' | 'REJECT' | 'REQUEST_REVISION' | undefined,
      comment: ''
    }
  })

  const onSubmit = (values: ProcessDecisionFormValues) => {
    processDecision.mutateAsync(
      { ...values, decision: values.decision as ProcessDecision },
      {
        onSuccess: () => {
          toast.success('Keputusan berhasil dikirim.')
          router.push('/admin/procurements')
        },
        onError: (error: { message?: string }) => {
          toast.error(error.message || 'Gagal mengirim keputusan')
        }
      }
    )
  }

  // Reset form setiap kali modal ditutup
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      onClose()
    }
  }

  return (
    <div className="flex">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="lg:max-w-7xl w-full h-[90vh]">
          {procurement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0">
              {/* Kolom Kiri: Form Keputusan */}
              <div className="flex flex-col p-6 overflow-y-auto">
                <DialogHeader className="mb-4">
                  <DialogTitle>Proses Pengajuan: {procurement.letterNumber}</DialogTitle>
                  <DialogDescription>{procurement.letterAbout}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col flex-grow">
                    <FormField
                      control={form.control}
                      name="decision"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Ambil Keputusan</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="APPROVE" />
                                </FormControl>
                                <FormLabel className="font-normal text-green-600">Setujui (Approve)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="REQUEST_REVISION" />
                                </FormControl>
                                <FormLabel className="font-normal text-yellow-600">Minta Revisi (Request Revision)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="REJECT" />
                                </FormControl>
                                <FormLabel className="font-normal text-red-600">Tolak (Reject)</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem className="flex flex-col flex-grow">
                          <FormLabel>Komentar (Opsional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Berikan catatan jika Anda meminta revisi atau menolak pengajuan..."
                              className="resize-none flex-grow"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={processDecision.isPending}>
                        {processDecision.isPending ? 'Mengirim...' : 'Kirim Keputusan'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

              <div className="hidden md:flex flex-col h-full min-h-0 rounded-xl">
                <div className="p-2 border-b text-sm font-medium text-muted-foreground mb-4">Dokumen: {procurement.letterAbout}</div>
                <div className="flex-1 relative border rounded-md">
                  {isPdfLoading && <div className="text-sm text-muted-foreground">Memuat dokumen...</div>}
                  {pdfError && <div className="text-sm text-red-600">Gagal memuat dokumen</div>}
                  {letterBlob ? (
                    <PdfViewer fileBlob={letterBlob} initialScale={1} className="absolute inset-0" />
                  ) : (
                    !isPdfLoading &&
                    !pdfError && (
                      <div className="flex h-full w-full items-center justify-center">
                        <p>Dokumen tidak ditemukan.</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
