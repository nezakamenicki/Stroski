import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Container, TextField, Typography } from "@mui/material";
import { vrniVse } from "../../services/strosekService";

const preberi = (kljuc) => {
    try {
        const v = parseFloat(localStorage.getItem(kljuc));
        return isNaN(v) ? 0 : v;
    } catch (e) {
        return 0;
    }
};

const shrani = (kljuc, vrednost) => {
    try {
        localStorage.setItem(kljuc, String(vrednost));
    } catch (e) {
        // brez shranjevanja se stran še vedno prikaže
    }
};

const evro = (x) => x.toFixed(2) + " €";

function Torta({ deli, aktivni, setAktivni, onKlik }) {
    const velikost = 300;
    const polmer = 105;
    const debelina = 44;
    const obseg = 2 * Math.PI * polmer;
    const skupaj = deli.reduce((vsota, d) => vsota + d.vrednost, 0);

    let odmik = 0;
    const odseki = deli
        .filter((d) => d.vrednost > 0)
        .map((d) => {
            const dolzina = (d.vrednost / skupaj) * obseg;
            const odsek = { ...d, dolzina, odmik };
            odmik += dolzina;
            return odsek;
        });

    return (
        <svg width={velikost} height={velikost} viewBox={`0 0 ${velikost} ${velikost}`}>
            <g transform={`rotate(-90 ${velikost / 2} ${velikost / 2})`}>
                {skupaj === 0 && (
                    <circle cx={velikost / 2} cy={velikost / 2} r={polmer} fill="none"
                            stroke="rgba(255,255,255,0.1)" strokeWidth={debelina} />
                )}
                {odseki.map((o) => (
                    <circle
                        key={o.naziv}
                        cx={velikost / 2}
                        cy={velikost / 2}
                        r={polmer}
                        fill="none"
                        stroke={o.barva}
                        strokeWidth={aktivni === o.naziv ? debelina + 10 : debelina}
                        strokeDasharray={`${o.dolzina} ${obseg - o.dolzina}`}
                        strokeDashoffset={-o.odmik}
                        style={{ cursor: "pointer", transition: "stroke-width .2s" }}
                        onMouseEnter={() => setAktivni(o.naziv)}
                        onMouseLeave={() => setAktivni(null)}
                        onClick={() => onKlik(o.pot)}
                    />
                ))}
            </g>
            <text x="50%" y="46%" textAnchor="middle" fill="#9aa3c7" fontSize="14">
                {aktivni || "Skupaj"}
            </text>
            <text x="50%" y="56%" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700">
                {evro(aktivni ? deli.find((d) => d.naziv === aktivni).vrednost : skupaj)}
            </text>
        </svg>
    );
}

export default function Denarnica() {
    const navigate = useNavigate();
    const [stroski, setStroski] = useState([]);
    const [varcevanje, setVarcevanje] = useState(preberi("varcevanje"));
    const [investicije, setInvesticije] = useState(preberi("investicije"));
    const [aktivni, setAktivni] = useState(null);

    useEffect(() => {
        vrniVse()
            .then((res) => setStroski(res.data))
            .catch((err) => console.error(err));
    }, []);

    const skupajStroski = stroski.reduce((vsota, s) => vsota + s.znesek, 0);

    const deli = [
        { naziv: "Stroški", vrednost: skupajStroski, barva: "#7c9cff", pot: "/stroski" },
        { naziv: "Varčevalni račun", vrednost: varcevanje, barva: "#4fd1c5", pot: "/varcevanje" },
        { naziv: "Investicije", vrednost: investicije, barva: "#f6ad55", pot: "/investicije" },
    ];
    const skupaj = deli.reduce((vsota, d) => vsota + d.vrednost, 0);

    const spremeni = (setter, kljuc) => (e) => {
        const v = Math.max(0, parseFloat(e.target.value) || 0);
        setter(v);
        shrani(kljuc, v);
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Moja denarnica</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Klikni na del grafa ali na vrstico, da odpreš podrobnosti.
            </Typography>

            <Box sx={{
                display: "grid",
                gap: 4,
                gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
                alignItems: "center",
            }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Torta deli={deli} aktivni={aktivni} setAktivni={setAktivni} onKlik={navigate} />
                </Box>

                <Box sx={{ display: "grid", gap: 2 }}>
                    {deli.map((d) => (
                        <Card
                            key={d.naziv}
                            onClick={() => navigate(d.pot)}
                            onMouseEnter={() => setAktivni(d.naziv)}
                            onMouseLeave={() => setAktivni(null)}
                            sx={{
                                p: 2,
                                cursor: "pointer",
                                borderLeft: `6px solid ${d.barva}`,
                                transition: "transform .2s",
                                "&:hover": { transform: "translateX(6px)" },
                            }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">{d.naziv}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {evro(d.vrednost)}
                                {skupaj > 0 && (
                                    <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                                        ({((d.vrednost / skupaj) * 100).toFixed(0)} %)
                                    </Typography>
                                )}
                            </Typography>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}