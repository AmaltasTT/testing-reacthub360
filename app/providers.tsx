'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/auth-context'
import { AuthHandler } from './auth-handler'
import { SubscriptionHandler } from './subscription-handler'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient in component to avoid sharing between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Avoid refetching immediately on mount in Next.js
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AuthHandler>
            <SubscriptionHandler>
              <Sonner />
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </SubscriptionHandler>
          </AuthHandler>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
