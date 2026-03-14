import { NextResponse, NextRequest } from 'next/server';
import { methodNotAllowed, errorResponse } from '@/lib/api-security';

const SAMPLE_CSV = `url,note_google,nb_avis,classement,taille_equipe,annee_creation,specialite_1,specialite_2,ville
https://cabinet-exemple.fr,4.8,47,Legal 500,12,2005,Droit pénal des affaires,Private Equity,Paris
https://autre-cabinet.fr,4.2,18,,8,2010,M&A / Fusions-acquisitions,,Lyon`;

// [TRUNCATED FOR BREVITY - FULL HTML IN ORIGINAL]
// We keep the original HTML but add a key prompt if not authenticated
const TEST_PAGE_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orsayn — Générateur d'Audit PDF</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; display: flex; justify-content: center; padding: 40px 20px; }
    .container { max-width: 700px; width: 100%; }
    h1 { font-size: 22px; font-weight: 500; color: #fffaf1; margin-bottom: 6px; }
    .subtitle { font-size: 13px; color: #555; margin-bottom: 32px; }
    .tabs { display: flex; gap: 2px; background: #111; border-radius: 10px; padding: 4px; margin-bottom: 28px; }
    .tab { flex: 1; padding: 9px; text-align: center; cursor: pointer; border-radius: 7px; font-size: 13px; font-weight: 500; color: #666; transition: all 0.2s; border: none; background: transparent; }
    .tab.active { background: #1e1e1e; color: #fffaf1; }
    .panel { display: none; }
    .panel.active { display: block; }
    input[type="text"], input[type="number"], input[type="url"], input[type="password"] {
      background: #141414; border: 1px solid #2a2a2a; border-radius: 8px;
      padding: 10px 14px; color: #e5e5e5; font-size: 14px; font-family: 'Inter'; outline: none; width: 100%;
    }
    input:focus { border-color: #444; }
    label { font-size: 12px; font-weight: 500; color: #777; display: block; margin-bottom: 4px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .full { grid-column: 1 / -1; }
    .section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #1a1a1a; }
    .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #555; margin-bottom: 14px; }
    .url-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 10px; }
    .url-card { background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 12px; }
    .url-main { display: flex; gap: 8px; margin-bottom: 8px; }
    .url-main input { flex: 1; }
    .remove-btn { background: #141414; border: 1px solid #2a2a2a; border-radius: 8px; color: #555; cursor: pointer; padding: 0 14px; font-size: 18px; flex-shrink: 0; }
    .url-extras { display: grid; grid-template-columns: 80px 80px 1fr; gap: 8px; }
    .url-extras input { padding: 7px 10px; font-size: 13px; }
    .url-extras label { font-size: 11px; color: #555; }
    .add-btn { background: transparent; border: 1px dashed #2a2a2a; border-radius: 8px; color: #555; cursor: pointer; padding: 9px; font-size: 13px; width: 100%; text-align: center; }
    .add-btn:hover { border-color: #444; color: #999; }
    .drop-zone { background: #111; border: 2px dashed #2a2a2a; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: border-color 0.2s; }
    .drop-zone:hover, .drop-zone.drag { border-color: #444; }
    .drop-zone.has-file { border-color: #4a7; border-style: solid; }
    .drop-zone p { font-size: 13px; color: #666; margin-bottom: 6px; }
    .drop-zone .hint { font-size: 12px; color: #444; }
    .drop-zone.has-file p { color: #4a7; }
    .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .check-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #141414; border: 1px solid #2a2a2a; border-radius: 8px; cursor: pointer; }
    .check-item input { accent-color: #fffaf1; }
    .check-item label { cursor: pointer; font-size: 13px; color: #ccc; margin: 0; font-weight: 400; }
    .submit-btn { width: 100%; margin-top: 24px; padding: 13px; background: rgba(255,250,241,0.95); color: #0a0a0a; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; }
    .submit-btn:hover { opacity: 0.9; }
    .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .lang-btn { padding: 4px 12px; border: 1px solid #ccc; border-radius: 20px; background: #f5f5f5; color: #555; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .lang-btn.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
    .lang-btn:hover:not(.active) { background: #e0e0e0; }
    .status { margin-top: 12px; text-align: center; font-size: 13px; color: #666; min-height: 18px; }
    .status.error { color: #e55; }
    .status.success { color: #4a7; }
    .note { font-size: 12px; color: #555; margin-top: 8px; line-height: 1.6; }
    a.dl-link { color: #888; font-size: 12px; text-decoration: underline; cursor: pointer; }
    a.dl-link:hover { color: #aaa; }
  </style>
</head>
<body>
<div class="container">
  <h1>§ Orsayn Audit Generator</h1>
  <p class="subtitle">Outil interne — document strictement confidentiel</p>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('csv')">Base de données CSV</button>
    <button class="tab" onclick="switchTab('urls')">URLs directes</button>
    <button class="tab" onclick="switchTab('manual')">Saisie manuelle</button>
  </div>

  <div id="panel-csv" class="panel active">
    <p class="note" style="margin-bottom:16px;">
      Charge un fichier CSV contenant les liens et données des cabinets.<br><br>
      <a class="dl-link" onclick="downloadSampleCSV()">Télécharger un CSV exemple</a>
    </p>
    <div class="drop-zone" id="csvZone" onclick="document.getElementById('csvFile').click()">
      <input type="file" id="csvFile" accept=".csv,.txt" hidden>
      <p id="csvLabel">Cliquer ou glisser votre fichier CSV ici</p>
      <span class="hint">Séparateur : virgule, point-virgule, pipe ou tabulation</span>
    </div>
    <div id="csvPreview" style="margin-top:12px;font-size:12px;color:#555;display:none;"></div>
    <div class="lang-selector" style="display:flex;gap:8px;margin-bottom:12px;margin-top:20px;">
      <span style="font-size:12px;color:#666;line-height:28px;">Langue de l'audit :</span>
      <button id="csvLangFr" class="lang-btn active" onclick="setLang('csv','fr')">FR</button>
      <button id="csvLangEn" class="lang-btn" onclick="setLang('csv','en')">EN</button>
    </div>
    <button class="submit-btn" id="csvBtn" onclick="runCSV()">Analyser et générer les audits</button>
    <button class="submit-btn" id="csvCrmBtn" onclick="runCSVToCRM()" style="background:#2b6cb0; color:#fff; margin-top:10px;">Envoyer au CRM Notion</button>
    <div class="status" id="csvStatus"></div>
  </div>

  <div id="panel-urls" class="panel">
    <p class="note" style="margin-bottom:16px;">Entrez les URLs des cabinets.</p>
    <div class="url-list" id="urlList">
      <div class="url-card">
        <div class="url-main">
          <input type="url" class="url-input" placeholder="https://cabinet-exemple.fr">
          <button class="remove-btn" onclick="removeUrl(this)">x</button>
        </div>
        <div class="url-extras">
          <div class="field"><label>Note Google</label><input type="number" class="note-input" placeholder="4.8" step="0.1" min="0" max="5"></div>
          <div class="field"><label>Nb avis</label><input type="number" class="avis-input" placeholder="47" min="0"></div>
          <div class="field"><label>Classement</label><input type="text" class="class-input" placeholder="Legal 500..."></div>
        </div>
      </div>
    </div>
    <button class="add-btn" onclick="addUrl()">+ Ajouter un cabinet</button>
    <div class="lang-selector" style="display:flex;gap:8px;margin-bottom:12px;margin-top:20px;">
      <span style="font-size:12px;color:#666;line-height:28px;">Langue :</span>
      <button id="urlLangFr" class="lang-btn active" onclick="setLang('url','fr')">FR</button>
      <button id="urlLangEn" class="lang-btn" onclick="setLang('url','en')">EN</button>
    </div>
    <button class="submit-btn" id="urlBtn" onclick="runURLs()">Analyser et générer le(s) PDF</button>
    <button class="submit-btn" id="urlCrmBtn" onclick="runURLsToCRM()" style="background:#2b6cb0; color:#fff; margin-top:10px;">Envoyer au CRM Notion</button>
    <div class="status" id="urlStatus"></div>
  </div>

  <div id="panel-manual" class="panel">
    <form id="manualForm">
      <div class="grid2">
        <div class="field full"><label>Nom du cabinet *</label><input type="text" id="nom" value="Cabinet Dupont &amp; Associés" required></div>
        <div class="field"><label>URL du site</label><input type="url" id="url" value="https://example.com"></div>
        <div class="field"><label>Score (/100)</label><input type="number" id="score" value="64" min="0" max="100"></div>
        <div class="field"><label>Ville</label><input type="text" id="ville" placeholder="Paris"></div>
        <div class="field"><label>Année de création</label><input type="number" id="creation" value="2005"></div>
      </div>
      <div class="section">
        <div class="section-title">Forces</div>
        <div class="grid2">
          <div class="field"><label>Classement</label><input type="text" id="classement" placeholder="Legal 500"></div>
          <div class="field"><label>Note Google</label><input type="number" id="google" value="4.8" step="0.1" max="5"></div>
          <div class="field"><label>Nombre d'avis</label><input type="number" id="avis" value="47"></div>
          <div class="field"><label>Taille équipe</label><input type="number" id="equipe" value="12"></div>
          <div class="field"><label>Spécialité 1</label><input type="text" id="spec1" value="Droit pénal des affaires"></div>
          <div class="field"><label>Spécialité 2</label><input type="text" id="spec2"></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Failles détectées</div>
        <div class="check-grid">
          <div class="check-item"><input type="checkbox" id="template" checked><label for="template">Template générique</label></div>
          <div class="check-item"><input type="checkbox" id="ui" checked><label for="ui">UI obsolète</label></div>
          <div class="check-item"><input type="checkbox" id="copy" checked><label for="copy">Copywriting juridique</label></div>
          <div class="check-item"><input type="checkbox" id="mobile" checked><label for="mobile">Non responsive</label></div>
          <div class="check-item"><input type="checkbox" id="ssl"><label for="ssl">Pas de SSL</label></div>
        </div>
        <div class="grid2" style="margin-top:10px;">
          <div class="field"><label>Nom du CMS</label><input type="text" id="cms" placeholder="WordPress Avada"></div>
          <div class="field"><label>Chargement (s)</label><input type="number" id="chargement" value="4.2" step="0.1"></div>
          <div class="field full"><label>Commentaire UI</label><input type="text" id="uiCom" placeholder="palette marron, photos stock..."></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Screenshot du site *</div>
        <div class="drop-zone" id="imgZone" onclick="document.getElementById('screenshot').click()">
          <input type="file" id="screenshot" accept="image/*" hidden>
          <p id="imgLabel">Cliquer ou glisser une capture d'écran ici</p>
        </div>
      </div>
      <button type="submit" class="submit-btn" id="manualBtn">Générer le PDF</button>
      <div class="status" id="manualStatus"></div>
    </form>
  </div>
</div>

<script>
  const TAB_NAMES = ['csv', 'urls', 'manual'];
  function switchTab(name) {
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', TAB_NAMES[i] === name));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
  }

  const _selectedLang = { csv: 'fr', url: 'fr' };
  function setLang(tab, lang) {
    _selectedLang[tab] = lang;
    const pfx = tab === 'csv' ? 'csv' : 'url';
    document.getElementById(pfx + 'LangFr').classList.toggle('active', lang === 'fr');
    document.getElementById(pfx + 'LangEn').classList.toggle('active', lang === 'en');
  }

  const SAMPLE_CSV = \`${SAMPLE_CSV}\`;
  function downloadSampleCSV() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'modele_audit_orsayn.csv'; document.body.appendChild(a); a.click(); a.remove();
  }

  let csvFile = null;
  const csvZone = document.getElementById('csvZone');
  const csvInput = document.getElementById('csvFile');
  csvZone.addEventListener('dragover', e => { e.preventDefault(); csvZone.classList.add('drag'); });
  csvZone.addEventListener('dragleave', () => csvZone.classList.remove('drag'));
  csvZone.addEventListener('drop', e => { e.preventDefault(); csvZone.classList.remove('drag'); if (e.dataTransfer.files[0]) setCSVFile(e.dataTransfer.files[0]); });
  csvInput.addEventListener('change', e => { if (e.target.files[0]) setCSVFile(e.target.files[0]); });

  function setCSVFile(file) {
    csvFile = file;
    document.getElementById('csvLabel').textContent = '✓ ' + file.name;
    csvZone.classList.add('has-file');
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.trim().split('\\n');
      const count = lines.length - 1;
      const preview = document.getElementById('csvPreview');
      preview.style.display = 'block';
      preview.textContent = count + ' cabinet' + (count > 1 ? 's' : '') + ' détecté' + (count > 1 ? 's' : '') + ' dans le fichier.';
    };
    reader.readAsText(file);
  }

  async function runCSV() {
    if (!csvFile) { setStatus('csvStatus', 'Chargez un fichier CSV.', 'error'); return; }
    const btn = document.getElementById('csvBtn');
    btn.disabled = true; btn.textContent = 'Scraping en cours... (peut prendre 1 à 2 min)';
    setStatus('csvStatus', 'Analyse des sites en cours...', '');
    try {
      const form = new FormData();
      form.append('file', csvFile);
      form.append('lang', _selectedLang.csv);
      const res = await fetch('/api/scrape-audit', { method: 'POST', body: form });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      await downloadResponse(res, 'Audits_Orsayn.zip');
      setStatus('csvStatus', '✓ Audits générés et téléchargés.', 'success');
    } catch(err) {
      setStatus('csvStatus', 'Erreur : ' + err.message, 'error');
    } finally { btn.disabled = false; btn.textContent = 'Analyser et générer les audits'; }
  }

  async function runCSVToCRM() {
    if (!csvFile) { setStatus('csvStatus', 'Chargez un fichier CSV.', 'error'); return; }
    const btn = document.getElementById('csvCrmBtn');
    btn.disabled = true; btn.textContent = 'Envoi au CRM en cours...';
    setStatus('csvStatus', 'Scraping et synchronisation CRM...', '');
    try {
      const form = new FormData();
      form.append('file', csvFile);
      const res = await fetch('/api/notion-crm', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur API');
      setStatus('csvStatus', '✓ ' + data.created + ' cabinets ajoutés au CRM.' + (data.failed ? ' (' + data.failed + ' erreurs)' : ''), 'success');
    } catch(err) {
      setStatus('csvStatus', 'Erreur CRM : ' + err.message, 'error');
    } finally { btn.disabled = false; btn.textContent = 'Envoyer au CRM Notion'; }
  }

  function mkUrlCard() {
    const card = document.createElement('div');
    card.className = 'url-card';
    card.innerHTML = '<div class="url-main"><input type="url" class="url-input" placeholder="https://cabinet-exemple.fr"><button class="remove-btn" onclick="removeUrl(this)">x</button></div><div class="url-extras"><div class="field"><label>Note Google</label><input type="number" class="note-input" placeholder="4.8" step="0.1" min="0" max="5"></div><div class="field"><label>Nb avis</label><input type="number" class="avis-input" placeholder="47" min="0"></div><div class="field"><label>Classement</label><input type="text" class="class-input" placeholder="Legal 500..."></div></div>';
    return card;
  }
  function addUrl() { document.getElementById('urlList').appendChild(mkUrlCard()); }
  function removeUrl(btn) {
    const list = document.getElementById('urlList');
    if (list.children.length > 1) btn.closest('.url-card, .url-row').remove();
  }
  async function runURLs() {
    const cards = [...document.querySelectorAll('#urlList .url-card, #urlList .url-row')];
    const entries = cards.map(card => {
      const url = (card.querySelector('.url-input, input[type=url]'))?.value?.trim();
      const note = parseFloat(card.querySelector('.note-input')?.value || '');
      const avis = parseInt(card.querySelector('.avis-input')?.value || '');
      const classement = card.querySelector('.class-input')?.value?.trim();
      return { url, overrides: { Note_Google: isNaN(note) ? undefined : note, Nb_Avis_Google: isNaN(avis) ? undefined : avis, Nom_Classement: classement || undefined } };
    }).filter(e => e.url);
    if (!entries.length) { setStatus('urlStatus', 'Ajoutez au moins une URL.', 'error'); return; }

    const btn = document.getElementById('urlBtn');
    btn.disabled = true; btn.textContent = 'Scraping en cours...';
    setStatus('urlStatus', 'Analyse requise. Patientez...', '');
    try {
      const res = await fetch('/api/scrape-audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, lang: _selectedLang.url })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      await downloadResponse(res, entries.length > 1 ? 'Audits.zip' : 'Audit.pdf');
      setStatus('urlStatus', '✓ Fichier téléchargé.', 'success');
    } catch (err) {
      setStatus('urlStatus', 'Erreur : ' + err.message, 'error');
    } finally { btn.disabled = false; btn.textContent = 'Analyser et générer le(s) PDF'; }
  }

  async function runURLsToCRM() {
    const cards = [...document.querySelectorAll('#urlList .url-card, #urlList .url-row')];
    const entries = cards.map(card => {
      const url = (card.querySelector('.url-input, input[type=url]'))?.value?.trim();
      const note = parseFloat(card.querySelector('.note-input')?.value || '');
      const avis = parseInt(card.querySelector('.avis-input')?.value || '');
      const classement = card.querySelector('.class-input')?.value?.trim();
      return { url, overrides: { Note_Google: isNaN(note) ? undefined : note, Nb_Avis_Google: isNaN(avis) ? undefined : avis, Nom_Classement: classement || undefined } };
    }).filter(e => e.url);
    if (!entries.length) { setStatus('urlStatus', 'Ajoutez au moins une URL.', 'error'); return; }

    const btn = document.getElementById('urlCrmBtn');
    btn.disabled = true; btn.textContent = 'Envoi au CRM en cours...';
    setStatus('urlStatus', 'Scraping et synchronisation CRM...', '');
    try {
      const res = await fetch('/api/notion-crm', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur API');
      setStatus('urlStatus', '✓ ' + data.created + ' cabinets ajoutés au CRM.', 'success');
    } catch (err) {
      setStatus('urlStatus', 'Erreur CRM : ' + err.message, 'error');
    } finally { btn.disabled = false; btn.textContent = 'Envoyer au CRM Notion'; }
  }

  let screenshotB64 = '';
  const imgZone = document.getElementById('imgZone');
  const imgInput = document.getElementById('screenshot');
  imgZone.addEventListener('dragover', e => { e.preventDefault(); });
  imgZone.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleImg(e.dataTransfer.files[0]); });
  imgInput.addEventListener('change', e => { if (e.target.files[0]) handleImg(e.target.files[0]); });
  function handleImg(file) {
    const r = new FileReader(); r.onload = () => { screenshotB64 = r.result.split(',')[1]; document.getElementById('imgLabel').textContent = '✓ ' + file.name; imgZone.classList.add('has-file'); };
    r.readAsDataURL(file);
  }

  document.getElementById('manualForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (!screenshotB64) { setStatus('manualStatus', 'Ajoutez une capture d\\'écran.', 'error'); return; }
    const btn = document.getElementById('manualBtn');
    btn.disabled = true; btn.textContent = 'Génération en cours...';
    setStatus('manualStatus', 'Cela peut prendre quelques secondes.', '');
    const v = id => document.getElementById(id)?.value || '';
    const payload = {
      Nom_Cabinet: v('nom'), URL_Site: v('url'),
      Score_Global: parseInt(v('score')) || 64, Ville: v('ville') || undefined, Annee_Creation: parseInt(v('creation')) || undefined, Nom_Classement: v('classement') || undefined,
      Note_Google: parseFloat(v('google')) || undefined, Nb_Avis_Google: parseInt(v('avis')) || undefined, Taille_Equipe: parseInt(v('equipe')) || undefined,
      Specialite_1: v('spec1') || undefined, Specialite_2: v('spec2') || undefined,
      Est_Template: document.getElementById('template').checked, Nom_Template: v('cms') || undefined,
      UI_Obsolete: document.getElementById('ui').checked, UI_Commentaire: v('uiCom') || undefined,
      Copywriting_Juridique: document.getElementById('copy').checked, Pas_Mobile: document.getElementById('mobile').checked, Pas_SSL: document.getElementById('ssl').checked,
      Temps_Chargement: parseFloat(v('chargement')) || undefined, Screenshot_Base64: screenshotB64,
    };
    try {
      const res = await fetch('/api/generate-audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      await downloadResponse(res, 'Audit_' + v('nom').replace(/\\s+/g, '_') + '.pdf');
      setStatus('manualStatus', '✓ PDF téléchargé.', 'success');
    } catch (err) {
      setStatus('manualStatus', 'Erreur : ' + err.message, 'error');
    } finally { btn.disabled = false; btn.textContent = 'Générer le PDF'; }
  });

  async function downloadResponse(res, defaultName) {
    const blob = await res.blob();
    const cd = res.headers.get('Content-Disposition') || '';
    const match = cd.match(/filename="([^"]+)"/);
    const name = match ? match[1] : defaultName;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function setStatus(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg; el.className = 'status' + (type ? ' ' + type : '');
  }
</script>
</body>
</html>`;

export async function GET(req: NextRequest) {
    // Basic API Key protection for internal tool
    const url = new URL(req.url);
    const key = url.searchParams.get('key') || req.headers.get('authorization')?.replace('Bearer ', '');

    // If AUDIT_TOOL_KEY is set in env, require it. Otherwise fail-safe (deny access).
    const validKey = process.env.AUDIT_TOOL_KEY;

    if (!validKey || key !== validKey) {
        return errorResponse('Accès non autorisé', 403);
    }

    return new NextResponse(TEST_PAGE_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
        },
    });
}

// Block all other HTTP methods
export async function POST() { return methodNotAllowed(); }
export async function PUT() { return methodNotAllowed(); }
export async function DELETE() { return methodNotAllowed(); }
export async function PATCH() { return methodNotAllowed(); }
