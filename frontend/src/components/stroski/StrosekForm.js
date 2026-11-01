import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import { dodaj, posodobi, vrniEnega } from "../../services/strosekService";

const KATEGORIJE = ["Hrana", "Prevoz", "Stanovanje", "Zabava", "Zdravje", "Drugo"];

export default function StrosekForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [naziv, setNaziv] = useState("");
    const [znesek, setZnesek] = useState("");
    const [datum, setDatum] = useState("");
    const [kategorija, setKategorija] = useState("");

    useEffect(() => {
        if (id) {
            vrniEnega(id).then((res) => {
                const s = res.data;
                setNaziv(s.naziv);
                setZnesek(s.znesek);
                setDatum(s.datum);
                setKategorija(s.kategorija || "");
            });
        }
    }, [id]);

    const onShrani = () => {
        const strosek = {
            naziv,
            znesek: parseFloat(znesek),
            datum,
            kategorija,
        };
        const zahteva = id ? posodobi(id, strosek) : dodaj(strosek);
        zahteva
            .then(() => navigate("/stroski"))
            .catch((err) => {
                console.error(err);
                alert("Napaka pri shranjevanju: " + (err.response?.status || err.message));
            });
    };

    return (
        <Container sx={{ mt: 3, maxWidth: "sm" }}>
            <Typography variant="h5" gutterBottom>
                {id ? "Uredi strošek" : "Dodaj strošek"}
            </Typography>
            <TextField fullWidth margin="normal" label="Naziv"
                       value={naziv} onChange={(e) => setNaziv(e.target.value)} />
            <TextField fullWidth margin="normal" label="Znesek" type="number"
                       value={znesek} onChange={(e) => setZnesek(e.target.value)} />
            <TextField fullWidth margin="normal" label="" type="date"
                       InputLabelProps={{ shrink: true }}
                       value={datum} onChange={(e) => setDatum(e.target.value)} />
            <TextField select fullWidth margin="normal" label="Kategorija"
                       value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
                {KATEGORIJE.map((k) => (
                    <MenuItem key={k} value={k}>{k}</MenuItem>
                ))}
            </TextField>
            <Button variant="contained" onClick={onShrani} sx={{ mr: 1 }}>Shrani</Button>
            <Button onClick={() => navigate("/stroski")}>Prekliči</Button>
        </Container>
    );
}