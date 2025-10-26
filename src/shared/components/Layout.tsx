import { type ReactNode } from 'react';
import { Header } from '.';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/shared/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { FoldersIcon, SignOutIcon, CaretUpIcon } from '@phosphor-icons/react';
import sidebarLogo from '@assets/react.svg';
import { authService } from '../services';
import { getCurrentUser, getEmailInitials } from '../utils';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const userInitials = currentUser ? getEmailInitials(currentUser.email) : 'U';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-center py-4">
            <img src={sidebarLogo} alt="Logo" className="w-8 h-8" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Products" isActive>
                  <FoldersIcon size={20} weight="duotone" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {userInitials}
                    </div>
                    <span className="flex-1 text-left">
                      {currentUser?.email}
                    </span>
                    <CaretUpIcon size={16} weight="bold" className="shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={handleLogout}>
                    <SignOutIcon size={18} weight="duotone" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header className="sticky top-0 z-50" />
        <main className="flex-1 min-h-0 overflow-auto">
          <div className="py-6 h-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
