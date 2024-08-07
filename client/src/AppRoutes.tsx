import React, {useContext} from "react";
import {Route, Routes} from "react-router";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import {AuthContext, AuthContextType} from "./context/AuthContext";
import ProjectDetail from "./pages/ProjectDetail";
import AuthRoute from "./componens/common/AuthRoute";
import SingInForm from "./pages/SingInForm";
import TaskDetail from "./pages/TaskDetail";
import Overview from "./pages/Overview";
import ProjectMembers from "./pages/ProjectMembers";
import Notifications from "./pages/Notifications";
import Projects from "./pages/Projects";
import Tutorial from "./pages/Tutorial";
import AccountDetail from "./pages/AccountDetail";
import Unauthorized from "./pages/Unauthorized";

const AppRoutes: React.FC = () => {

    const {isAuthorized} = useContext(AuthContext) as AuthContextType

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/ui" element={<Home/>}/>
            <Route path="ui/sign-in" element={<SingInForm/>}/>
            <Route path="ui/sign-up" element={<SignUp/>}/>
            <Route path="ui/tutorial" element={<Tutorial/>}/>
            <Route path="ui/unauthorized" element={<Unauthorized/>}/>
            {isAuthorized() && <Route path="ui/sign-out" element={<SignOut/>}/>}
            <Route element={<AuthRoute />}>
                <Route path="ui/projects" element={<Projects/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/projects/:id" element={<ProjectDetail/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/projects/:id/members" element={<ProjectMembers/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/projects/:projectId/tasks/:id" element={<TaskDetail/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/notifications" element={<Notifications/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/overview" element={<Overview/>}/>
            </Route>
            <Route element={<AuthRoute />}>
                <Route path="ui/account" element={<AccountDetail/>}/>
            </Route>
        </Routes>
    )
}

export default AppRoutes