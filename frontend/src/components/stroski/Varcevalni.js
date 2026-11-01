import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Box, Button, Card, Container, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography,
} from "@mui/material";

const KLJUC = "varcevanje_zneski";
const KLJUC_SKUPAJ = "varcevanje"; // to prebere Denarnica

const preberiSeznam = () => {
    try {
        return JSON.parse(localStorage.getItem(KLJUC)) || [];
    } catch (e) {
        return [];
    }
};

const zapisi = (kljuc, vrednost) => {
    try {
        localStorage.setItem(kljuc, JSON.stringify(vrednost));
    } catch (e) {
        // brez shranjevanja se stran še vedno prikaže
    }
};

const danes = () => new Date().toISOString().slice(0, 10);
const evro = (x) => x.toFixed(2) + " €";

export default function Varcevalni() {
    const [vnosi, setVnosi] = useState(preberiSeznam());
    const [znesek, setZnesek] = useState("");
    const [datum, setDatum] = useState(danes());

    const skupaj = vnosi.reduce((vsota, v) => vsota + v.znesek, 0);

    useEffect(() => {
        zapisi(KLJUC, vnosi);
        zapisi(KLJUC_SKUPAJ, skupaj);
    }, [vnosi, skupaj]);

    const dodaj = () => {
        const x = parseFloat(znesek);
        if (!x || !datum) return;
        setVnosi([...vnosi, { id: Date.now(), znesek: x, datum }]);
        setZnesek("");
    };

    const izbrisi = (id) => setVnosi(vnosi.filter((v) => v.id !== id));

    // razvrsti po datumu, najnovejši zgoraj
    const razvrsteni = [...vnosi].sort(
        (a, b) => b.datum.localeCompare(a.datum) || b.id - a.id
    );

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Varčevalni račun</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#4fd1c5", mb: 3 }}>
                {evro(skupaj)}
            </Typography>

            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                    <TextField label="Znesek (€)" type="number" value={znesek}
                               onChange={(e) => setZnesek(e.target.value)} />
                    <TextField label="Datum" type="date" value={datum}
                               InputLabelProps={{ shrink: true }}
                               onChange={(e) => setDatum(e.target.value)} />
                </Box>
                <Button variant="contained" onClick={dodaj} sx={{ mt: 2 }}>Dodaj</Button>
            </Card>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Znesek</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {razvrsteni.map((v) => (
                        <TableRow key={v.id}>
                            <TableCell>{v.datum}</TableCell>
                            <TableCell>{evro(v.znesek)}</TableCell>
                            <TableCell>
                                <Button color="error" onClick={() => izbrisi(v.id)}>Izbriši</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button component={Link} to="/denarnica" sx={{ mt: 3 }}>Nazaj na denarnico</Button>
        </Container>
    );
}