import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen.ts";
import "./index.css";
import { FacultyProvider } from "./context/FacultyContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { axiosInstance } from "./lib/axios.ts";
import { setAuth, clearAuth } from "./lib/auth-store.ts";

axiosInstance
  .post("/auth/refresh")
  .then((res) => {
    const { user, access_token } = res.data.data;
    setAuth(user, access_token);
  })
  .catch(() => {
    clearAuth();
  });

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <FacultyProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </FacultyProvider>
    </AuthProvider>
  </StrictMode>,
);
