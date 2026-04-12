'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const navItems = [
  { href: '/', icon: '🏠', labelEn: 'Home', labelSv: 'Hem' },
  { href: `/lesson/w1-c1-l1`, icon: '📖', labelEn: 'Learn', labelSv: 'Lär', dynamic: true },
  { href: '/review', icon: '🧠', labelEn: 'Review', labelSv: 'Repetera' },
  { href: '/progress', icon: '📊', labelEn: 'Stats', labelSv: 'Statistik' },
  { href: '/more', icon: '🔤', labelEn: 'More', labelSv: 'Mer' },
];

export function BottomNav() {
  const pathname = usePathname();
  const lang = useStore(s => s.settings.baseLanguage);
  const currentLesson = useStore(s => s.progress.currentLessonId);
  const dueCards = useStore(s => s.getDueCardCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const href = item.dynamic ? `/lesson/${currentLesson}` : item.href;
          const isActive = item.dynamic
            ? pathname.startsWith('/lesson')
            : item.href === '/more'
            ? pathname === '/more' || pathname === '/alphabet' || pathname === '/grammar' || pathname === '/settings' || pathname.startsWith('/more/')
            : pathname === item.href;

          return (
            <Link
              key={item.labelEn}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.labelEn === 'Review' && dueCards > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {dueCards > 99 ? '99+' : dueCards}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">
                {lang === 'sv' ? item.labelSv : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
