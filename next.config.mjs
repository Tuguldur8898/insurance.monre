import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_ERXES_ENDPOINT: "https://monre.erxes.io/gateway/graphql",
    NEXT_PUBLIC_ERXES_APP_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRQb3J0YWxJZCI6InJTclNHbVpOZXg1RzlpQ1NtLTZVeiIsImlhdCI6MTc3OTE5MTU0OX0.POsFPWKLj616ig7AFNG-q0SssUnMt6GcxLCx0R9vKFk",
    NEXT_PUBLIC_ERXES_CMS_ID: "6a5d86633b8bb0044203e69d",
    ERXES_APP_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRQb3J0YWxJZCI6InJTclNHbVpOZXg1RzlpQ1NtLTZVeiIsImlhdCI6MTc3OTE5MTU0OX0.POsFPWKLj616ig7AFNG-q0SssUnMt6GcxLCx0R9vKFk",
  },
};

export default withNextIntl(nextConfig);
