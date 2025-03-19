import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function Sidebar() {
  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <h1 className="font-bold text-xl">Afyon Kocatepe Üniversitesi</h1>
      </SidebarHeader>
      <br />
      <SidebarContent className="text-lg px-4">
        <Link href="https://eem.aku.edu.tr/">Bölüm Sayfası</Link>
        <Link href="https://github.com/wcnrny/esp32-school-system-frontend">
          GitHub
        </Link>
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
}
