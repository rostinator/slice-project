import React, {useContext} from "react";
import {AuthContext, AuthContextType} from "../../context/AuthContext";
import {Navigate, Outlet} from "react-router-dom";

const AuthRoute: React.FC = () => {
    const {isAuthorized, currentUser} = useContext(AuthContext) as AuthContextType

    return (
        isAuthorized() ? <Outlet/> : <Navigate to="/ui/unauthorized" replace/>
    )
}

export default AuthRoute