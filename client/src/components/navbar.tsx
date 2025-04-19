
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
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <span className="text-primary font-poppins font-bold text-xl">Mappe.ia</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
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
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href={user ? "/dashboard" : "/"}>
                <div className="text-primary font-poppins font-bold text-xl cursor-pointer">Mappe.ia</div>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={`${
                      isActive(item.href)
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Plano: <span className="font-medium text-primary">{
                  user.subscriptionTier === 'gratuito' 
                    ? 'Gratuito' 
                    : user.subscriptionTier === 'intermediario' 
                    ? 'Intermediário' 
                    : 'Avançado'
                }</span>
              </span>
              
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.firstName ? getInitials(user.firstName) : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.firstName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/subscription">
                    <DropdownMenuItem className="cursor-pointer">
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
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
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <span className="text-primary font-poppins font-bold text-xl">Mappe.ia</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {/* User info for mobile */}
                  <div className="flex items-center space-x-3 border-b pb-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.firstName ? getInitials(user.firstName) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Navigation for mobile */}
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div 
                          className={`${
                            isActive(item.href)
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          } group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon 
                            className={`${
                              isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                            } mr-3 h-5 w-5`}
                          />
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Profile & Subscription for mobile */}
                  <div className="space-y-1 border-t pt-4">
                    <Link href="/profile">
                      <div 
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="text-muted-foreground group-hover:text-accent-foreground mr-3 h-5 w-5" />
                        Meu Perfil
                      </div>
                    </Link>
                    
                    <Link href="/subscription">
                      <div 
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="text-muted-foreground group-hover:text-accent-foreground mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium">Tema</span>
                      <ThemeToggle />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-accent px-3"
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
