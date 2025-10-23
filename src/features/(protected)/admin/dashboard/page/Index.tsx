import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { PageContainer } from '@/components/layout/PageContainer'

const Index = () => {
  const { user } = useAuth()

  return (
    <PageContainer>
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Hai, {user?.name || 'Pengguna'} 👋</h2>
        <p className="text-muted-foreground">Ini adalah ringkasan aktivitas pada unit {user?.unit}.</p>
      </div>
    </PageContainer>
  )
}

export default Index
