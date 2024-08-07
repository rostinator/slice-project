import React, {useContext} from "react";
import {Button, Container, Stack, Typography} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

const SignOut: React.FC = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {logout} = useContext(AuthContext) as AuthContextType

    const handleLogout = (): void => {
        logout()
        navigate('/ui')
    }

    return (
        <Stack
            mt={3}
            direction="column"
            alignItems="center"
        >
            <Container
                maxWidth='xs'
            >
                <Stack
                    sx={{
                        border: 1,
                        p: 3,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant='h5' mb={2}>
                        {t("user.logoutPageTitle")}
                    </Typography>
                    <Button
                        size="small"
                        variant="contained"
                        endIcon={<ChevronRightIcon/>}
                        onClick={handleLogout}
                    >
                        {t("user.logout")}
                    </Button>
                </Stack>
            </Container>
        </Stack>
    )
}

export default SignOut