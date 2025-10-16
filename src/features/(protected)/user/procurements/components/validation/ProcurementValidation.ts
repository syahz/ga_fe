import { z } from 'zod'

// Batas ukuran file (misal: 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024
// Tipe file yang diizinkan
const ACCEPTED_FILE_TYPES = ['application/pdf']

export const ProcurementFormValidation = z.object({
  letterNumber: z.string().min(1, 'Nomor surat wajib diisi.'),
  letterAbout: z.string().min(1, 'Perihal surat wajib diisi.'),
  nominal: z.number('Nominal harus berupa angka.').positive('Nominal harus lebih dari 0.'),
  incomingLetterDate: z.string().min(1, 'Tanggal surat wajib diisi.'),
  unitId: z.string().min(1, 'Unit wajib dipilih.'),
  letterFile: z
    .any()
    .refine((files) => files?.length == 1, 'File surat wajib diunggah.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal adalah 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), 'Format file tidak valid. Hanya .pdf yang diizinkan.')
})

export type ProcurementFormValues = z.infer<typeof ProcurementFormValidation>

export const EditProcurementFormValidation = z.object({
  letterNumber: z.string().min(1, 'Nomor surat wajib diisi.'),
  letterAbout: z.string().min(1, 'Perihal surat wajib diisi.'),
  nominal: z.number('Nominal harus berupa angka.').positive('Nominal harus lebih dari 0.'),
  incomingLetterDate: z.string().min(1, 'Tanggal surat wajib diisi.'),
  unitId: z.string().min(1, 'Unit wajib dipilih.'),
  letterFile: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal adalah 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Format file tidak valid. Hanya .pdf yang diizinkan.'
    )
})

export type EditProcurementFormValues = z.infer<typeof EditProcurementFormValidation>

export const ProcessDecisionValidation = z.object({
  decision: z.nativeEnum(
    { APPROVE: 'APPROVE', REJECT: 'REJECT', REQUEST_REVISION: 'REQUEST_REVISION' },
    { error: 'Anda harus memilih salah satu keputusan.' }
  ),
  comment: z.string().max(1000, 'Komentar tidak boleh lebih dari 1000 karakter.').optional()
})

export type ProcessDecisionFormValues = z.infer<typeof ProcessDecisionValidation>
