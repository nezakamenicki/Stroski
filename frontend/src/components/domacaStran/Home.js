import React from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Container, Typography } from "@mui/material";

const povezave = [
    { naslov: "Denarnica", opis: "Pregled celotnega stanja", pot: "/denarnica" },
    { naslov: "Dodaj strošek", opis: "Zabeleži nov izdatek", pot: "/dodaj" },
    { naslov: "Seznam stroškov", opis: "Pregled po kategorijah", pot: "/stroski" },
    { naslov: "Varčevalni račun", opis: "Preostali denar raje shrani, namesto porabi", pot: "/varcevanje" },
    { naslov: "Investicijski račun", opis: "Investiraj pametno", pot: "/investicije" },

];

export default function Home() {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Pametno z denarjem
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 5 }}>
                Beleži stroške, varčuj in spremljaj naložbe na enem mestu.
            </Typography>

            <Box sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}>
                {povezave.map((p) => (
                    <Card key={p.naslov} sx={{ opacity: p.pot ? 1 : 0.5 }}>
                        <CardActionArea
                            component={p.pot ? Link : "div"}
                            to={p.pot || undefined}
                            disabled={!p.pot}
                            sx={{ p: 2 }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {p.naslov}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {p.opis}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}