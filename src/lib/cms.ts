const ENDPOINT =
  process.env.GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_ERXES_ENDPOINT ??
  "";

const TOKEN =
  process.env.ERXES_APP_TOKEN ?? process.env.NEXT_PUBLIC_ERXES_APP_TOKEN ?? "";

export type CmsPage = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  content?: string;
  status?: string;
  customFieldsData?: Record<string, unknown>;
};

export type CmsMenuItem = {
  _id: string;
  label?: string;
  url?: string;
  order?: number;
  kind?: string;
  icon?: string;
  target?: string;
};

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  if (!ENDPOINT) return null;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T; errors?: unknown };
    return json.data ?? null;
  } catch {
    return null;
  }
}

const PAGE_FIELDS = `
  _id
  name
  slug
  description
  content
  status
  customFieldsData
`;

export async function getPages(language = "mn"): Promise<CmsPage[]> {
  const data = await gql<{ cpPages: CmsPage[] }>(
    `query CpPages($language: String) { cpPages(language: $language) { ${PAGE_FIELDS} } }`,
    { language }
  );
  return data?.cpPages ?? [];
}

export async function getPageBySlug(slug: string, language = "mn"): Promise<CmsPage | null> {
  const pages = await getPages(language);
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function getMenus(kind: "header" | "footer", language = "mn"): Promise<CmsMenuItem[]> {
  const data = await gql<{ cpMenus: CmsMenuItem[] }>(
    `query CpMenus($language: String, $kind: String) {
      cpMenus(language: $language, kind: $kind) {
        _id
        label
        url
        order
        kind
        icon
        target
      }
    }`,
    { language, kind }
  );
  const items = data?.cpMenus ?? [];
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
