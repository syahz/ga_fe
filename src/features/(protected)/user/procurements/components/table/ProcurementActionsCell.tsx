'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Edit } from 'lucide-react'
import { Procurement } from '@/types/api/procurementType'
import { ProcessDecisionModal } from '../ProcessDecisionModal'
import Link from 'next/link'

interface ProcurementActionsCellProps {
  row: { original: Procurement }
}

export function ProcurementActionsCell({ row }: ProcurementActionsCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const procurement = row.original

  return (
    <>
      {/* Modal akan dirender di sini tapi tersembunyi hingga dipicu */}
      <ProcessDecisionModal procurement={procurement} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex gap-2">
        {procurement.status === 'NEEDS_REVISION' ? (
          <Link href={`/user/procurements/edit/${procurement.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Revisi Pengajuan
            </Button>
          </Link>
        ) : (
          <Button onClick={() => setIsModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Proses Keputusan
          </Button>
        )}
      </div>
    </>
  )
}
