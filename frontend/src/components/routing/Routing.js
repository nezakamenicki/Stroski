import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../domacaStran/Home";
import StroskiList from "../stroski/StroskiList";
import StrosekForm from "../stroski/StrosekForm";
import Denarnica from "../stroski/Denarnica";
import Varcevalni from "../stroski/Varcevalni";
import Investicijski from "../stroski/Investicijski";

export default function Routing() {
    return (
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path="/stroski" element={<StroskiList />} />
            <Route path="/dodaj" element={<StrosekForm />} />
            <Route path="/uredi/:id" element={<StrosekForm />} />
            <Route path="/denarnica" element={<Denarnica />} />
            <Route path="/varcevanje" element={<Varcevalni />} />
            <Route path="/investicije" element={<Investicijski />} />
        </Routes>
    );
}