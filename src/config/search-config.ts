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
  key: string
  placeholder: string
  options: SearchOption[]
}

/**
 * Tipe utama untuk seluruh konfigurasi komponen search bar.
 */
export interface SearchConfig {
  placeholder: string
  searchButtonText: string
  resetButtonText: string
  filters?: FilterConfig[]
}

export const getDashboardSearchConfig = (unitsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari berdasarkan nomor surat, perihal, atau nominal...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'unitId',
        placeholder: 'Semua Unit',
        options: unitsOptions
      }
    ]
  }
}

export const getUsersSearchConfig = (rolesOptions: SearchOption[], unitsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari pengguna...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'roleId',
        placeholder: 'Semua Role',
        options: rolesOptions
      },
      {
        key: 'unitId',
        placeholder: 'Semua Unit',
        options: unitsOptions
      }
    ]
  }
}

export const ProcurementSearchConfig = {
  placeholder: 'Cari berdasarkan nomor surat, perihal, atau nominal...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}
export const orderSearchConfig = {
  placeholder: 'Search...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}
