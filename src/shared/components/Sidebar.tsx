import { FoldersIcon } from '@phosphor-icons/react';
import sidebarLogo from '@assets/react.svg';

function Sidebar() {
  return (
    <aside className="h-screen w-20 bg-card flex flex-col justify-between items-center py-8 border-r border-background overflow-hidden z-20">
      {/* Top: Logo */}
      <div className="flex flex-col items-center gap-8">
        {/* Logo: Sidebar SVG */}
        <img src={sidebarLogo} alt="Sidebar Logo" className="w-14 h-14" />
        {/* Navigation: Folders icon in gold rounded square */}
        <div className="bg-foreground rounded-xl w-14 h-14 flex items-center justify-center">
          <FoldersIcon size={24} weight="duotone" className="text-primary" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
