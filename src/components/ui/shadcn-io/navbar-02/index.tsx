'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon, MenuIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type Event } from '@/api/fortunemusic/events';
import { formatDate } from '@/utils/date';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';
import { GithubIcon } from '../../icons/lucide-github';
import { IconButton } from '../icon-button';

// Types
export interface Navbar02NavItem {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: 'description' | 'simple' | 'icon';
  sortOrder?: number;
  items?: Array<{
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
}

// Artist color mapping
const getArtistColorClasses = (artistName: string): string => {
  const colorMap: Record<string, string> = {
    '乃木坂46': 'text-purple-600 hover:bg-purple-50 dark:text-purple-600 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card',
    '櫻坂46': 'text-pink-300 hover:bg-pink-50 dark:text-pink-300 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card',
    '日向坂46': 'text-sky-400 hover:bg-sky-50 dark:text-sky-400 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card',
  };

  return colorMap[artistName] || 'text-black hover:bg-gray-50 dark:text-white dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card';
};

export interface Navbar02Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  events: Map<number, Event[]>;
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
  onEventSelect?: (eventId: string) => void;
}


function convertEventsToNavigationLinks(events: Map<number, Event[]>): Navbar02NavItem[] {
  const items: Map<string, Event[]> = new Map();
  events.forEach((eventList, artistId) => {
    eventList.forEach((event) => {
      let artistName = event.artistName;
      if (items.has(artistName)) {
        items.get(artistName)?.push(event);
      } else {
        items.set(artistName, [event]);
      }
    });
  });

  const artistOrder = ["乃木坂46", "櫻坂46", "日向坂46", "=LOVE"];

  let barItems: Navbar02NavItem[] = [];
  items.forEach((eventList, artistName) => {
    let list = eventList.sort((a, b) => a.date.getTime() - b.date.getTime());
    let listItems: { href: string; label: string; description: string }[] = [];
    list.map((event) => {
      listItems.push({
        href: `${event.uniqueId}`,
        label: `${event.name}`,
        description: formatDate(event.date),
      });
    });

    let menuItem: Navbar02NavItem = {
      label: artistName,
      submenu: true,
      type: 'simple',
      sortOrder: artistOrder.indexOf(artistName),
      items: listItems,
    };
    // Define the custom sort order for artists
    barItems.push(menuItem);
  });

  barItems.sort((a, b) => {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  return barItems;
}

export const Navbar02 = ({
  className,
  logo = null,
  logoHref = '#',
  events = new Map<number, Event[]>(),
  onSignInClick,
  onCtaClick,
  onEventSelect,
  ...props
}: Navbar02Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [navigationLinks, setNavigationLinks] = useState<Navbar02NavItem[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    // Load theme from localStorage on initial render
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    return savedTheme || 'system';
  });

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsMobile(width < 768); // 768px is md breakpoint
      }
    };

    checkWidth();

    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let availableNavigationLinks = convertEventsToNavigationLinks(events);
    setNavigationLinks(availableNavigationLinks);
  }, [events]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    const applyTheme = (themeToApply: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(themeToApply);
    };

    if (theme === 'system') {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply selected theme
      applyTheme(theme);
    }
  }, [theme]);

  return (
    <header
      ref={containerRef}
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur px-4 md:px-6 [&_*]:no-underline',
        'bg-background/95 supports-[backdrop-filter]:bg-background/60',
        'dark:!bg-black/85 dark:supports-[backdrop-filter]:!bg-black/85',
        className
      )}
      {...props}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          {isMobile && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-1 max-h-[80vh] overflow-y-auto">
                <NavigationMenu className="max-w-none">
                  <NavigationMenuList className="flex-col items-start gap-0 select-none">
                    {navigationLinks.map((link, index) => {
                      const colorClasses = getArtistColorClasses(link.label);
                      return (
                        <NavigationMenuItem key={index} className="w-full">
                          {link.submenu ? (
                            <>
                              <div className={cn(
                                "px-2 py-1.5 text-xs font-medium border rounded-md mb-1",
                                colorClasses
                              )}>
                                {link.label}
                              </div>
                              <ul>
                                {link.items?.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (onEventSelect && item.href) {
                                          onEventSelect(item.href);
                                        }
                                      }}
                                      className="flex w-full items-left rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                                    >
                                      {item.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <button
                              onClick={(e) => e.preventDefault()}
                              className="flex w-full items-left rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                            >
                              {link.label}
                            </button>
                          )}
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          )}
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
            >
              <div className="text-2xl">
                {logo}
              </div>
              <span className="hidden font-bold text-xl sm:inline-block">Online Meet Dashboard</span>
            </button>
            {/* Navigation menu */}
            {!isMobile && (
              <NavigationMenu className="flex">
                <NavigationMenuList className="gap-1">
                  {navigationLinks.map((link, index) => {
                    const colorClasses = getArtistColorClasses(link.label);
                    return (
                      <NavigationMenuItem key={index}>
                        {link.submenu ? (
                          <>
                            <NavigationMenuTrigger className={cn(
                              'border transition-all',
                              colorClasses
                            )}>
                              {link.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              {link.type === 'simple' ? (
                                <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] text-left">
                                  {link.items?.map((item, itemIndex) => (
                                    <ListItem
                                      key={itemIndex}
                                      title={item.label}
                                      href={item.href}
                                      type={link.type}
                                      onEventSelect={onEventSelect}
                                    >
                                      {item.description}
                                    </ListItem>
                                  ))}
                                </div>
                              ) : (
                                <div className="grid gap-3 p-4">
                                  {link.items?.map((item, itemIndex) => (
                                    <ListItem
                                      key={itemIndex}
                                      title={item.label}
                                      href={item.href}
                                      type={link.type}
                                      onEventSelect={onEventSelect}
                                    >
                                      {item.description}
                                    </ListItem>
                                  ))}
                                </div>
                              )}
                            </NavigationMenuContent>
                          </>
                        ) : (
                          <NavigationMenuLink
                            href={link.href}
                            className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
                            onClick={(e) => e.preventDefault()}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        )}
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher defaultValue="system" onChange={setTheme} value={theme} />
          <IconButton
            icon={GithubIcon}
            color={[0, 0, 0]}
            onClick={() => window.open('https://github.com/payt0nc/web-fortunemusic-waiting-room', '_blank')}
            size="md"
          />
        </div>
      </div>
    </header>
  );
};

// ListItem component for navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
    href?: string;
    icon?: string;
    type?: 'description' | 'simple' | 'icon';
    children?: React.ReactNode;
    onEventSelect?: (uniqueId: string) => void;
  }
>(({ className, title, children, icon, type, href, onEventSelect, ...props }, ref) => {
  const renderIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    switch (iconName) {
      case 'BookOpenIcon':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'LifeBuoyIcon':
        return <LifeBuoyIcon className="h-5 w-5" />;
      case 'InfoIcon':
        return <InfoIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onEventSelect && href) {
      onEventSelect(href);
    }
  };

  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        onClick={handleClick}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer',
          className
        )}
        {...props}
      >
        {type === 'icon' && icon ? (
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              {renderIconComponent(icon)}
            </div>
            <div className="space-y-1">
              <div className="text-base font-medium leading-tight">{title}</div>
              {children && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-base font-medium leading-none">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </>
        )}
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = 'ListItem';