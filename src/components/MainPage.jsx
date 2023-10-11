import { styled, createTheme, ThemeProvider, } from '@mui/material/styles';
import { Fragment, useEffect, useState } from 'react';
import {CssBaseline,Button,Menu,MenuItem,Box,Toolbar,List, Typography, Divider,IconButton,ListItemButton,ListItemText,ListItemIcon} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import pages from './subpage';

// open drawer width
const drawerWidth = '13rem';
// upside bar
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:'#222e3b',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100vw - ${drawerWidth})`,
    backgroundColor:'#222e3b',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

//side bar
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
({ theme, open }) => ({
    '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
    width: theme.spacing(7),
        },
    }),
    },
}),
);

// upside bar height set
const mdTheme = createTheme({
    components:{
        MuiToolbar:{
            styleOverrides:{
                regular:{
                    minHeight:'3rem !important',
                    height:'3rem !important'
                }
            }
        }
    }
});
 
export default function MainPage(){
    // pagenation
const [selectedIndex, setSelectedIndex] = useState(0);
    const SubpageNow = pages[selectedIndex];
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    // side bar
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };


     return(
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar className='nav-bar' position="absolute" open={open}>
                <Toolbar
                    // variant='dense'
                    sx={{
                        pr: '5rem', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
            marginRight: '1rem',
                        ...(open && { display: 'none' }),
                    }}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                sx={{ flexGrow: 1, fontFamily:"BasicEB", fontWeight:"bold", fontSize:"1.3rem"  }}
                    >
                    해양예측모델 가시화 시스템
                    </Typography>
                    {/* <Button
                        id="log-button"
                        className='log-button'
                        aria-haspopup='true'
                        aria-controls={logopen?'log-menu':undefined}
                        onClick={handlelogClick}
                    >
                        <PersonRoundedIcon style={{marginRight:"0.5rem"}}/>
                        <span className='user-name'> {userName}</span>
                    </Button>
                    <Menu
                        id="log-menu"
                        anchorEl={anchorEl}
                        open={logopen}
                        onClose={handlelogClose}
                        MenuListProps={{
                        'aria-labelledby': 'log-button',
                        }}
                    >
                        <MenuItem onClick={(event)=>handlelogout(event)}>Logout</MenuItem>
                    </Menu> */}
                </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                <Toolbar
                    className='side-bar'
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List className='side-bar' component="nav">
                    <Fragment>
                        <Divider sx={{ my: 3, backgroundColor:'#fff', height:'1px', width:'90%', marginLeft:'5%' }} />
                        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                        <ListItemIcon>
                            <HomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                        </ListItemButton>

                        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                        <ListItemIcon>
                            <DashboardRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Visualize" />
                        </ListItemButton>

                        <Divider sx={{ my: 3, backgroundColor:'#fff', height:'1px', width:'90%', marginLeft:'5%' }} />

                        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                        <ListItemIcon>
                            <PersonRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="User" />
                        </ListItemButton>

                        <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                        <ListItemIcon>
                            <SettingsRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Setting" />
                        </ListItemButton>

                    </Fragment>
                </List>
                </Drawer>
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                <Toolbar />
                <div className="under-right">{SubpageNow}</div>
                </Box>
            </Box>
        </ThemeProvider>
 
     )
 }