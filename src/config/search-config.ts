/**
 * Tipe untuk setiap item dalam dropdown filter.
 * Contoh: { value: 'S1', label: 'S1' }
 */
export interface SearchOption {
  value: string | number
  label: string
}

/**
 * Tipe untuk konfigurasi satu buah filter (dropdown).
 */
export interface FilterConfig {
  key: string // Kunci state untuk filter, contoh: 'roleId'
  placeholder: string // Teks yang muncul saat tidak ada yang dipilih
  options: SearchOption[] // Array opsi untuk dropdown
}

/**
 * Tipe utama untuk seluruh konfigurasi komponen search bar.
 */
export interface SearchConfig {
  placeholder: string
  searchButtonText: string
  resetButtonText: string
  filters?: FilterConfig[] // filters bersifat opsional (ditandai dengan '?')
}

// Ubah dari objek menjadi fungsi yang menerima options
export const getUsersSearchConfig = (rolesOptions: SearchOption[], unitsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari pengguna...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'roleId',
        placeholder: 'Semua Role', // Ganti placeholder agar lebih deskriptif
        options: rolesOptions // Gunakan data dari parameter
      },
      {
        key: 'unitId', // Asumsi key untuk unit adalah 'unitId'
        placeholder: 'Semua Unit',
        options: unitsOptions // Gunakan data dari parameter
      }
      // Anda bisa menambahkan filter statis lain di sini jika perlu
    ]
  }
}

export const orderSearchConfig = {
  placeholder: 'Search...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}
