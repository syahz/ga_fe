import { z } from 'zod'

// Skema untuk satu step (digunakan di beberapa tempat)
const stepSchema = z.object({
  stepOrder: z.number(),
  stepType: z.enum(['CREATE', 'REVIEW', 'APPROVE']),
  roleId: z.string().min(1, 'Role harus dipilih.')
})

/**
 * Skema validasi untuk form Create/Edit Rule secara keseluruhan.
 */
export const RuleFormValidation = z
  .object({
    name: z.string().min(3, 'Nama aturan minimal 3 karakter.'),
    minAmount: z.number('Nominal harus berupa angka.').nonnegative('Nominal tidak boleh negatif.'),
    maxAmount: z.number('Nominal harus berupa angka.').nonnegative('Nominal tidak boleh negatif.').nullable(),
    steps: z.array(stepSchema).length(3, 'Harus ada tepat 3 langkah persetujuan.')
  })
  .refine(
    (data) => {
      if (data.maxAmount !== null && data.minAmount !== null) {
        return data.maxAmount >= data.minAmount
      }
      return true
    },
    {
      message: 'Nominal maksimal tidak boleh lebih kecil dari minimal.',
      path: ['maxAmount']
    }
  )

export type RuleFormValues = z.infer<typeof RuleFormValidation>

/**
 * Skema validasi HANYA untuk mengedit detail (nama & nominal)
 */
export const EditRuleDetailValidation = RuleFormValidation.pick({
  name: true,
  minAmount: true,
  maxAmount: true
})

export type EditRuleDetailFormValues = z.infer<typeof EditRuleDetailValidation>

/**
 * Skema validasi HANYA untuk mengedit steps di dalam modal.
 */
export const StepsValidation = z.object({
  steps: z
    .array(
      z.object({
        roleId: z.string().min(1, 'Role harus dipilih.')
      })
    )
    .length(3)
})

export type StepsFormValues = z.infer<typeof StepsValidation>
