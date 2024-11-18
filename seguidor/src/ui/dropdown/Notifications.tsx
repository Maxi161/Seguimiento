"use client"

import { useUserContext } from "@/context/user.context";
import { IConnection } from "@/interfaces/user.interfaces";
import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";


interface NotificationsDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: IConnection[];
}

const NotificationsDrawer = ({ open, setOpen, notifications }: NotificationsDrawerProps) => {

  const [notis, setNotis] = useState<IConnection[]>([])
  const  {changeConnection} = useUserContext()

  useEffect(() => {
    setNotis(notifications)
  }, [notifications])

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const takeOut = (notification: IConnection) => {
    const newNotis = notis.filter((noti) => noti.id !== notification.id)
    setNotis(newNotis)
  }

  const handleAccept = (notification: IConnection) => {
    // Lógica para aceptar la conexión
    console.log("Conexión aceptada:", notification);
    const sendResponse = async () => {
      await changeConnection(notification.id, "accept")
    }
    sendResponse()
    takeOut(notification)
  };

  const handleReject = (notification: IConnection) => {
    // Lógica para rechazar la conexión
    console.log("Conexión rechazada:", notification);
    const sendResponse = async () => {
      await changeConnection(notification.id, "reject")
    }
    sendResponse()
    takeOut(notification)
  };

  return (
    <Drawer anchor={"right"} open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 350, height: "100vh", background: "rgb(14, 14, 14)", color: "white" }}>
        <List>
          {notis.map((notification, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => {}}>
                <ListItemIcon>
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="44" 
                height="44" 
                viewBox="0 0 24 24">
                  <path 
                  fill="white" 
                  d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>
                </svg>
                </ListItemIcon>
                <ListItemText className="text-white" primary={notification.userA.name} /> 
              </ListItemButton>
              <div className="w-7/12 h-2/5 z[5000] obsolute flex flex-row">
              <Button className="bg-green-600 w-5/12" onClick={() =>  handleAccept(notification)}>
              <svg 
              xmlns="http://www.w3.org/2000/svg"
             width="24" 
             height="24" 
             viewBox="0 0 20 20">
              <path 
              fill="#00ff40" 
              d="m14.83 4.89l1.34.94l-5.81 8.38H9.02L5.78 9.67l1.34-1.25l2.57 2.4z"/>
              </svg>
              </Button>
              <Button className="bg-red-600 w-5/12" onClick={() => handleReject(notification)}>
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 20 20">
                <path 
                fill="#b10404" 
                d="m12.12 10l3.53 3.53l-2.12 2.12L10 12.12l-3.54 3.54l-2.12-2.12L7.88 10L4.34 6.46l2.12-2.12L10 7.88l3.54-3.53l2.12 2.12z"/>
              </svg>
              </Button>
              </div>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export { NotificationsDrawer };
