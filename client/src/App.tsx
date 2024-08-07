import React from 'react';
import {AuthProvider} from "./context/AuthContext";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {blueGrey, blue} from '@mui/material/colors';
import {ApplicationProvider} from "./context/ApplicationContext";
import MainLayout from "./componens/layout/MainLayout";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: blue[900],
        },
        secondary: {
            main: blueGrey[500],
        },
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <ApplicationProvider>
                    <CssBaseline/>
                    <MainLayout />
                </ApplicationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;