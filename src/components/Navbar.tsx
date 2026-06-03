import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function Navbar() {
  // Payload veritabanına bağlanıp Header (Üst Menü) verilerini çekiyoruz
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({ slug: 'header' });
  
  // Eğer panelden link girilmemişse hata vermemesi için boş dizi oluşturuyoruz
  const navItems = header?.navItems || [];

  return (
    <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo Alanı */}
        <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
          BITECH<span className="text-emerald-500">SOFT</span>
        </Link>

        {/* Dinamik Menü Linkleri (Panelden Gelenler) */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.url} 
              className="text-neutral-300 hover:text-emerald-500 transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Harekete Geçirici Sabit Buton */}
          <Link 
            href="/iletisim" 
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all"
          >
            Bize Ulaşın
          </Link>
        </div>

      </div>
    </nav>
  );
}