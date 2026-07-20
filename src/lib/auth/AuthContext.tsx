"use client";

import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import {
  CLIENT_PORTAL_CURRENT_USER,
  type CPUser,
  type ClientPortalCurrentUserData,
} from "@/graphql/auth/queries/currentUser";
import { CLIENT_PORTAL_LOGOUT } from "@/graphql/auth/mutations/session";

type AuthContextValue = {
  user: CPUser | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  login: () => {},
  logout: async () => {},
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();

  const { data, loading, refetch } = useQuery<ClientPortalCurrentUserData>(
    CLIENT_PORTAL_CURRENT_USER,
    { errorPolicy: "ignore" }
  );

  const [logoutMutation] = useMutation(CLIENT_PORTAL_LOGOUT);

  const login = useCallback(
    (token: string) => {
      localStorage.setItem("token", token);
      refetch();
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } finally {
      localStorage.removeItem("token");
      await client.clearStore();
      refetch();
    }
  }, [logoutMutation, client, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.clientPortalCurrentUser ?? null,
        loading,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
