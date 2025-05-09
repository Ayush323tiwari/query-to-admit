
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  User, 
  BookOpen, 
  CheckSquare,
  BellDot,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!user) return null;

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/enquiries", label: "My Enquiries", icon: MessageSquare },
    { to: "/enrollment", label: "Enrollment", icon: FileText },
    { to: "/payments", label: "Payments", icon: CreditCard },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const counselorLinks = [
    { to: "/counselor/dashboard", label: "Dashboard", icon: Home },
    { to: "/counselor/enquiries", label: "Enquiries", icon: MessageSquare },
    { to: "/counselor/enrollments", label: "Enrollments", icon: FileText },
    { to: "/counselor/followups", label: "Follow-ups", icon: CheckSquare },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: Home },
    { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    { to: "/admin/enrollments", label: "Enrollments", icon: FileText },
    { to: "/admin/admissions", label: "Admissions", icon: CheckSquare },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/notifications", label: "Notifications", icon: BellDot },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  let links;
  switch (user.role) {
    case "student":
      links = studentLinks;
      break;
    case "counselor":
      links = counselorLinks;
      break;
    case "admin":
      links = adminLinks;
      break;
    default:
      links = [];
  }

  const SidebarContent = () => (
    <div className={cn("h-screen flex flex-col gap-2 p-4 bg-primary text-primary-foreground", className)}>
      <div className="font-bold text-xl mb-6 px-2">EduAdmit</div>

      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/10"
              )
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
