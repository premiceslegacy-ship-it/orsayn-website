import { useLocale } from 'next-intl'
import { usePathname, useRouter, Link } from '../i18n/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const switchLocale = (newLocale: 'fr' | 'en') => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <div className="flex items-center gap-3 font-medium">
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
                <button
                    onClick={() => switchLocale('fr')}
                    className={`transition-colors duration-500 ease-out ${locale === 'fr'
                        ? 'text-brass'
                        : 'text-ink/20 hover:text-ink/60'
                        }`}
                >
                    FR
                </button>
                <span className="text-ink/10 font-light px-1">|</span>
                <button
                    onClick={() => switchLocale('en')}
                    className={`transition-colors duration-500 ease-out ${locale === 'en'
                        ? 'text-brass'
                        : 'text-ink/20 hover:text-ink/60'
                        }`}
                >
                    EN
                </button>
            </div>
        </div>
    )
}
