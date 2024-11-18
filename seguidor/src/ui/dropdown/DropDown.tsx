"use client"
import { useUserContext } from "@/context/user.context";
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationsDrawer } from "./Notifications";
import { IConnection } from "@/interfaces/user.interfaces";

const MenuDrawer = () => {
  const [open, setOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false)
  const { logout, getPendingConnections, user } = useUserContext();
  const [notifications, setNotifications] = useState<IConnection[]>([]);
  const router = useRouter();
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    if (!loadingNotifications) return;
  
    const fetchConnections = async () => {
      try {
        const data = await getPendingConnections(user?.id as string);
        setNotifications(data);
      } catch (error) {
        console.error('Error al obtener conexiones pendientes:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };
  
    if (user?.id) {
      fetchConnections();
    }
  }, [user?.id, loadingNotifications]);
  

  const list1 = [
    {
      handler: () => {
        router.push("/messages");
      },
      text: "Mensajes",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 11v.01M8 11v.01m8-.01v.01M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
          />
        </svg>
      ),
    },
    {
      handler: () => {
        alert("tula");
      },
      text: "Agregar Usuarios",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M9 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      handler: () => {
        setOpenNotifications(true)  // Manejamos la apertura del Drawer directamente aquí
      },
      text: "Notificaciones",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z" />
            <path d="M3 6.5l9 5.5l9 -5.5" />
          </g>
        </svg>
      ),
    },
  ];

  const list2 = [
    {
      handler: () => {
        logout();
      },
      text: "Salir",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M16 5v-1c0 -0.55 -0.45 -1 -1 -1h-9c-0.55 0 -1 0.45 -1 1v16c0 0.55 0.45 1 1 1h9c0.55 0 1 -0.45 1 -1v-1" />
            <path d="M10 12h11" />
            <path d="M21 12l-3.5 -3.5M21 12l-3.5 3.5" />
          </g>
        </svg>
      ),
    },
  ];

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250, height: "100vh", background: "rgb(14, 14, 14)", color: "white" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {list1.map((item, index) => (
          <ListItem key={`${item.text}-${index}`} disablePadding>
            <ListItemButton onClick={item.handler}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider className="bg-purple-800" />
      <List>
        {list2.map((item, index) => (
          <ListItem key={`${item.text}-${index}`} disablePadding>
            <ListItemButton onClick={item.handler}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
          <g fill="none" stroke="#ffffff" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M5 5h14">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0" />
            </path>
            <path d="M5 12h14">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0" />
            </path>
            <path d="M5 19h14">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0" />
            </path>
          </g>
        </svg>
      </Button>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <NotificationsDrawer open={openNotifications} setOpen={setOpenNotifications} notifications={notifications ? notifications : []} /> {/* Controlamos el estado del Drawer aquí */}
    </div>
  );
};

export default MenuDrawer;
