// CourseSidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  Button,
} from '@mui/material';

const drawerWidth = 240;

const CourseSidebar = ({ sections, mobileOpen, handleDrawerToggle, handleClickItem }) => {
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button key="all">
          <Button onClick={() => { handleClickItem(null) }}
            fullWidth
            sx={{ justifyContent: 'center', textTransform: 'none' }}
          >
            <ListItemText primary="Show all course content" />
          </Button>
        </ListItem>
        {sections.map((section) => (
          <ListItem button key={section.public}>
            <Button onClick={() => { handleClickItem(section) }}
              fullWidth
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              <ListItemText primary={section.name} />
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <nav aria-label="course sections">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default CourseSidebar;
