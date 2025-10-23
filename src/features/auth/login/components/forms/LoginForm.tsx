'use client'

import { cn } from '@/lib/utils'
import { setAccessToken } from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/api/useAuth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoginValidation, type LoginFormValues } from '@/features/auth/login/components/validation/LoginValidation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Chrome } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { mutateAsync: loginUser, isPending, error } = useLogin()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await loginUser(values)
      setAccessToken(data.accessToken)

      toast.success('Login berhasil!')
      router.push('/admin')
    } catch (err) {
      console.error(err)
      toast.error('Login gagal, silakan coba lagi.' + (err instanceof Error ? ` (${err.message})` : ''))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Lupa Password</DialogTitle>
                        <DialogDescription>
                          Jika Anda lupa password, silakan menghubungi manajemen <strong>LPH UB</strong> untuk reset akun.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <p>LPH Universitas Brawijaya</p>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm font-medium text-destructive">{error.message}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or Login With</span>
        </div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`} className="w-full">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Chrome className="h-4 w-4" />
          Login dengan Google
        </Button>
      </a>
    </Form>
  )
}
