import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Recursos", href: "/#features" },
    { name: "Preços", href: "/#pricing" },
    { name: "Blog", href: "/#blog" },
    { name: "Contato", href: "/#contact" }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'dark:bg-black/80 bg-white/80 backdrop-blur-md shadow-md' 
        : 'dark:bg-transparent dark:bg-gradient-to-b dark:from-black/50 dark:to-transparent bg-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <div className="cursor-pointer">
                <span className="sr-only">Mappe.ia</span>
                <div className="h-10 w-auto relative flex items-center font-poppins font-bold text-2xl">
                  <span className="text-primary">Mappe</span>
                  <span className="dark:text-white text-gray-800">.ia</span>
                  <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-transparent"></div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <Button 
              variant="ghost" 
              className="rounded-full p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <a 
                  className={`
                    text-base font-medium 
                    dark:text-gray-300 text-gray-700 
                    hover:text-primary dark:hover:text-primary 
                    relative pb-1 transition-colors
                    ${location === item.href ? 'text-primary dark:text-primary' : ''}
                  `}
                >
                  {item.name}
                  {location === item.href && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[2px] bg-primary"
                      layoutId="navbar-underline"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Desktop right section */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <ThemeToggle className="mr-2" />
            
            {user ? (
              <Link href="/dashboard">
                <Button className="ml-2 px-6">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="ml-2 px-6">
                    Registrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden mt-14"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-900 bg-white dark:glassmorphism divide-y-2 divide-gray-50 dark:divide-gray-800">
              <div className="pt-5 pb-6 px-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-4 gap-x-8">
                  <nav className="grid gap-y-5">
                    {navItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a 
                          className={`
                            -m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800
                            ${location === item.href ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-gray-200'}
                          `}
                          onClick={closeMobileMenu}
                        >
                          <span className="ml-3 text-base font-medium">{item.name}</span>
                        </a>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              
              <div className="py-6 px-5 space-y-6">
                <div className="flex items-center justify-between">
                  <ThemeToggle />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Alterar tema</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {user ? (
                    <Link href="/dashboard">
                      <Button className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button variant="outline" className="w-full">
                          Entrar
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button className="w-full">
                          Registrar
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingNavbar;