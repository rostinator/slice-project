import React from "react";
import {Alert, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";


const Unauthorized: React.FC = () => {
    const {t} = useTranslation()

    return (
        <Stack
            mt={3}
            direction='column'
            alignItems='center'
        >
            <Alert severity="error">{t("common.unauthorized")}</Alert>
        </Stack>
    )
}

export default Unauthorized