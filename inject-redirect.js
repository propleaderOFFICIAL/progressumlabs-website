#!/usr/bin/env node
/**
 * Build step per Render: legge la variabile d'ambiente REDIRECT_ENABLED
 * e la inietta in tutte le pagine HTML.
 *
 * Su Render: Environment → REDIRECT_ENABLED = true oppure false
 * true  = redirect attivo (tutti vanno su Avantir)
 * false = redirect spento (si vede il sito Progressum Labs)
 *
 * Se la variabile non è impostata, default = true (redirect attivo). Se il build non viene eseguito, resta il valore nel repo (false = sito visibile).
 *
 * Con più pagine: ogni .html deve contenere lo stesso script di redirect
 * (vedi RENDER.md). Questo script aggiorna REDIRECT_ENABLED in tutti i file .html.
 */

const fs = require('fs');
const path = require('path');

const env = process.env.REDIRECT_ENABLED;
const value = (env && String(env).toLowerCase() === 'false') ? 'false' : 'true';

const dir = __dirname;
const files = fs.readdirSync(dir).filter(function (f) { return f.endsWith('.html'); });

files.forEach(function (name) {
  const file = path.join(dir, name);
  let html = fs.readFileSync(file, 'utf8');
  if (!/REDIRECT_ENABLED=(true|false)/.test(html)) return;
  html = html.replace(/REDIRECT_ENABLED=(true|false)/g, 'REDIRECT_ENABLED=' + value);
  fs.writeFileSync(file, html);
  console.log('Redirect iniettato in ' + name + ': REDIRECT_ENABLED=' + value);
});

if (files.length === 0) console.log('Nessun file .html con REDIRECT_ENABLED trovato.');
