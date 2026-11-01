import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Routing from "./components/routing/Routing";

const tema = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#7c9cff" },
        background: { default: "#0f1220", paper: "#181c2e" },
    },
    shape: { borderRadius: 14 },
});

function App() {
    return (
        <ThemeProvider theme={tema}>
            <CssBaseline />
            <BrowserRouter>
                <AppBar position="static" color="transparent" elevation={0}
                        sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <Toolbar>
                        <Typography variant="h6" component={Link} to="/"
                                    sx={{ color: "inherit", fontWeight: 700 }}>
                            Spremljanje stroškov
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Routing />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;