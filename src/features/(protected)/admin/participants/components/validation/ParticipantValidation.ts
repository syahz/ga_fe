import * as z from 'zod'

export const CreateParticipantValidation = z
  .object({
    // ... (Schema CreateParticipantValidation tidak diubah)
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password harus memiliki minimal 8 karakter')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
      .refine((value) => !/\s/.test(value), {
        message: 'Password tidak boleh mengandung spasi'
      }),
    confirmPassword: z.string(),
    unitId: z.string().uuid('Unit Id tidak valid'),
    roleId: z.string().uuid('Role Id tidak valid')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password harus sesuai dengan password',
    path: ['confirmPassword']
  })

export type CreateParticipantFormValues = z.infer<typeof CreateParticipantValidation>

const PasswordSchema = z
  .string()
  .min(8, 'Password harus memiliki minimal 8 karakter')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
  .refine((value) => !/\s/.test(value), {
    message: 'Password tidak boleh mengandung spasi'
  })

export const UpdateParticipantValidation = z
  .object({
    name: z.string().min(2, 'Nama minimal harus 2 karakter.'),
    email: z.string().email('Mohon masukkan alamat email yang valid.'),
    roleId: z.string().uuid('Mohon pilih role yang valid.'),
    unitId: z.string().uuid('Mohon pilih unit yang valid.'),

    password: z.union([z.literal(''), PasswordSchema]).optional(),

    // confirmPassword harus tetap string (bisa kosong)
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      // 🔑 PERBAIKAN UTAMA 2: Memeriksa panjang > 0 sebelum membandingkan
      // Ini memastikan perbandingan hanya terjadi jika user benar-benar mengisi password baru
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword
      }
      return true // Lolos jika password kosong
    },
    {
      path: ['confirmPassword'],
      message: 'Password dan konfirmasi password tidak cocok.'
    }
  )

export type UpdateParticipantFormValues = z.infer<typeof UpdateParticipantValidation>
