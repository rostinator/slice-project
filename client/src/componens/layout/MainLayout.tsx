import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import {useContext, useEffect, useState} from "react";
import {AuthContext, AuthContextType} from "../../context/AuthContext";
import OpenMenu from '../common/OpenMenu';
import {Avatar, Badge, MenuItem} from '@mui/material';
import LoginIcon from "@mui/icons-material/Login";
import LinkButton from "../common/LinkButton";
import {userInitials} from "../../utils/commonUtils";
import {AccountCircle, Logout} from "@mui/icons-material";
import {useNavigate} from "react-router";
import AppRoutes from "../../AppRoutes";
import HomeIcon from '@mui/icons-material/Home';
import {grey} from "@mui/material/colors";
import ListItemWithMenu from "../common/ListItemWithMenu";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddIcon from "@mui/icons-material/Add";
import SimplyListItem from "../common/SimplyListItem";
import PropaneOutlinedIcon from "@mui/icons-material/PropaneOutlined";
import {Project} from "../../model/models";
import {UserAPI} from "../../api/UserAPI";
import CreateProjectDialog from "../dialog/CreateProjectDialog";
import ArticleIcon from '@mui/icons-material/Article';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import {ApplicationContext, ApplicationContextType} from "../../context/ApplicationContext";
import {useTranslation} from "react-i18next";

type SettingMenuItem = {
    linkTo: string,
    text: string,
    icon: React.ReactNode
}

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function MainLayout() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {isAuthorized, currentUser} = useContext(AuthContext) as AuthContextType
    const {openDrawer, openOrCloseDrawer} = useContext(ApplicationContext) as ApplicationContextType

    type OpenMenuHandler = React.ElementRef<typeof OpenMenu>;
    const openMenuRef = React.useRef<OpenMenuHandler>(null);
    type OpenMenuRef = React.ElementRef<typeof OpenMenu>;
    const projectOpenMenuRef = React.useRef<OpenMenuRef>(null);

    const [openProjectDialog, setOpenProjectDialog] = useState<boolean>(false)
    const [userProjects, setUserProjects] = useState<Project[]>([])
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>()

    const settings: SettingMenuItem[] = [
        {
            linkTo: '/ui/account',
            text: t("user.myAccount"),
            icon: <AccountCircle/>
        },
        {
            linkTo: '/ui/sign-out',
            text: t("user.logout"),
            icon: <Logout/>
        }
    ]

    useEffect(() => {
        if (currentUser) {
            UserAPI.getAllProjects(currentUser.id)
                .then(response => {
                    if (response.isSuccessful && response.data)
                        setUserProjects(response.data)
                })

            UserAPI.getUnreadNotificationsCount(currentUser.id)
                .then(response => {
                    if (response.isSuccessful)
                        setUnreadNotificationsCount(response.data)
                })
        } else {
            setUserProjects([])
        }
    }, [currentUser])

    const handleAddProjectMenuItem = () => {
        projectOpenMenuRef?.current?.handleCloseMenu()
        setOpenProjectDialog(true)
    }

    const handleNavigateToProjectsMenuItem = () => {
        projectOpenMenuRef?.current?.handleCloseMenu()
        navigate("/ui/projects")
    }

    const handleCloseProjectDialog = (project?: Project) => {
        if (project)
            setUserProjects(prevState => {
                prevState.push(project)
                return prevState
            })
        setOpenProjectDialog(false)
    }

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>): void => {
        openMenuRef?.current?.handleOpenMenu(event)
    }

    const handleMenuSelect = (linkTo: string): void => {
        openMenuRef?.current?.handleCloseMenu()
        navigate(linkTo)
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
                elevation={0}
            >
                <Toolbar
                    disableGutters={true}
                    variant="regular"
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {isAuthorized() ?
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => openOrCloseDrawer()}
                            >
                                <MenuIcon/>
                            </IconButton>
                            :
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => navigate('/ui')}
                            >
                                <LocalPizzaIcon/>
                            </IconButton>
                        }
                        <Typography
                            variant='h6'
                            // sx={{ml: 1}}
                        >
                            {t('common.appName')}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 0,
                            display: 'flex',
                            mx: 1,
                            alignItems: 'center'
                        }}
                    >
                        <IconButton onClick={() => navigate('/ui/tutorial')} sx={{mr: 1}}>
                            <QuestionMarkIcon fontSize='small' style={{color: "white"}}/>
                        </IconButton>
                        {isAuthorized() ?
                            <>
                                <IconButton onClick={() => navigate('/ui/notifications')} sx={{mr: 1}}>
                                    <Badge badgeContent={unreadNotificationsCount} color='error'>
                                        <NotificationsIcon fontSize='medium' style={{color: "white"}}/>
                                    </Badge>
                                </IconButton>
                                <IconButton size='large' onClick={handleOpenMenu}>
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {userInitials(currentUser?.firstName, currentUser?.lastName)}
                                    </Avatar>
                                </IconButton>
                                <OpenMenu ref={openMenuRef}>
                                    {settings.map((setting) => (
                                        <MenuItem key={setting.text}
                                                  onClick={() => handleMenuSelect(setting.linkTo)}>
                                            <ListItemIcon>
                                                {setting.icon}
                                            </ListItemIcon>
                                            <ListItemText>{setting.text}</ListItemText>
                                        </MenuItem>
                                    ))}
                                </OpenMenu>
                            </>
                            :
                            <LinkButton
                                linkTo='/ui/sign-in'
                                icon={<LoginIcon/>}
                                buttonText={t("user.signIn2")}
                            />
                        }

                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={isAuthorized() && openDrawer}
                sx={{
                    width: drawerWidth,
                    // flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box', backgroundColor: grey[200]},
                }}
            >
                <Toolbar/>
                <List disablePadding dense sx={{p: 0.5}}>
                    <Divider/>
                    <ListItemButton sx={{my: 0.5}} onClick={event => navigate('/ui')}>
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText
                            // primaryTypographyProps={{
                            //     color: grey[900],
                            //     variant: "body1",
                            //     fontWeight: "bold",
                            //     letterSpacing: 0,
                            // }}
                            primary={t("common.home")}
                        />
                    </ListItemButton>
                    <Divider/>
                    <ListItemButton sx={{my: 0.5}} onClick={event => navigate('/ui/overview')}>
                        <ListItemIcon>
                            <ArticleIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={t("common.overview")}
                        />
                    </ListItemButton>
                    <Divider/>
                    <ListItemWithMenu
                        initialOpenState
                        primaryText={t("project.projects")}
                        icon={<BusinessCenterIcon fontSize='small'/>}
                        menuItems={[
                            <MenuItem key={1} onClick={handleAddProjectMenuItem}>
                                <ListItemIcon>
                                    <AddIcon fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText>{t("project.create")}</ListItemText>
                            </MenuItem>,

                            <MenuItem key={2} onClick={handleNavigateToProjectsMenuItem}>
                                <ListItemIcon>
                                    <ListAltIcon fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText>{t("project.projects")}</ListItemText>
                            </MenuItem>
                        ]}
                        collapseContent={
                            <List component="div" dense disablePadding sx={{pl: 2}}>
                                {userProjects.map((project) => (
                                    <SimplyListItem
                                        key={project.id}
                                        primaryText={project.name}
                                        icon={<PropaneOutlinedIcon fontSize='small'/>}
                                        onClick={() => navigate('/ui/projects/' + project.id)}
                                    />
                                ))}
                            </List>
                        }
                        openMenuRef={projectOpenMenuRef}
                    />
                </List>
            </Drawer>
            <Main open={openDrawer && isAuthorized()}>
                <DrawerHeader/>
                <AppRoutes/>
            </Main>

            <CreateProjectDialog open={openProjectDialog} handleClose={handleCloseProjectDialog}/>
        </Box>
    );
}