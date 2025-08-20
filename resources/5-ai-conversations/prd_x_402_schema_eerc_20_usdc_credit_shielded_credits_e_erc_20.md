# PRD – Neues x402‑Schema „eerc20_usdc_credit“ — **MVP (Option 1: eERC‑Reserve + Auditor)**

> **Ziel**: Prepaid‑Credits für API‑Zugriffe über das x402‑Protokoll abrechnen – Beträge bleiben on‑chain privat (eERC‑20). Nur der Server interagiert mit der Chain. Nutzer zahlen in USDC, der Server liest den bezahlten Betrag über Auditor‑Verschlüsselung aus, schreibt Credits gut und liefert die Ressource. On‑chain werden nur aggregierte, nicht nutzerbezogene Bewegungen sichtbar.


> **MVP-Fokus (Option 1):** Nutzer zahlen via **EIP‑3009/USDC** an den Server (Top‑Up über x402). **Nur der Server** interagiert mit eERC‑Contracts: konvertiert USDC → **eUSDC‑Reserve** (Converter) und führt **private Batch‑Transfers** für Verrechnung/Belege aus. Beträge/Flows bleiben on‑chain **privat**, Auditor ermöglicht **selektive Verifizierbarkeit**.

---

## 1) Hintergrund & Motivation
- Ziel bleibt Prepaid‑Credits für API‑Zugriffe mit **on‑chain Zahlung** und **privater on‑chain Verrechnung**.
- Im MVP bauen **nur Server** ZK‑Proofs (Batching), **Clients** signieren lediglich (EIP‑712 für 3009 + API‑Signaturen).
- eERC‑20 dient als **privates Backing/Belegsystem** (Auditor‑Decrypt für Summen/Abgleich), nicht als User‑seitiges Live‑Wallet.

---

## 2) Ziele / Nicht‑Ziele
**Ziele (MVP Option 1)**
- Neues x402‑Schema **`eerc20_usdc_credit`** (USDC‑only), Top‑Up via **EIP‑3009**.
- **Nur Server** spricht mit eERC (Converter‑Deposit, private Batch‑Transfers, tägliches Settlement).
- **Off‑chain Credit‑Ledger** pro User; **Auditor‑Nachweise** on‑chain.
- **Endpoints** für Auditor‑Verifizierbarkeit & Settlement‑Transparenz.
- **Optional**: Revenue‑Split an Partner (MCP) als private eERC‑Transfers.

**Nicht‑Ziele (MVP)**
- Kein User‑seitiges ZK‑Proving im Standardfluss.
- Kein Multi‑Asset; keine Direct‑Mint‑Änderungen am Converter.

---

## 3) Annahmen
- eERC‑20 „Converter Mode“ ist verfügbar (USDC → eERC‑USDC, privat).
- Contract‑Seite unterstützt **Auditor‑Public‑Key** (Server) und erzeugt Auditor‑Ciphertexts.
- Off‑chain haben wir Zugang zu Verifier‑Artefakten (WASM/zkey) für lokale Vorvalidierung.
- EIP‑3009 ist für „USDC‑Pull in Server‑Wallet“ nutzbar (User → Server, Off‑Chain‑Autorisierung).

---

## 4) High‑Level Architektur
**Akteure**
- **User (Client)**: signiert EIP‑3009‑Autorisierung (Top‑Up) & API‑Requests.
- **Server (Gateway/Settler/Ledger)**: prüft, bucht Credits, führt USDC‑Claims, Converter‑Deposits und eERC‑Private‑Transfers (Batch) aus; hält Auditor‑Key in KMS.
- **Blockchain**: USDC‑Contract (3009), eERC‑Converter & EncryptedERC (Auditor gesetzt).

**Kernprinzip (MVP)**
- **Pre‑Top‑Up oder JIT‑Top‑Up** via x402/EIP‑3009.
- **Verbrauch** gegen Off‑chain‑Ledger (keine Client‑Proofs).
- **Tägliche on‑chain Belege**: USDC‑Claim → eERC‑Deposit → private Transfers.

---

## 5) User Journeys
### A) Pre‑Top‑Up (empfohlen)
1. User öffnet Top‑Up → Server sendet 402 (x402 Requirements, USDC‑Domain, `payTo`).
2. Client sendet `X‑PAYMENT` mit **EIP‑3009**‑Autorisierung.
3. Server validiert & **gutschreibt Credits** (Off‑chain); liefert Bestätigung (keine on‑chain Latenz).

### B) JIT‑Top‑Up bei erster 402
1. Erster API‑Call ohne Credits → 402 mit Payment‑Requirements.
2. Client antwortet mit `X‑PAYMENT` (EIP‑3009); Server bucht Credits und liefert Ressource.

### C) Settlement (täglich)
1. **USDC‑Claim**: Server broadcastet `transferWithAuthorization` am **USDC‑Contract** (öffentlich). 
2. **eERC‑Reserve**: Server **deposit**(USDC→eUSDC) im **Converter** auf Server‑Receiver.
3. **Private Transfers**: Server batcht **private eERC‑Transfers** (Server→intern/Partner/User) als **Belege**.
4. Ledger‑Events werden als `settled` markiert.

---

## 6) Neues x402‑Schema: „eerc20_usdc_credit“
**Header‑Name**: `X‑PAYMENT`

**Header‑Payload (JSON)**
```json
{
  "x402Version": 1,
  "scheme": "eerc20_usdc_credit",
  "network": "avalanche-c",
  "payload": {
    "authorization": { "from": "0x...", "to": "0x...server", "value": "10000000", "validAfter": "...", "validBefore": "...", "nonce": "0x..." },
    "signature": "0x...eip712",
    "eercProof": {
      "type": "mint-intent|transfer-intent",
      "publicInputs": { "...": "..." },
      "proof": "0x...",
      "ciphertexts": { "receiver": "...", "auditor": "...", "egct": "..." },
      "state": { "egct": "0x...", "nonce": "123", "txIndex": 7 }
    },
    "client": { "address": "0x...user", "receiverPubKey": "{x,y}", "capabilities": ["precompute-next-proof"] }
  }
}
```

**Server‑Antwort bei 402** (Challenge)
```json
{
  "x402Version": 1,
  "scheme": "eerc20_usdc_credit",
  "assetType": "eERC20",
  "assetAddress": "0x...EncryptedERC",
  "converterUSDC": "0x...USDC",
  "payTo": "0x...server",
  "network": "avalanche-c",
  "maxAmountRequired": "10.00",
  "expiresAt":  "2025-08-20T12:00:00Z",
  "paymentId":  "uuid-...",
  "auditorPubKey": "{Ax,Ay}",
  "notes": "Prepaid credits; daily settlement; amounts remain shielded"
}
```

**Validierungsregeln (Server)**
- `scheme === "eerc20_usdc_credit"` & `network` erlaubt.
- EIP‑3009‑Typed‑Data valid, `validBefore` > now+Δ (Batch‑Fenster), `nonce` unbenutzt.
- zk‑Proof lokal geprüft (WASM/zkey) **oder** via `eth_call` gegen Verifier.
- **Auditor‑Decrypt** des Ciphertexts → Betrag = `amount` (USDC‑6).
- **Idempotenz**: `(paymentId, auth.nonce)` ist eindeutig; doppelte Gutschriften ausgeschlossen.

---

## 7) Komponenten & Schnittstellen
### 7.1 Gateway / Middleware (x402)
- Schema‑Whitelist ergänzen um `eerc20_usdc_credit`.
- Payment‑Requirements rendern (USDC verifyingContract, `payTo`, `network`, `maxAmountRequired`, `paymentId`).

### 7.2 Validator
- EIP‑3009 Verify (EIP‑712 Typed‑Data), Zeitfenster/Nonce, Domain = USDC.
- Business‑Regeln: Mindestbetrag, Caps, Idempotenz `(paymentId, nonce)`.

### 7.3 Settler (Batch)
1) USDC‑`transferWithAuthorization` claims. 
2) Converter‑`deposit` (Server‑Receiver). 
3) eERC‑Private‑Transfers (Batch) für **Belege**/**Revenue‑Split**.

### 7.4 Credit Ledger (DB)
- `users`, `credit_events`, `settlement_runs`, `auditor_keys` (wie zuvor), plus `partner_splits`.

---

## 8) Schlüsselfluss: EGCT & Nonce
- eERC‑Balance führt `EGCT` (ElGamal Ciphertext) + `nonce`.
- Server speichert **aktuelles `(EGCT, nonce)`** je User und gibt sie optional nach Gutschrift an den Client zurück.
- Client kann auf Basis dieses Zustands **den nächsten Proof offline vorbereiten** (z. B. weiteren Kauf oder spätere Withdrawals).

---

## 9) Sicherheit & Datenschutz
- **On‑chain Privacy**: Einzelbeträge pro Nutzer bleiben privat; Server‑Transfers/Deposits sind aggregiert.
- **Auditor‑Key‑Management**:
  - Server hält Auditor‑Privat‑Key in **HSM/KMS**; Rotation via `AuditorManager`.
  - Proofs müssen Auditor‑Ciphertext enthalten.
- **Replay‑Schutz**: `paymentId`, EIP‑3009 `nonce`, eERC‑`nonce`.
- **Timeouts**: EIP‑3009 `validBefore` ≥ (now + batchWindow).
- **API‑Auth**: Jeder API‑Call wird zusätzlich mit **Wallet‑Signature** (EIP‑191/712) signiert; Adresse = User.
- **DoS‑Schutz**: Rate‑Limits auf Proof‑Uploads; Proof‑Precheck bevor teure Verifikation.

---

## 10) Fehlerfälle
- **Authorization expired** → 402 mit neuem `expiresAt`/Hinweis.
- **Proof invalid** → 402 `ERR_INVALID_PROOF` (Details in `error.data`).
- **Auditor decrypt fail** → 402 `ERR_AUDITOR_DECRYPT` (rotierte Keys? → Key‑Version in Header aufnehmen).
- **USDC sweep fail** → Markiere als `credited`, nicht `settled`; Retry im nächsten Batch.
- **Converter deposit fail** → Stoppe Transfers; Partial‑Rollback/Retry.

---

## 11) Konfiguration
- **Chain**: `avalanche-c` (Fuji/Mainnet parameterisiert).
- **Contracts**: `EncryptedERC`, `Registrar`, `AuditorManager`, `TokenTracker`, `USDC`.
- **Batch‑Zeit**: täglich, konfigurierbar (z. B. 02:00 UTC), `maxBatchSize`, `gasCap`.

---

## 12) Implementierungsplan
1) Middleware: Schema‑Whitelist + Payment‑Requirements + USDC‑Domain.
2) Ledger: Tabellen/Idempotenz.
3) Settler: USDC‑Claim → Converter‑Deposit → Private‑Transfer‑Batch (mit Retry/Backoff).
4) Auditor: KMS‑Key, Contract‑Set, Summaries/API.
5) Optional: Partner‑Split.
6) Observability & Alarms.

---

## 13) API‑Beispiele (Server)
**Top‑Up (x402)**
```http
POST /topup
→ 402 Payment Required (scheme: eerc20_usdc_credit, USDC domain)
```

**Retry mit Zahlung**
```http
POST /topup
X-PAYMENT: { authorization + signature + paymentId }
→ { status: "credited", credits: 50.0, balance: { egct: "0x...", nonce: 42 } }
```

**Credits Check**
```http
GET /credits
X-Client-Address: 0x...
X-Client-Signature: 0x...
→ { credits: 123.45 }
```

**Auditor Summary (Proof‑of‑Reserve/Consumption)**
```http
GET /auditor/summary?from=2025-08-01&to=2025-08-31
→ { sold_usdc: "10000.00", converted_to_eusdc: "10000.00", consumed_eusdc: "7423.00", pending_settlement: "2577.00", proofs: [ {batchId, txHash, auditorCipherDigest} ] }
```

**Settlement Status**
```http
GET /settlement/status?runId=...
→ { runId, startedAt, usdcClaims: [...], deposits: [...], privateBatches: [...], state: "success|partial|failed" }
```

**Optional: Revenue‑Split Konfiguration**
```http
POST /partners/split
Body: { partner: "did:tool:rag", shareBps: 2500 }
→ { ok: true }
```

---

## 14) Testplan
- Unit: EIP‑3009 Verify; Ledger‑Idempotenz; Summaries.
- Integration: Top‑Up → Credit → Settlement; Auditor‑Decrypt‑Pfad (Testvektoren).
- Privacy: Sicherstellen, dass eERC‑Batches **keine** User‑Linkability offenbaren.
- Chaos: Expiries, Gas‑Spikes, Wiederholungen.

---

## 15) Risiken & Gegenmaßnahmen
- **Öffentliche USDC‑Top‑Ups**: Akzeptiert; Nutzung/Verrechnung bleibt privat.
- **Treasury‑Risiko Server**: Reserve‑Management, Caps, Echtzeit‑Monitoring.
- **Auditor‑Key Kompromittierung**: Rotation (Key‑ID), Zugriff nur via KMS/HSM.
- **Batch‑Fehler**: Idempotente Runs, Partial‑Commit, Retry mit Backoff.

---

## 16) Offene Punkte (zur Diskussion)
1. **Settlement‑Variante**: Bevorzugen wir *Converter‑Deposit + Server‑Transfer* (Server erzeugt Transfer‑Proofs) – oder erlauben wir *Direct‑Mint* anhand User‑Proofs und sichern Backing anderweitig?
2. **Key‑Versionierung** im Proof/Header, damit Decrypts trotz Rotation deterministisch sind.
3. **Credit‑Preis / FX**: Fester USD‑Preis pro Credit vs. dynamisch.
4. **Rollback‑Strategie**: Wie behandeln wir erfolgreiche Credit‑Gutschrift aber fehlschlagendes on‑chain Settlement? (T‑Zähler, Reservepuffer)

---

## 17) Technische Machbarkeit (Fazit)
- **MVP ist machbar** mit minimalen Änderungen am x402‑Kern (Schema‑Whitelist + Settler‑Pfad). 
- **Mehrwert**: On‑chain Zahlung (USDC) + private on‑chain Belege (eERC) + Auditor‑Verifizierbarkeit, ohne Client‑ZK.
- **Roadmap**: Feature‑Flag `userOwnedPrivateBalance` für spätere Aktivierung (User‑seitige Proofs), MCP‑Revenue‑Split als klarer Showcase.

---

## 18) Settler – Pseudocode (Englisch)
```ts
async function runSettlementBatch(runId) {
  const pending = db.getUnsettledCreditEvents();
  // 1) USDC Claims (EIP-3009)
  for (const ev of pending) {
    await usdc.transferWithAuthorization(ev.auth);
    markClaimed(ev.id);
  }
  // 2) Converter Deposit (aggregate to reduce gas)
  const total = sumClaimed(pending);
  await converter.deposit(total, serverReceiverPubKey);
  // 3) Private eERC Transfers (proofs built server-side)
  const groups = groupByPartnerOrUser(pending);
  for (const g of groups) {
    const proof = buildTransferBatchProof(g);
    await encryptedErc.submitPrivateTransferBatch(proof);
    markTransferred(g.eventIds);
  }
  finalizeRun(runId);
}
```

## 19) Config – Example (Englisch)
```json
{
  "network": "avalanche-c",
  "contracts": {
    "USDC": "0x...",
    "EncryptedERC": "0x...",
    "Converter": "0x..."
  },
  "x402": {
    "scheme": "eerc20_usdc_credit",
    "payTo": "0xServer",
    "maxAmountRequired": "100.00"
  },
  "features": {
    "userOwnedPrivateBalance": false,
    "revenueSplit": true
  }
}
```

