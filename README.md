# Spremljanje stroškov

Spletna aplikacija za beleženje stroškov 

## Kazalo
- [O projektu](#o-projektu)
- [Uporabljene tehnologije](#uporabljene-tehnologije)
- [Struktura projekta](#struktura-projekta)
- [Navodila za nameščanje in zagon](#navodila-za-nameščanje-in-zagon)
- [REST API in Swagger](#rest-api-in-swagger)
- [Navodila za razvijalce](#navodila-za-razvijalce)
- [Standardi kodiranja](#standardi-kodiranja)

## O projektu
Aplikacija uporabniku omogoča beleženje in spremljanje osebnih stroškov. Stroške lahko dodaja,
pregleduje po kategorijah, ureja in briše. Namen projekta je pregled nad denarjem na enem mestu:
poleg stroškov bo uporabnik spremljal tudi varčevanje in investicije.

**Trenutne funkcionalnosti:**
- CRUD operacije nad stroški (naziv, znesek, kategorija, datum), shranjeni v bazi PostgreSQL.
- Seznam stroškov z zavihki po kategorijah in seštevkom.
- Domača stran z navigacijo po aplikaciji.
- Denarnica: interaktiven tortni graf (stroški, varčevalni račun, investicije); klik na del grafa odpre ustrezno stran.
- Strani Varčevalni račun in Investicijski račun (vnos zneska in datuma, razvrščanje po datumu).

**Omejitve:** varčevalni in investicijski račun za zdaj podatke hranita v brskalniku (`localStorage`),
ne v bazi. Prenos v zaledje je predviden kot nadgradnja.

## Uporabljene tehnologije
aplikacijo pišem v InteliJ, za jezik uporabljam React, Javo

## Struktura projekta

```
Stroski/
├── backend/                         Spring Boot zaledje
│   ├── src/main/java/com/example/backend/
│   │   ├── BackendApplication.java  Zagonska točka
│   │   ├── Strosek.java             Entiteta (tabela strosek)
│   │   ├── StrosekRepository.java   Dostop do baze (JPA)
│   │   └── StrosekController.java   REST API (/api/stroski)
│   ├── src/main/resources/
│   │   └── application.properties   Nastavitve (baza, JPA)
│   └── pom.xml                      Odvisnosti (Maven)
├── frontend/                        React uporabniški vmesnik
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── domacastran/home.js  Začetna stran
│   │   │   ├── routing/Routing.js   Poti (URL → stran)
│   │   │   └── stroski/             Seznam, obrazec, Denarnica, Varcevalni, Investicijski
│   │   ├── services/
│   │   │   ├── api.js               Nastavitev axios (osnovni URL iz .env)
│   │   │   └── strosekService.js    Klici REST API-ja
│   │   ├── assets/                  Slike in dodatne datoteke
│   │   ├── App.js                   Tema in glavna postavitev
│   │   └── index.js                 Zagonska točka
│   ├── .env                         REACT_APP_BASE_URL
│   └── package.json                 Odvisnosti (npm)
├── docker-compose.yml               PostgreSQL v Dockerju
└── README.md
```

Frontend in backend sta ločena projekta v ločenih mapah. Komunicirata prek REST API-ja (JSON).

## Navodila za nameščanje in zagon

### Predpogoji
- **Java JDK 25** (preveri: `java -version`)
- **Node.js** (LTS) in npm (preveri: `node -v`, `npm -v`)
- **Docker Desktop** (preveri: `docker --version`)
- **Git**
- Zaželeno: IntelliJ IDEA(to uporabljam jaz)

### 2. Zagon baze (PostgreSQL v Dockerju)
V korenu projekta (kjer je `docker-compose.yml`):
```bash
docker compose up -d
docker ps
```
Kontejner `stroski-db` mora biti zagnan, v stolpcu PORTS pa `0.0.0.0:5432->5432/tcp`.
Nastavitve baze:

| Spremenljivka | Vrednost |
|---|---|
| Baza | `stroski` |
| Uporabnik | `postgres` |
| Geslo | `postgres` |
| Port | `5432` |

### 3. Zagon backenda
Nastavitve so v `backend/src/main/resources/application.properties`
 v IntelliJ-u: odpri `BackendApplication.java` in klikni zeleni gumb Run.
Backend teče na `http://localhost:8080`.

### 4. Zagon frontenda
v terminalu v projektu frontend, odpreš terminal in notri napišeš npm start. ukaz avtomatsko odpre stran v spletnem brskalniku.
Aplikacija se odpre na `http://localhost:3000`. Po vsaki spremembi `.env` je treba strežnik ponovno zagnati.

### Vrstni red zagona (vsakič)
1. Docker Desktop in `docker compose up -d`
2. Backend (port 8080)
3. Frontend (port 3000)

### Pogoste težave
| Težava | Rešitev |
|---|---|
| `Port 8080 was already in use` | Ustavi star backend: `kill -9 $(lsof -t -i :8080)` |
| Backend se ne poveže z bazo | Preveri `docker ps` in port 5432 |
| `Network Error` / CORS v brskalniku | Backend ne teče ali ga je treba znova zagnati |
| `.env` se ne prebere | Ponovno zaženi `npm start`; ime se mora začeti z `REACT_APP_` |

## Navodila za razvijalce
1. Klonirajte repozitorij in sledite navodilom za zagon.
2. Za vsako novo funkcionalnost ustvarite svojo vejo:
   ```bash
   git checkout -b feature/ime-funkcionalnosti
   ```
3. Spremembe shranjujte v manjših commitih z jasnim opisom:
   ```bash
   git add .
   git commit -m "Dodana stran za varčevalni račun"
   ```
4. Vejo potisnite na GitHub in odprite Pull Request v vejo `main`:
   ```bash
   git push -u origin feature/ime-funkcionalnosti
   ```
5. Pred združitvijo preverite, da backend in frontend delujeta.
6. V repozitorij ne dodajajte map `node_modules/`, `target/` in `.idea/`; so v `.gitignore`.

## Standardi kodiranja

**Splošno**
- Imena spremenljivk, funkcij in komentarji so v slovenščini (kot v obstoječi kodi); datoteke in razredi imajo jasna imena.
- Zamik: 4 presledki. Ena komponenta ali razred na datoteko.

**Backend (Java)**
- Razredi: `PascalCase` (`StrosekController`); metode in spremenljivke: `camelCase`.
- REST poti z množino in malimi črkami: `/api/stroski`.
- Vhodne podatke preverjamo z `@Valid` in anotacijami (`@NotBlank`, `@Positive`).
- Operacije so dokumentirane v Swaggerju (`@Tag`, `@Operation`).

**Frontend (React)**
- Komponente: funkcije, ime datoteke in komponente v `PascalCase` (`StroskiList.js`).
- Klici na zaledje so ločeni v `services/`, komponente ne kličejo axios neposredno.
- Osnovni URL zaledja je v `.env` (`REACT_APP_BASE_URL`), ne v kodi.
- Za vmesnik uporabljamo MUI komponente in skupno temno temo v `App.js`.

**Git**
- Veje: `feature/...`, `fix/...`. Commit sporočila so kratka in opisna.