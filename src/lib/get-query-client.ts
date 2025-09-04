/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    isServer,
    QueryClient,
    MutationCache,
    defaultShouldDehydrateQuery,
} from '@tanstack/react-query'


const TOKEN_MINUTE = 60 * 1000;

function makeQueryClient() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 2 * TOKEN_MINUTE,
                staleTime: TOKEN_MINUTE,
                refetchInterval: TOKEN_MINUTE,
                retry: 3,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
        },
        mutationCache: new MutationCache({
            onSuccess: (_data, _variables, _context, _mutation) => {
                // Optional: custom success handling
            },

            onError: (_error, _variables, _context, _mutation) => {
                // Optional: custom error handling
            },

            onSettled: (_data, _error, _variables, _context, mutation) => {
                if (mutation.meta?.invalidatesQuery) {
                    queryClient.invalidateQueries({
                        queryKey: mutation.meta.invalidatesQuery,
                    })
                }
            },
        }),
    })

    return queryClient
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
    if (isServer) {
        return makeQueryClient()
    } else {
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient()
        }
        return browserQueryClient
    }
}