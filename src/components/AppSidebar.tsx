import { Home, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'
// ...existing code... (Button import removed because native button used)
import { useNavigate, useLocation } from 'react-router-dom'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: <Home />,
    },
    {
      title: 'Manage-Users',
      url: '/manage-users',
      icon: <Users />,
    },
  ],
}

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Sidebar className="px-0" collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div
                onClick={() => navigate('/')}
                className="h-[100px] cursor-pointer hover:!bg-transparent hover:!text-inherit hover:!shadow-none hover:!ring-0"
              >
                <div>
                  <h1 className="text-lg font-semibold text-blue-600">
                    AutoSheet
                  </h1>
                  <p className="text-sm text-gray-600">ERP System</p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarMenu className="items-start">
          {data.navMain.map((item, idx) => {
            const isActive = location.pathname === item.url

            return (
              <SidebarMenuItem className="w-full" key={`${item.title}-${idx}`}>
                <SidebarMenuButton className="p-0" asChild>
                  <button
                    onClick={() => navigate(item.url)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 h-[56px] transition-colors duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-500 font-semibold rounded-none'
                        : 'text-black hover:bg-gray-50'
                    }`}
                  >
                    {/* Left accent rail */}
                    <span className="w-2 h-full mr-2 flex-shrink-0">
                      {isActive ? (
                        <span className="block w-1 h-full rounded-r-md bg-gradient-to-b from-blue-600 to-blue-400"></span>
                      ) : (
                        <span className="block w-1 h-full rounded-r-md bg-transparent"></span>
                      )}
                    </span>

                    {/* Icon square */}
                    <span
                      className={`flex items-center justify-center w-10 h-10 rounded-md mr-2 ${
                        isActive ? ' text-blue' : 'bg-transparent text-black'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium">{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
