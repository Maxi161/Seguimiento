import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Divider } from "@nextui-org/react";
import { useState } from "react";

const items = [
  {
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
];

const MenuDrawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250, height: "100vh", background: "rgb(14, 14, 14)", color: "white" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
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
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
