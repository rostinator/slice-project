import React from "react";
import {MenuItemIcon} from "./menu/SelectMenu";
import {Priority, ProjectMemberStatus, ProjectRole, ProjectStatus, ProjectType, Status} from "../../../model/enums";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import HighlightIcon from "@mui/icons-material/Highlight";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import AdjustIcon from "@mui/icons-material/Adjust";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginIcon from '@mui/icons-material/Login';
import ReportIcon from '@mui/icons-material/Report';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {ViewMode} from "gantt-task-react";
import {
    blue,
    brown,
    deepOrange,
    green,
    grey,
    indigo,
    orange,
    purple,
    red,
    yellow
} from "@mui/material/colors";

export const priorityIcons: MenuItemIcon<Priority> [] = [
    {item: Priority.URGENT, icon: <PriorityHighIcon style={{color: red[900]}} fontSize='small'/>},
    {item: Priority.HIGH, icon: <HighlightIcon style={{color: deepOrange[800]}} fontSize='small'/>},
    {item: Priority.NORMAL, icon: <BeenhereIcon style={{color: blue[300]}} fontSize='small'/>},
    {item: Priority.LOW, icon: <LowPriorityIcon style={{color: grey[500]}} fontSize='small'/>},
]

export const projectTypeIcons: MenuItemIcon<ProjectType> [] = [
    {item: ProjectType.PUBLIC, icon: <GroupsIcon color='info' fontSize='small'/>},
    {item: ProjectType.PRIVATE, icon: <LockIcon color='disabled' fontSize='small'/>},
]

export const projectTypeIconsSmallMap: Map<ProjectType, React.ReactNode> = new Map(projectTypeIcons.map(obj => [obj.item, obj.icon]));

export const projectTypeIconsLarge: MenuItemIcon<ProjectType> [] = [
    {item: ProjectType.PUBLIC, icon: <GroupsIcon color='disabled' fontSize='large'/>},
    {item: ProjectType.PRIVATE, icon: <LockIcon color='disabled' fontSize='large'/>},
]
export const projectTypeIconsMap: Map<ProjectType, React.ReactNode> = new Map(projectTypeIconsLarge.map(obj => [obj.item, obj.icon]));

export const statusIcons: MenuItemIcon<Status> [] = [
    {item: Status.NEW, icon: <AdjustIcon color='secondary' fontSize='small'/>},
    {item: Status.DONE, icon: <CheckCircleIcon color='success' fontSize='small'/>},
    {item: Status.ON_HOLD, icon: <RemoveCircleIcon style={{color: orange[700]}} fontSize='small'/>},
    {item: Status.WAITING, icon: <NewReleasesIcon style={{color: indigo[500]}} fontSize='small'/>},
    {item: Status.IN_PROGRESS, icon: <DataThresholdingIcon color='info' fontSize='small'/>},
]

export const statusIconsMap: Map<Status, React.ReactNode> = new Map(statusIcons.map(obj => [obj.item, obj.icon]));

export const viewModeIcons: MenuItemIcon<ViewMode> [] = [
    {item: ViewMode.Hour, icon: <AccessTimeFilledIcon style={{color: red[400]}} fontSize='small'/>},
    {item: ViewMode.QuarterDay, icon: <AccessTimeFilledIcon style={{color: purple[500]}} fontSize='small'/>},
    {item: ViewMode.HalfDay, icon: <AccessTimeFilledIcon style={{color: blue[500]}} fontSize='small'/>},
    {item: ViewMode.Day, icon: <AccessTimeFilledIcon style={{color: green[500]}} fontSize='small'/>},
    {item: ViewMode.Week, icon: <AccessTimeFilledIcon style={{color: orange[500]}} fontSize='small'/>},
    {item: ViewMode.Month, icon: <AccessTimeFilledIcon style={{color: brown[500]}} fontSize='small'/>},
    {item: ViewMode.Year, icon: <AccessTimeFilledIcon style={{color: grey[500]}} fontSize='small'/>},
]

export const projectRoleIcons: MenuItemIcon<ProjectRole> [] = [
    {item: ProjectRole.OWNER, icon: <DirectionsWalkIcon style={{color: blue[500]}} fontSize='small'/>},
    {item: ProjectRole.MANAGER, icon: <ManageAccountsIcon style={{color: purple[500]}} fontSize='small'/>},
    {item: ProjectRole.READER, icon: <AutoStoriesIcon style={{color: grey[500]}} fontSize='small'/>},
    {item: ProjectRole.MEMBER, icon: <PeopleIcon style={{color: green[500]}} fontSize='small'/>},
]

export const projectMemberStatusIcons: MenuItemIcon<ProjectMemberStatus> [] = [
    {item: ProjectMemberStatus.ACTIVE, icon: <CheckCircleIcon style={{color: green[500]}} fontSize='small'/>},
    {
        item: ProjectMemberStatus.WAITING_FOR_CONFIRMATION,
        icon: <NotificationsIcon style={{color: yellow[500]}} fontSize='small'/>
    },
    {item: ProjectMemberStatus.CONFIRMATION_REJECTED, icon: <ReportIcon style={{color: grey[600]}} fontSize='small'/>},
    {item: ProjectMemberStatus.USER_LEFT_TEAM, icon: <LoginIcon style={{color: orange[500]}} fontSize='small'/>},
]

export const projectStatusIcons: MenuItemIcon<ProjectStatus> [] = [
    {item: ProjectStatus.NEW, icon: <CheckCircleIcon style={{color: green[500]}} fontSize='small'/>},
    {item: ProjectStatus.IN_PROGRESS, icon: <NotificationsIcon style={{color: yellow[500]}} fontSize='small'/>},
    {item: ProjectStatus.FINISHED, icon: <ReportIcon style={{color: grey[600]}} fontSize='small'/>},
    {item: ProjectStatus.CANCELLED, icon: <LoginIcon style={{color: orange[500]}} fontSize='small'/>},
]

export const projectStatusIconsMap: Map<ProjectStatus, React.ReactNode> = new Map(projectStatusIcons.map(obj => [obj.item, obj.icon]));