'use client'
import Image from 'next/image'
import { LoginForm } from '../components/forms/LoginForm'
import { Suspense } from 'react'
import { LoginErrorHandler } from '../components/LoginErrorHandler'

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LoginErrorHandler />
      </Suspense>
      <div className="relative grid min-h-svh lg:grid-cols-2">
        <div className="absolute top-4 right-0 z-10 hidden lg:block">
          <div className="lg:flex bg-white/80 rounded-l-4xl p-4 backdrop-blur-sm hidden items-center font-medium">
            <Image src="/img/LoginLogos.svg" width={150} height={150} alt="Logo" />
          </div>
        </div>
        <div className="relative flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            width={100}
            height={100}
            src="/img/LoginImage2.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
          />
        </div>
      </div>
    </>
  )
}
