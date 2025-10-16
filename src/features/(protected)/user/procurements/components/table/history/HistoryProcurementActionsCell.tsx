'use client'

import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { ProcurementHistoryLog, ProcurementStatus } from '@/types/api/procurementType'
// import { ProcessDecisionModal } from '../../ProcessDecisionModal'
import Link from 'next/link'

interface ProcurementActionsCellProps {
  row: { original: ProcurementHistoryLog }
}

export function ProcurementActionsCell({ row }: ProcurementActionsCellProps) {
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const procurement = row.original

  return (
    <>
      {/* Modal akan dirender di sini tapi tersembunyi hingga dipicu */}
      {/* <ProcessDecisionModal procurement={procurement} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
      <div className="flex gap-2">
        {procurement.letter.status === ProcurementStatus.NEEDS_REVISION ? (
          <Link href={`/user/procurements/edit/${procurement.letter.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Revisi Pengajuan
            </Button>
          </Link>
        ) : (
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Proses Keputusan
          </Button>
        )}
      </div>
    </>
  )
}
