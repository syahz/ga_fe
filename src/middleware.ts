import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Definisikan rute "rumah" berdasarkan peran
const roleHomeRoutes = {
  Admin: '/admin',
  // Asumsi semua user biasa diarahkan ke /user
  Staff: '/user',
  'Manajer Keuangan': '/user',
  GM: '/user',
  'General Affair': '/user',
  'Kadiv Keuangan': '/user',
  'Direktur Operasional': '/user',
  'Direktur Keuangan': '/user',
  'Direktur Utama': '/user'
}

// --- PERUBAHAN 1: Definisikan rute terproteksi secara terpisah ---
// Rute yang hanya bisa diakses oleh role tertentu
const roleSpecificRoutes = ['/admin', '/user']
// Rute yang bisa diakses SEMUA user yang sudah login
const sharedProtectedRoutes = ['/account']

const publicRoutes = ['/login', '/register', '/unauthorized']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const refreshToken = request.cookies.get('refresh_token')?.value
  const userRole = request.cookies.get('user_role')?.value as keyof typeof roleHomeRoutes | undefined

  // Cek apakah rute saat ini adalah salah satu dari rute yang perlu proteksi
  const isProtectedRoute = [...roleSpecificRoutes, ...sharedProtectedRoutes].some((prefix) => path.startsWith(prefix))

  // 1. Jika belum login dan mencoba akses halaman terproteksi -> redirect ke login
  if (!refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // 2. Jika sudah login
  if (refreshToken && userRole) {
    const homePath = roleHomeRoutes[userRole] || '/'

    // 2a. Jika mencoba akses halaman publik (login/register), arahkan ke dashboard masing-masing
    if (publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL(homePath, request.nextUrl))
    }

    // --- PERUBAHAN 2: Logika otorisasi yang lebih fleksibel ---
    const isAllowed =
      // Izinkan jika path dimulai dengan homepath rolenya (misal: Admin akses /admin)
      path.startsWith(homePath) ||
      // Izinkan jika path termasuk dalam rute bersama (misal: semua role akses /account)
      sharedProtectedRoutes.some((p) => path.startsWith(p))

    // 2b. Jika mencoba akses rute terproteksi tapi tidak diizinkan, redirect ke halaman utama mereka
    if (isProtectedRoute && !isAllowed) {
      console.warn(`Redirecting role '${userRole}' from unauthorized path '${path}' to '${homePath}'`)
      return NextResponse.redirect(new URL(homePath, request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
