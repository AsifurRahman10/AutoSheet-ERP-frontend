import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '../components/AppSidebar'
import { TopProfile } from '../components/TopProfile'

export const MainLayout = () => {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset
        className="
      p-0 
      rounded-none 
      shadow-none 
      bg-slate-50
      md:peer-data-[variant=inset]:m-0
      md:peer-data-[variant=inset]:ml-0
      md:peer-data-[variant=inset]:rounded-none
      md:peer-data-[variant=inset]:shadow-none
    "
      >
        <div className="flex flex-1 flex-col">
          <TopProfile user={user} signOut={signOut} />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
