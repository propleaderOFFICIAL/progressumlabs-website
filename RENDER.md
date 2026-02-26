# Impostazioni Render

## Variabile per il redirect (senza toccare il codice)

Tu o i tuoi colleghi potete attivare/disattivare il redirect verso Avantir **dal dashboard di Render**, senza aprire il codice.

1. Vai su **Render** → il tuo Static Site **progressumlabs-website** → **Environment**.
2. Aggiungi una variabile:
   - **Key:** `REDIRECT_ENABLED`
   - **Value:** `true` oppure `false`
     - **`true`** = redirect attivo → i visitatori vanno su https://avantirconsulting.com/landing-page-ea
     - **`false`** = redirect spento → si vede il sito Progressum Labs
3. Salva e fai **Manual Deploy** (o aspetta il prossimo deploy da GitHub).

Dopo ogni modifica alla variabile serve un **nuovo deploy** perché il valore viene scritto nell’HTML in fase di build.

## Build Command su Render

Nel **Build Command** del sito deve esserci:

```bash
node inject-redirect.js
```

Così a ogni deploy lo script legge `REDIRECT_ENABLED` e la inserisce in `index.html`.

- **Publish Directory:** `.` (invariato)
