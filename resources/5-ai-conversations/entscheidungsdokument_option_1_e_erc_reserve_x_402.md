# Entscheidungsdokument – Wahl von Option 1 (x402 + eERC‑Reserve)

## 1) Executive Summary
Wir entscheiden uns für **Option 1: „x402 + eERC‑Reserve“**. Nutzer zahlen per **EIP‑3009/USDC** (Wallet‑nativ, Standard), während die **Verrechnung/Nutzung** privat im **eERC‑20‑System** gespiegelt wird. **Nur der Server** interagiert mit den eERC‑Contracts (Converter‑Deposits, private Batch‑Transfers). Das verbindet **On‑chain‑Zahlung** mit **On‑chain‑Privatsphäre**, ohne den Nutzer mit ZK‑Proving zu belasten. Der **Auditor‑Pfad** ermöglicht selektive Beleg‑Einsicht (Compliance, Dispute‑Fähigkeit, Partner‑Clearing) – ohne Nutzerdaten öffentlich zu machen.

**Kurzvorteile**
- **User**: Blockchain‑Zahlung ohne ZK‑Compute, kein On‑chain‑Leak der Nutzung (nur Top‑Up sichtbar), niedrige Latenz.
- **Server**: Minimal-invasive Integration in x402, private On‑chain‑Belege (eERC‑Reserve), Auditor‑Nachweise, Option für private Revenue‑Splits im MCP‑Netz.

---

## 2) Problemstellung & Ziele
- *Problem*: „Pay per Request“ über reine Public‑Token ist transparent; private ZK‑Payments sind rechenintensiv für Clients.
- *Ziel‑Trio*: **(a)** Blockchain‑Zahlung anbieten, **(b)** Nutzungs‑Privatsphäre wahren (so gut es geht), **(c)** rechenarm für User.
- *Neben‑Ziele*: Compliance‑Fähigkeit (Auditor), Partner‑Clearing (MCP), geringe Änderungen an sicherheitsgeprüften Bausteinen.

---

## 3) Betrachtete Optionen & Bewertung (Kurz)
- **x402‑only (Off‑chain‑Ledger)**: Einfachste Implementierung, aber **keine** on‑chain Privatsphäre und schwächere Nachweisbarkeit.
- **Option 1 – x402 + eERC‑Reserve (gewählt)**: USDC‑Top‑Up bleibt öffentlich, **Nutzung/Verrechnung privat** in eERC; Auditor ermöglicht selektive Verifizierung; **User braucht keine ZK‑Proofs**.
- **User‑owned eERC** (später): Maximale Privatsphäre, aber **Client‑Compute** (ZK‑Proving) und höhere UX‑Komplexität.

**Warum Option 1?** Bestes Verhältnis aus **Zahlweg**, **Privatsphäre in der Nutzung**, **Client‑Leichtgewicht**, **Auditierbarkeit** und **geringem Integrationsaufwand**.

---

## 4) Entscheidungsgrundlagen
### 4.1 Nutzerperspektive (Wertbeitrag)
- **Wallet‑nativer Zahlweg**: EIP‑3009/USDC ist verbreitet; keine exotische Wallet‑Experience.
- **Privatsphäre dort, wo es zählt**: Nur das **Top‑Up** ist öffentlich. **Verbrauchsmuster, Einzelpreise und Empfänger** bleiben **shielded** (eERC‑Batches).
- **Geringer Rechenaufwand**: Keine ZK‑Proofs am Client; schnelle Freischaltung der Credits.
- **Vorhersehbare Kosten/Latenz**: Tägliches Batch‑Settlement statt teurer Per‑Request‑TXs.

### 4.2 Serverperspektive (Wertbeitrag)
- **Geringe Invasivität**: x402‑Kern (402‑Challenge, Header, EIP‑712‑Verify) wird **wiederverwendet**; nur der **Settlement‑Pfad** wird erweitert.
- **On‑chain‑Belege ohne Doxxing**: eERC‑Reserve + private Transfers erzeugen prüfbare, aber nicht personenbezogene On‑chain‑Spuren.
- **Auditor‑Nachweise**: Selektive Betrags‑Einsicht für Compliance/Dispute – ohne Publikwerden der Nutzungsdaten.
- **MCP‑Mehrwert**: Private **Revenue‑Splits** an nachgelagerte Tools/Provider, ohne die Endnutzer‑Beziehung offenzulegen.
- **Roadmap‑Sicherheit**: Optional umschaltbar auf „User‑owned eERC‑Balance“ später – ohne Architekturrewrite.

---

## 5) Ablauf (vereinfacht nach Parteien)
1) **User → Server (Top‑Up)**: Server sendet 402 (x402‑Payment‑Requirements). User antwortet mit signierter **EIP‑3009‑Autorisierung**.
2) **Server (Gutschrift)**: Validiert Header, schreibt **Credits** im Off‑chain‑Ledger gut; liefert Ressource/JWT.
3) **Server ↔ Blockchain (täglich)**:
   - **USDC‑Claim** via `transferWithAuthorization` am USDC‑Contract (öffentlich),
   - **Converter‑Deposit** (USDC → eUSDC) auf Server‑Receiver,
   - **private eERC‑Transfers** (Batch) für Belege/Revenue‑Splits (privat; Auditor‑lesbar).

**Resultat:** Nur Top‑Ups sind öffentlich; **Nutzung & Verrechnung** bleiben **on‑chain privat**.

---

## 6) Warum nicht „alles off‑chain“?
Ein reines Off‑chain‑IOU‑Ledger hat Nachteile:
- **Geringere Glaubwürdigkeit**: Keine kryptografischen On‑chain‑Belege der Reserve/Nutzung.
- **Schwache Dispute‑Lage**: Wenig prüfbare Fakten für Dritte.
- **Kein Partner‑Clearing**: Inter‑Provider‑Abrechnung bleibt „vertrauensbasiert“.

Mit eERC erhalten wir:
- **Proof‑of‑Reserve/-Consumption** (privat, aber auditor‑prüfbar),
- **Partner‑Clearing** über private Transfers,
- **Upgrade‑Pfad** zu User‑owned Balances.

---

## 7) Risiken & Gegenmaßnahmen
- **Öffentliche Sichtbarkeit der Top‑Ups**: akzeptiert; Nutzung bleibt shielded.
- **Server‑Treasury‑Risiko** (Pre‑Funding, Claims): Caps, Monitoring, tägliches Settlement.
- **Auditor‑Key‑Risiko**: HSM/KMS, Rotation, Key‑IDs in Belegen.
- **Batch‑Fehlschläge**: Idempotente Runs, Retries, Partial‑Commit‑Strategie.

---

## 8) Auswirkungen auf Implementierung
- **x402‑Middleware**: Schema‑Whitelist erweitern (`eerc20_usdc_credit`); Payment‑Requirements (USDC‑Domain) beibehalten.
- **Settler**: Neuer Pfad USDC‑Claim → Converter‑Deposit → eERC‑Transfer‑Batch.
- **APIs**: `/topup`, `/credits`, `/auditor/summary`, `/settlement/status`; optional `/partners/split`.
- **Ops/Keys**: Auditor‑Key in KMS/HSM; Contract‑Setup einmalig.

---

## 9) KPIs & Erfolgskriterien
- **T+1 Settlement‑Quote** ≥ 99% (ohne manuelle Eingriffe)
- **Durchschnittliche Nutzer‑Latenz** beim Top‑Up ≤ 2 Sek. (ohne On‑chain‑Warten)
- **Batch‑Gas‑Kosten/1000 Requests**: stabil und prognostizierbar
- **Zero‑Leakage**: Keine Linkability von Nutzer‑Verbrauch aus On‑chain‑Daten
- **Audit‑Pass**: Externe Prüfstelle kann Summen verifizieren (Auditor‑Endpoint)

---

## 10) Roadmap
- **MVP (Hackathon)**: Option 1 live (USDC‑Top‑Up, eERC‑Reserve, Auditor‑Summary, optional Revenue‑Split).
- **vNext**: Konfig‑Flag „User‑owned Balance“ (Client kann Proofs vorbereiten; Server batcht Einreichung), Export der Beleg‑Merkle‑Wurzeln, weitergehende MCP‑Automationen.

---

## 11) Takeaways
- Option 1 erfüllt unser Ziel‑Trio: **Blockchain‑Zahlung + Privatsphäre in der Nutzung + rechenarme UX**.
- eERC bringt **verifizierbare, private On‑chain‑Belege** ins Spiel – ein klarer Mehrwert gegenüber reinem Off‑chain‑Ledger.
- Die Lösung passt nativ in **x402/MCP** und bleibt **zukunftsfähig** für stärkere Privacy‑Profile.

