import Link from "next/link";
import { brand } from "@/config/brand.config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-graphite text-ivory py-20 border-t border-stone/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Brand & Info */}
          <div>
            <h2 className="font-serif text-2xl mb-4">{brand.name}</h2>
            <p className="text-ivory/70 text-sm leading-relaxed max-w-sm">
              {brand.tagline} — Egy kortárs női kollekció, amely a minimalizmust és a funkcionális eleganciát ötvözi.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-sans text-ivory/50">
              Kapcsolat
            </h3>
            <address className="not-italic text-ivory/80 space-y-2 text-sm">
              <p>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-champagne transition-colors"
                >
                  {brand.contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
                  className="hover:text-champagne transition-colors"
                >
                  {brand.contact.phone}
                </a>
              </p>
              <p className="text-ivory/60">{brand.contact.address}</p>
            </address>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-sans text-ivory/50">
              Közösség
            </h3>
            <ul className="space-y-3 text-sm">
              {brand.social.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ivory/80 hover:text-champagne transition-colors"
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center text-xs text-ivory/50">
          <p>
            &copy; {currentYear} {brand.name}. Minden jog fenntartva.
          </p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link href="#" className="hover:text-ivory transition-colors">
              Adatvédelmi irányelvek
            </Link>
            <Link href="#" className="hover:text-ivory transition-colors">
              ÁSZF
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
