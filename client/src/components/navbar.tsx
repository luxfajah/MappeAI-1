import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  User, 
  LogOut, 
  Home, 
  Search, 
  FileText, 
  Bell,
  ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // For demo purposes - gets initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Nova Pesquisa", href: "/research/new", icon: Search },
    { name: "Relatórios", href: "/reports", icon: FileText },
  ];

  // Render login button if user is not logged in
  if (!user) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <span className="text-primary font-poppins font-bold text-xl">Mappe.ia</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user ? "/dashboard" : "/"}>
                <div className="text-primary font-poppins font-bold text-xl cursor-pointer">Mappe.ia</div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={`${
                      isActive(item.href)
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Plano: <span className="font-medium text-primary">{
                  user.subscriptionTier === 'gratuito' 
                    ? 'Gratuito' 
                    : user.subscriptionTier === 'intermediario' 
                    ? 'Intermediário' 
                    : 'Avançado'
                }</span>
              </span>
              
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.firstName ? getInitials(user.firstName) : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/subscription">
                    <DropdownMenuItem>
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10H3V14H7V10Z" />
                        <path d="M21 10H11V14H21V10Z" />
                        <path d="M11 4H3V8H11V4Z" />
                        <path d="M21 4H17V8H21V4Z" />
                        <path d="M7 16H3V20H7V16Z" />
                        <path d="M21 16H11V20H21V16Z" />
                      </svg>
                      <span>Planos e Assinatura</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="inline-flex items-center justify-center">
                  <span className="sr-only">Abrir menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <span className="text-primary font-poppins font-bold text-xl">Mappe.ia</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {/* User info for mobile */}
                  <div className="flex items-center space-x-3 border-b pb-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{user.firstName ? getInitials(user.firstName) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Navigation for mobile */}
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div 
                          className={`${
                            isActive(item.href)
                              ? "bg-gray-100 text-primary"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          } group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon 
                            className={`${
                              isActive(item.href) ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                            } mr-4 h-6 w-6`}
                          />
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Profile & Subscription for mobile */}
                  <div className="space-y-1 border-t pt-4 mt-4">
                    <Link href="/profile">
                      <div 
                        className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" />
                        Meu Perfil
                      </div>
                    </Link>
                    
                    <Link href="/subscription">
                      <div 
                        className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 10H3V14H7V10Z" />
                          <path d="M21 10H11V14H21V10Z" />
                          <path d="M11 4H3V8H11V4Z" />
                          <path d="M21 4H17V8H21V4Z" />
                          <path d="M7 16H3V20H7V16Z" />
                          <path d="M21 16H11V20H21V16Z" />
                        </svg>
                        Planos e Assinatura
                      </div>
                    </Link>
                  </div>
                  
                  {/* Theme & Logout for mobile */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between px-2 py-3">
                      <span className="text-sm font-medium text-gray-700">Tema</span>
                      <ThemeToggle />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
