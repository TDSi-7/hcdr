/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "healthcaredeliveryreviews.co.uk"
      }
    ]
  }
};

export default nextConfig;
