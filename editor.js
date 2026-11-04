/* Shared, browser-only editor. Existing per-template storage keys are preserved. */
window.CVBuddyEditor = {
  init({ storageKey, name, typography = { recommendedSize: 'medium', recommendedFont: 'arial', legacyFont: 'arial', fonts: [{ id: 'arial', label: 'Arial' }, { id: 'georgia', label: 'Georgia' }, { id: 'times', label: 'Times New Roman' }] } }) {
    const cv = document.getElementById('cv');
    if (!cv) return;
    const original = cv.innerHTML;
    const backupKey = `${storageKey}:beforeReset`;
    let dirty = false;
    let timer;
    let messageTimer;
    let imageVersion = 0;
    let loadError = false;
    let storageBlocked = false;
    const defaultAppearance = { size: typography.recommendedSize, font: typography.recommendedFont };
    let appearance = { ...defaultAppearance };

    function decodeDraft(raw) {
      const draft = JSON.parse(raw);
      if (typeof draft === 'string') {
        // Legacy HTML-only drafts retain their original template typography.
        return { html: draft, appearance: { size: 'medium', font: typography.legacyFont } };
      }
      if (!draft || draft.version !== 2 || typeof draft.html !== 'string') throw new Error('Invalid draft');
      return {
        html: draft.html,
        appearance: {
          size: ['small', 'medium', 'large'].includes(draft.appearance?.size) ? draft.appearance.size : defaultAppearance.size,
          font: typography.fonts.some(font => font.id === draft.appearance?.font) ? draft.appearance.font : defaultAppearance.font
        }
      };
    }

    // Old drafts contain HTML. Keep document formatting but discard executable markup.
    function cleanHTML(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const tags = new Set('SECTION DIV SPAN H1 H2 H3 H4 H5 H6 P TABLE THEAD TBODY TFOOT TR TD TH CAPTION COLGROUP COL STRONG B EM I U S A UL OL LI IMG BR HR SUP SUB BLOCKQUOTE PRE CODE DL DT DD MARK FONT'.split(' '));
      const styleProperties = new Set('color background-color font font-family font-size font-style font-weight font-variant text-decoration text-decoration-line text-decoration-color text-decoration-style text-align text-indent text-transform vertical-align line-height letter-spacing word-spacing white-space margin margin-top margin-right margin-bottom margin-left padding padding-top padding-right padding-bottom padding-left border border-top border-right border-bottom border-left border-width border-style border-color border-collapse border-spacing width height min-width max-width min-height max-height display list-style-type list-style-position'.split(' '));
      doc.body.querySelectorAll('script,style,iframe,object,embed,svg,math,form,input,button,link,meta').forEach(el => el.remove());
      for (const el of [...doc.body.querySelectorAll('*')]) {
        if (!tags.has(el.tagName)) { el.replaceWith(...el.childNodes); continue; }
        for (const attr of [...el.attributes]) {
          const key = attr.name;
          const value = attr.value;
          if (key === 'style') {
            // Preserve rich-text formatting across saves, without executable or URL-based CSS.
            for (const property of [...el.style]) {
              if (!styleProperties.has(property) || /url\s*\(|expression\s*\(/i.test(el.style.getPropertyValue(property))) el.style.removeProperty(property);
            }
            if (!el.style.length) el.removeAttribute('style');
            continue;
          }
          const safe = key === 'class' || ['colspan', 'rowspan', 'alt', 'start', 'reversed', 'value', 'type', 'face', 'size', 'color'].includes(key)
            || (key === 'id' && ['imageDiv', 'previewImage'].includes(value))
            || (key === 'href' && /^(https?:|mailto:|tel:|#)/i.test(value))
            || (key === 'src' && /^(https?:\/\/|\.\.\/img\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(value));
          if (!safe) el.removeAttribute(key);
        }
      }
      return doc.body.innerHTML;
    }

    let restored = false;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const draft = decodeDraft(raw);
        cv.innerHTML = cleanHTML(draft.html);
        appearance = draft.appearance;
        restored = true;
      }
    } catch (error) { loadError = true; }

    document.body.classList.add('editor-page');
    document.title = `${name} editor | CV Buddy`;
    const shell = document.createElement('div');
    shell.innerHTML = `
      <header class="editor-topbar">
        <div class="editor-brand"><a class="back-link" href="../index.html#templates">← Templates</a><span id="templateLabel"></span></div>
        <div class="editor-actions">
          <span class="save-status" id="saveStatus" role="status" aria-live="polite"></span>
          <details class="draft-menu">
            <summary class="button button-quiet">Options</summary>
            <div class="menu-content">
              <div class="typography-controls">
                <span class="control-label" id="fontLabel">Font</span>
                <div class="font-picker"><button id="fontFamily" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="fontOptions" aria-labelledby="fontLabel fontChoice"><span id="fontChoice"></span><svg class="font-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></button><div id="fontOptions" role="listbox" aria-labelledby="fontLabel" hidden></div></div>
                <span class="control-label" id="sizeLabel">Text size</span>
                <div class="size-options" role="group" aria-labelledby="sizeLabel"><button type="button" data-size="small" aria-pressed="false">Small</button><button type="button" data-size="medium" aria-pressed="false">Medium</button><button type="button" data-size="large" aria-pressed="false">Large</button></div>
                <p class="size-note" id="sizeRecommendation"></p>
              </div>
              <div class="appearance">
                <label class="toggle-row" id="logoControl">Institute logo <input type="checkbox" id="showLogo"></label>
                <label class="toggle-row" id="photoControl">Profile photo <input type="checkbox" id="showPhoto"></label>
                <button id="changePhoto" type="button">Change photo…</button>
                <input type="file" id="photoUpload" accept="image/png,image/jpeg,image/webp" hidden>
              </div>
              <button id="saveCv" type="button">Save now</button>
              <button id="editingHelp" type="button">Editing help & shortcuts</button>
              <button id="restoreCv" type="button">Restore before last reset</button>
              <button id="resetCv" class="danger" type="button">Reset to sample…</button>
              <p class="menu-note">Drafts stay in this browser. Save a PDF before clearing browser data or switching devices.</p>
            </div>
          </details>
          <button class="button button-primary" id="printCv" type="button">Print / Save PDF <span aria-hidden="true">↗</span></button>
        </div>
      </header>
      <main class="editor-main" aria-label="Editable CV">
        <p class="editor-help" id="editorHelp">Click any text to edit. Changes save on this browser.</p>
        <div class="paper-viewport" tabindex="0" role="region" aria-label="CV document; click text to edit"><div class="paper-wrap"></div></div>
      </main>
      <div class="editor-message" id="editorMessage" hidden><span id="messageText" role="status"></span><button id="dismissMessage" type="button" aria-label="Dismiss message">×</button></div>
      <dialog class="editor-dialog help-dialog" id="helpDialog" aria-labelledby="helpTitle"><h2 id="helpTitle">Editing your CV</h2><p>Click inside the CV to edit. Select text before applying formatting. You are editing the final document directly.</p>
        <table class="shortcut-table"><thead><tr><th>Action</th><th>Windows / Linux</th><th>Mac</th></tr></thead><tbody>
          <tr><td>Bold</td><td>Ctrl + B</td><td>⌘ + B</td></tr><tr><td>Italic</td><td>Ctrl + I</td><td>⌘ + I</td></tr><tr><td>Underline</td><td>Ctrl + U</td><td>⌘ + U</td></tr>
          <tr><td>Undo</td><td>Ctrl + Z</td><td>⌘ + Z</td></tr><tr><td>Redo</td><td>Ctrl + Shift + Z / Ctrl + Y</td><td>⌘ + Shift + Z</td></tr>
          <tr><td>Copy / paste</td><td>Ctrl + C / V</td><td>⌘ + C / V</td></tr><tr><td>Save now</td><td>Ctrl + S</td><td>⌘ + S</td></tr>
        </tbody></table>
        <p><strong>Lists:</strong> Enter adds the next bullet. Enter again on an empty bullet leaves the list. Shift + Enter adds a line within a bullet.</p>
        <p><strong>Blocks:</strong> Select and copy a heading, list, or section, then paste it where you want the copy. Your browser preserves rich-text formatting.</p>
        <p><strong>Typography:</strong> Options contains font choices and Small, Medium, and Large styles for the whole CV. Recommended settings vary by template. Larger text may use more pages; the printed styles match the editor.</p>
        <p class="ai-help"><strong>Want help writing?</strong> Browser extensions such as <a href="https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome" target="_blank" rel="noopener noreferrer">Claude in Chrome</a> or <a href="https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app" target="_blank" rel="noopener noreferrer">ChatGPT’s browser extension</a> can help draft or fill your CV using the details you provide. Review the suggestions and keep only accurate information about your experience.</p>
        <div class="dialog-actions"><button class="button button-primary" id="closeHelp" type="button" autofocus>Got it</button></div>
      </dialog>
      <dialog class="editor-dialog" id="resetDialog" aria-labelledby="resetTitle"><h2 id="resetTitle">Start fresh?</h2><p>This replaces this template’s current CV with the sample content. You can recover your current draft using “Restore before last reset” in the Options menu.</p><div class="dialog-actions"><button class="button" id="cancelReset" type="button" autofocus>Keep editing</button><button class="button button-danger" id="confirmReset" type="button">Reset to sample</button></div></dialog>
      <dialog class="editor-dialog" id="printDialog" aria-labelledby="printTitle"><h2 id="printTitle">Save your CV as PDF</h2><p>Your CV will open in your browser’s print preview. Editor controls won’t appear in the document.</p><ol><li>Choose <strong>Save as PDF</strong> as the destination.</li><li>Select <strong>A4</strong> paper and check the page breaks.</li><li>Turn off browser <strong>headers and footers</strong>.</li></ol><div class="dialog-actions"><button class="button" id="cancelPrint" type="button">Back to editing</button><button class="button button-primary" id="confirmPrint" type="button" autofocus>Open print preview ↗</button></div></dialog>`;
    shell.querySelector('.paper-wrap').append(cv);
    document.querySelector('.main-container').replaceWith(...shell.children);
    const $ = id => document.getElementById(id);
    $('templateLabel').textContent = name;
    const status = $('saveStatus');
    const viewport = document.querySelector('.paper-viewport');
    const wrap = document.querySelector('.paper-wrap');
    const menu = document.querySelector('.draft-menu');
    let activeFont = 0;
    let fontSearch = '';
    let fontSearchTimer;
    for (const [index, font] of typography.fonts.entries()) {
      const option = document.createElement('button');
      option.type = 'button';
      option.id = `fontOption${index}`;
      option.className = 'font-option';
      option.dataset.font = font.id;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.tabIndex = -1;
      const label = document.createElement('span');
      label.className = 'font-name';
      label.textContent = font.label;
      const choice = document.createElement('span');
      choice.className = 'font-option-label';
      choice.innerHTML = '<svg class="font-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6"/></svg>';
      choice.append(label);
      option.append(choice);
      if (font.id === typography.recommendedFont) {
        const badge = document.createElement('span');
        badge.className = 'font-recommended';
        badge.textContent = 'Recommended';
        option.append(badge);
      }
      option.addEventListener('click', () => chooseFont(index));
      $('fontOptions').append(option);
    }
    $('sizeRecommendation').textContent = `Recommended for this template: ${typography.recommendedSize}.`;

    function announce(message, error = false) {
      clearTimeout(messageTimer);
      $('messageText').textContent = message;
      $('editorMessage').dataset.error = String(error);
      $('editorMessage').hidden = false;
      if (!error) messageTimer = setTimeout(() => { $('editorMessage').hidden = true; }, 6000);
    }
    function setStatus(message, state = 'saved') {
      status.textContent = message;
      status.dataset.state = state;
    }
    function serialize() { return { version: 2, html: cleanHTML(cv.innerHTML), appearance: { ...appearance } }; }
    function save() {
      clearTimeout(timer);
      if (loadError) {
        setStatus('Draft needs attention', 'error');
        announce('Your previous draft could not be loaded. To protect it, autosave is paused. Use Options → Reset to sample to keep a recovery copy and start again.', true);
        return false;
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(serialize()));
        dirty = false;
        storageBlocked = false;
        setStatus('Saved on this browser');
        return true;
      } catch (error) {
        storageBlocked = true;
        setStatus('Not saved', 'error');
        announce('Your browser could not save this draft. Storage may be full or unavailable. Keep this tab open and save a PDF to keep your work.', true);
        return false;
      }
    }
    function changed() {
      dirty = true;
      refreshControls();
      setStatus('Unsaved changes', 'pending');
      clearTimeout(timer);
      timer = setTimeout(save, 650);
    }
    function enableEditing() {
      // One editing host, as in the original editor: native lists, rich paste, and undo.
      cv.setAttribute('contenteditable', 'true');
      cv.setAttribute('aria-label', 'CV document, editable');
    }
    function applyAppearance() {
      cv.dataset.size = appearance.size;
      cv.dataset.font = appearance.font;
      $('fontChoice').textContent = typography.fonts.find(font => font.id === appearance.font).label;
      $('fontFamily').dataset.font = appearance.font;
      $('fontOptions').querySelectorAll('[role="option"]').forEach(option => option.setAttribute('aria-selected', String(option.dataset.font === appearance.font)));
      menu.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.size === appearance.size)));
    }
    function highlightFont(index) {
      activeFont = (index + typography.fonts.length) % typography.fonts.length;
      $('fontFamily').setAttribute('aria-activedescendant', `fontOption${activeFont}`);
      $('fontOptions').querySelectorAll('[role="option"]').forEach((option, i) => option.classList.toggle('is-active', i === activeFont));
    }
    function openFontPicker() {
      $('fontOptions').hidden = false;
      $('fontFamily').setAttribute('aria-expanded', 'true');
      highlightFont(typography.fonts.findIndex(font => font.id === appearance.font));
    }
    function closeFontPicker() {
      $('fontOptions').hidden = true;
      $('fontFamily').setAttribute('aria-expanded', 'false');
      $('fontFamily').removeAttribute('aria-activedescendant');
      fontSearch = '';
      clearTimeout(fontSearchTimer);
    }
    function chooseFont(index) {
      appearance.font = typography.fonts[index].id;
      applyAppearance();
      changed();
      closeFontPicker();
      $('fontFamily').focus();
    }
    function resizePaper() {
      const pageWidth = cv.offsetWidth;
      const scale = Math.min(1, (viewport.clientWidth - 8) / pageWidth);
      cv.style.transform = `scale(${scale})`;
      wrap.style.width = `${pageWidth * scale}px`;
      wrap.style.height = `${cv.offsetHeight * scale}px`;
    }
    function photo() { return cv.querySelector('#previewImage'); }
    function logo() { return cv.querySelector('.header img:not(#previewImage)'); }
    function visible(img) { return img && img.style.display !== 'none'; }
    function refreshControls() {
      $('logoControl').hidden = !logo();
      $('photoControl').hidden = !photo();
      $('changePhoto').hidden = !photo();
      $('showLogo').checked = !!visible(logo());
      $('showPhoto').checked = !!visible(photo());
      try { $('restoreCv').disabled = !localStorage.getItem(backupKey); }
      catch (error) { $('restoreCv').disabled = true; }
    }
    function prepare() {
      cv.querySelectorAll('input').forEach(el => el.remove());
      cv.querySelectorAll('img').forEach(img => img.alt = img.id === 'previewImage' ? 'Profile photo' : 'Institute logo');
      enableEditing();
      applyAppearance();
      refreshControls();
      resizePaper();
    }

    cv.addEventListener('input', changed);
    cv.addEventListener('click', event => {
      if (event.target.closest('a')) event.preventDefault();
    });
    cv.addEventListener('keydown', event => {
      // Leave native Enter, formatting, clipboard, drag/drop, and undo behavior intact.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); }
    });
    $('dismissMessage').addEventListener('click', () => { $('editorMessage').hidden = true; });
    $('fontFamily').addEventListener('click', () => { if ($('fontOptions').hidden) openFontPicker(); else closeFontPicker(); });
    $('fontFamily').addEventListener('keydown', event => {
      const opened = !$('fontOptions').hidden;
      if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        if (!opened) openFontPicker();
        if (event.key === 'Home') highlightFont(0);
        else if (event.key === 'End') highlightFont(typography.fonts.length - 1);
        else if (opened && event.key === 'ArrowDown') highlightFont(activeFont + 1);
        else if (opened && event.key === 'ArrowUp') highlightFont(activeFont - 1);
        else if (opened && ['Enter', ' '].includes(event.key)) chooseFont(activeFont);
      } else if (event.key === 'Escape' && opened) {
        event.preventDefault();
        event.stopPropagation();
        closeFontPicker();
      } else if (event.key === 'Tab') closeFontPicker();
      else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (!opened) openFontPicker();
        fontSearch += event.key.toLowerCase();
        clearTimeout(fontSearchTimer);
        fontSearchTimer = setTimeout(() => { fontSearch = ''; }, 700);
        const index = typography.fonts.findIndex(font => font.label.toLowerCase().startsWith(fontSearch));
        if (index !== -1) highlightFont(index);
      }
    });
    menu.addEventListener('toggle', () => { if (!menu.open) closeFontPicker(); });
    menu.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => { appearance.size = button.dataset.size; applyAppearance(); changed(); }));
    $('editingHelp').addEventListener('click', () => { menu.open = false; $('helpDialog').showModal(); });
    $('closeHelp').addEventListener('click', () => $('helpDialog').close());
    $('saveCv').addEventListener('click', () => { if (save()) announce('Your draft is saved on this browser.'); menu.open = false; });
    $('showLogo').addEventListener('change', () => { logo().style.display = $('showLogo').checked ? '' : 'none'; changed(); });
    $('showPhoto').addEventListener('change', () => { photo().style.display = $('showPhoto').checked ? '' : 'none'; changed(); });
    $('changePhoto').addEventListener('click', () => $('photoUpload').click());
    $('photoUpload').addEventListener('change', async () => {
      const file = $('photoUpload').files[0];
      $('photoUpload').value = '';
      if (!file) return;
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        announce('Choose a JPG, PNG or WebP image smaller than 5 MB.', true); return;
      }
      const version = ++imageVersion;
      const url = URL.createObjectURL(file);
      try {
        const img = new Image();
        img.src = url;
        await img.decode();
        if (version !== imageVersion) return;
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, 480 / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        photo().src = canvas.toDataURL('image/jpeg', .85);
        photo().style.display = '';
        refreshControls();
        changed();
        announce('Photo updated. It will be saved with this draft.');
      } catch (error) { announce('This image could not be opened. Please try another JPG, PNG or WebP.', true); }
      finally { URL.revokeObjectURL(url); }
    });
    $('resetCv').addEventListener('click', () => { menu.open = false; $('resetDialog').showModal(); });
    $('cancelReset').addEventListener('click', () => $('resetDialog').close());
    $('confirmReset').addEventListener('click', () => {
      try {
        // Preserve an unreadable previous draft verbatim instead of overwriting it.
        const backup = loadError ? localStorage.getItem(storageKey) : JSON.stringify(serialize());
        if (backup !== null) localStorage.setItem(backupKey, backup);
      } catch (error) {
        $('resetDialog').close();
        announce('Could not keep a recovery copy. Your CV has not been reset. Save a PDF first and check browser storage.', true);
        return;
      }
      ++imageVersion;
      cv.innerHTML = cleanHTML(original);
      appearance = { ...defaultAppearance };
      loadError = false;
      dirty = true;
      prepare();
      const saved = save();
      $('resetDialog').close();
      if (saved) announce('Sample restored. Recover your previous draft from Options → Restore before last reset.');
    });
    $('restoreCv').addEventListener('click', () => {
      menu.open = false;
      try {
        const draft = decodeDraft(localStorage.getItem(backupKey));
        ++imageVersion;
        cv.innerHTML = cleanHTML(draft.html);
        appearance = draft.appearance;
        loadError = false;
        dirty = true;
        prepare();
        if (save()) announce('Your draft from before the last reset has been restored.');
      } catch (error) { announce('The recovery copy could not be read. Your current CV has not been replaced.', true); }
    });
    $('printCv').addEventListener('click', () => { if (dirty) save(); $('printDialog').showModal(); });
    $('cancelPrint').addEventListener('click', () => $('printDialog').close());
    $('confirmPrint').addEventListener('click', async () => { $('printDialog').close(); await document.fonts.ready; window.print(); });
    document.addEventListener('click', event => {
      if (!event.target.closest('.font-picker')) closeFontPicker();
      if (!menu.contains(event.target)) menu.open = false;
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') menu.open = false; });
    document.addEventListener('visibilitychange', () => { if (document.hidden && dirty) save(); });
    window.addEventListener('beforeunload', event => {
      if (dirty && (!save() || storageBlocked)) { event.preventDefault(); event.returnValue = ''; }
    });
    new ResizeObserver(resizePaper).observe(cv);
    new ResizeObserver(resizePaper).observe(viewport);
    prepare();
    if (loadError) save();
    else {
      setStatus(restored ? 'Saved draft restored' : 'Autosave is on');
      if (!restored) $('editorHelp').textContent = 'Fictional sample. Click any text to replace it with your own.';
    }
  }
};
