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

## Build Command su Render (obbligatorio per la variabile)

**Se il redirect resta attivo anche con REDIRECT_ENABLED=false, di solito il Build Command non è impostato o non viene eseguito.**

Nel **Build Command** del sito **deve** esserci (campo non vuoto):

```bash
node inject-redirect.js
```

Solo così a ogni deploy lo script legge `REDIRECT_ENABLED` dall’Environment e la scrive in tutte le pagine HTML. Senza questo comando, viene servito l’HTML del repo (redirect = false di default).

Dopo aver cambiato la variabile in Environment, fai **Manual Deploy** (o “Clear build cache & deploy”) perché il valore viene applicato in fase di build.

- **Publish Directory:** `.` (invariato)

---

## Se hai più di una pagina

Lo script di build aggiorna **ogni file `.html`** nella root che contiene `REDIRECT_ENABLED`. Quindi:

- **index.html** ce l’ha già.
- **Ogni nuova pagina** (es. `contatti.html`, `servizi.html`) deve avere **lo stesso blocco script** subito dopo `<meta name="viewport">`, così anche quella pagina rispetta il redirect quando è attivo.

Copia questo blocco in ogni nuova pagina, dentro `<head>` (subito dopo il viewport):

```html
  <!-- Redirect a Avantir: su Render imposta REDIRECT_ENABLED (true/false). Home → landing-page-ea, altre pagine → stesso path su avantirconsulting.com -->
  <script>
    (function(){var REDIRECT_ENABLED=true;if(!REDIRECT_ENABLED)return;var p=location.pathname,h='https://avantirconsulting.com';var u=(p==='/'||p==='/index.html'||p==='/index')?h+'/landing-page-ea':h+p.replace(/\.html?$/i,'');location.replace(u+location.search+location.hash);})();
  </script>
```

**Logica del redirect:**
- **Home** (`/` o `/index.html`) → `https://avantirconsulting.com/landing-page-ea`
- **Altre pagine** (es. `/formazione-vsl` o `/formazione-vsl.html`) → `https://avantirconsulting.com/formazione-vsl` (stesso path, senza `.html`)

Parametri e hash in URL vengono sempre mantenuti. A ogni deploy, `inject-redirect.js` aggiorna `REDIRECT_ENABLED` in tutti i file `.html`.
