import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Button, Container, Tab, Tabs, Table, TableBody, TableCell, TableHead, TableRow, Typography,} from "@mui/material";
import { vrniVse, izbrisi } from "../../services/strosekService";

export default function StroskiList() {
    const [stroski, setStroski] = useState([]);
    const [izbrana, setIzbrana] = useState("Vsi");

    const nalozi = () => {
        vrniVse()
            .then((res) => setStroski(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        nalozi();
    }, []);

    const onIzbrisi = (id) => {
        izbrisi(id).then(nalozi).catch((err) => console.error(err));
    };

    // seznam kategorij iz podatkov (brez ponavljanja)
    const kategorije = [...new Set(stroski.map((s) => s.kategorija || "Brez kategorije"))];

    // če je izbrana kategorija izginila (npr. po brisanju), se vrni na "Vsi"
    const aktivna = izbrana === "Vsi" || kategorije.includes(izbrana) ? izbrana : "Vsi";

    const prikazani =
        aktivna === "Vsi"
            ? stroski
            : stroski.filter((s) => (s.kategorija || "Brez kategorije") === aktivna);

    const vsota = prikazani.reduce((vsota, s) => vsota + s.znesek, 0);

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Seznam stroškov</Typography>
            <Button variant="contained" component={Link} to="/dodaj" sx={{ mb: 2 }}>
                Dodaj strošek
            </Button>

            <Tabs
                value={aktivna}
                onChange={(e, nova) => setIzbrana(nova)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
                <Tab label={`Vsi (${stroski.length})`} value="Vsi" />
                {kategorije.map((k) => (
                    <Tab
                        key={k}
                        label={`${k} (${stroski.filter((s) => (s.kategorija || "Brez kategorije") === k).length})`}
                        value={k}
                    />
                ))}
            </Tabs>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Naziv</TableCell>
                        <TableCell>Znesek (€)</TableCell>
                        <TableCell>Kategorija</TableCell>
                        <TableCell>Datum</TableCell>
                        <TableCell>Akcije</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {prikazani.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>{s.naziv}</TableCell>
                            <TableCell>{s.znesek}</TableCell>
                            <TableCell>{s.kategorija}</TableCell>
                            <TableCell>{s.datum}</TableCell>
                            <TableCell>
                                <Button component={Link} to={`/uredi/${s.id}`}>Uredi</Button>
                                <Button color="error" onClick={() => onIzbrisi(s.id)}>Izbriši</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Typography sx={{ mt: 2 }} variant="subtitle1">
                Skupaj: {vsota.toFixed(2)} €
            </Typography>
        </Container>
    );
}