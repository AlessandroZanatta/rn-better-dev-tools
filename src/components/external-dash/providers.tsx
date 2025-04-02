// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSyncQueriesWeb } from "./useSyncQueriesWeb";
import { User } from "../../types/User";
import { Socket } from "socket.io-client";
interface Props {
  children: React.ReactNode;
  selectedDevice: string;
  socket: Socket;
}

export default function Providers({ children, selectedDevice, socket }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: async ({ queryKey }) => {
              console.log("queryFn", queryKey);
              // Prevent refetch from throwing an error
              return Promise.resolve(null);
            },
          },
        },
      })
  );
  useSyncQueriesWeb({ queryClient, selectedDevice, socket });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
