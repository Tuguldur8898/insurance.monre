import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";

export async function getServerApolloClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return new ApolloClient({
    link: new HttpLink({
      uri:
        process.env.GRAPHQL_URL ??
        process.env.NEXT_PUBLIC_GRAPHQL_URL ??
        "/graphql",
      headers: {
        "x-app-token": process.env.ERXES_APP_TOKEN ?? "",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      fetchOptions: { cache: "no-store" },
    }),
    cache: new InMemoryCache(),
  });
}
