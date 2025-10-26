import { BellIcon } from '@phosphor-icons/react';
import { SidebarTrigger } from '@shared/components/ui';
import { Separator } from './ui';

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={`bg-card border-b md:mx-4 md:rounded-b-xl border-background z-30${className ? ` ${className}` : ''}`}
    >
      <div className="ps-4 pe-8 flex items-center justify-between h-18.5">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-base-bold">Products</h1>
        </div>

        {/* Right: Notification */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
            <BellIcon size={18} weight="duotone" color="#a7a9ab" />
          </button>
        </div>
      </div>
    </header>
  );
}
