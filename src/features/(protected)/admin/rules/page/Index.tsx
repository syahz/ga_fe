'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { useGetRules, useDeleteRule } from '@/hooks/api/useRule'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { RuleCard } from '@/features/(protected)/admin/rules/components/RuleCard'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { EditStepsModal } from '@/features/(protected)/admin/rules/components/EditStepsModal'
import { Rule } from '@/types/api/ruleType'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function RulesPage() {
  const router = useRouter()
  // Mengambil semua aturan tanpa paginasi
  const { data: rulesData, isLoading, error, refetch } = useGetRules({})
  const { mutateAsync: deleteRule, isPending: isDeleting } = useDeleteRule()

  // State untuk mengelola modal dan dialog konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)

  const handleEditDetails = (id: string) => {
    router.push(`/admin/rules/edit/${id}`)
  }

  const handleEditSteps = (rule: Rule) => {
    setSelectedRule(rule)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    const ruleToDelete = rulesData?.items.find((r) => r.id === id)
    if (ruleToDelete) {
      setSelectedRule(ruleToDelete)
      setIsAlertOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (!selectedRule) return
    try {
      await deleteRule(selectedRule.id)
      toast.success(`Aturan "${selectedRule.name}" berhasil dihapus.`)
      setIsAlertOpen(false)
      setSelectedRule(null)
      refetch() // Ambil ulang data setelah menghapus
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.'
      toast.error('Gagal menghapus aturan.', { description: errorMessage })
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <DynamicSkeleton key={i} variant="pageForm" itemCount={3} titleWidth="w-2/3" />
          ))}
        </div>
      )
    }

    if (error) {
      return <p className="text-center text-destructive">Gagal memuat data aturan.</p>
    }

    if (!rulesData || rulesData.items.length === 0) {
      return <p className="text-center text-muted-foreground pt-10">Belum ada aturan yang dibuat.</p>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rulesData.items.map((rule) => (
          <RuleCard key={rule.id} rule={rule} onEditDetails={handleEditDetails} onEditSteps={handleEditSteps} onDelete={handleDeleteClick} />
        ))}
      </div>
    )
  }

  return (
    <PageContainer title="Aturan Persetujuan">
      {/* Modal untuk Edit Langkah Persetujuan */}
      <EditStepsModal
        rule={selectedRule}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          refetch() // Ambil ulang data setelah modal ditutup
        }}
      />

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus aturan
              <strong> {selectedRule?.name}</strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Aturan Persetujuan</h2>
        <Link href={'/admin/rules/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Aturan</span>
          </Button>
        </Link>
      </div>

      <div className="mt-6">{renderContent()}</div>
    </PageContainer>
  )
}
