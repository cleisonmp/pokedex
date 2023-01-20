import { type AppType } from 'next/dist/shared/lib/utils'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
