import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    // Yerel Payload media API'si + public klasörü (logo, favicon vb.)
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // public/ klasöründeki tüm statik görseller (bitechlogo.webp vb.)
        pathname: '/**',
      },
    ],
    // Harici görsel kaynakları (S3, CDN, vb. eklenirse buraya eklenmeli)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
      },
      ...((): any[] => {
        const urlStr = process.env.NEXT_PUBLIC_SERVER_URL;
        if (!urlStr) return [];
        try {
          const parsed = new URL(urlStr);
          return [{
            protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
            hostname: parsed.hostname,
            port: parsed.port || '',
          }];
        } catch {
          return [];
        }
      })(),
    ],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
