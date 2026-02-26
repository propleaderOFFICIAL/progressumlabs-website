#!/usr/bin/env node
/**
 * Build step per Render: legge la variabile d'ambiente REDIRECT_ENABLED
 * e la inietta in index.html al posto di __REDIRECT_ENABLED__.
 *
 * Su Render: Environment → REDIRECT_ENABLED = true oppure false
 * true  = redirect attivo (tutti vanno su Avantir)
 * false = redirect spento (si vede il sito Progressum Labs)
 *
 * Se la variabile non è impostata, default = true (redirect attivo).
 */

const fs = require('fs');
const path = require('path');

const env = process.env.REDIRECT_ENABLED;
const value = (env && String(env).toLowerCase() === 'false') ? 'false' : 'true';

const file = path.join(__dirname, 'index.html');
let html = fs.readFileSync(file, 'utf8');

html = html.replace(/REDIRECT_ENABLED=(true|false)/, 'REDIRECT_ENABLED=' + value);
fs.writeFileSync(file, html);

console.log('Redirect iniettato: REDIRECT_ENABLED=' + value);
