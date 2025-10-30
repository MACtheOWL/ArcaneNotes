// wwwroot/js/app.js

const App = (() => {

    // -----------------------------
    // Helper to build DOM nodes
    // -----------------------------
    function el(html) {
        const t = document.createElement('template');
        t.innerHTML = html.trim();
        return t.content.firstChild;
    }

    // -----------------------------
    // IMAGE UPLOAD & DROP
    // -----------------------------
    function enableImageDrop(preview) {
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            preview.classList.add('drag-hover');
        });

        preview.addEventListener('dragleave', () => preview.classList.remove('drag-hover'));

        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            preview.classList.remove('drag-hover');
            const file = e.dataTransfer.files[0];
            handleFile(file, preview);
        });
    }

    function triggerImageUpload(preview) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.onchange = (e) => handleFile(e.target.files[0], preview);
        input.click();
    }

    function handleFile(file, preview) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            img.dataset.imageBase64 = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }

    // -----------------------------
    // NPC FIELD
    // -----------------------------
    function addNpc(isGM = false) {
        const relationship = isGM
            ? `<div class="col-md-3"><input class="form-control npc-rel" placeholder="Relationship to the party"></div>`
            : '';

        const block = el(`
        <div class="card p-3 npc-block position-relative">
            <div class="note-tools">
                <button type="button" class="btn btn-sm btn-outline-light btn-image" title="Add Image" onclick="App.triggerImageUpload(this.closest('.card').querySelector('.image-preview'))">📷</button>
                <button type="button" class="btn btn-sm btn-outline-danger note-remove" onclick="this.closest('.card').remove()">✖</button>
            </div>

            <h5>NPC</h5>
            <div class="row g-2">
                <div class="col-md-3"><input class="form-control npc-name" placeholder="Name"></div>
                <div class="col-md-3"><input class="form-control npc-location" placeholder="Location met"></div>
                <div class="col-md-3"><input class="form-control npc-spoke" placeholder="${isGM ? 'What they spoke about' : 'Note about person'}"></div>
                ${relationship}
            </div>

            <div class="image-preview mt-2 text-center" onclick="App.triggerImageUpload(this)">
                <p class="image-placeholder">📷 Click or drop an image here</p>
            </div>
        </div>
        `);

        document.getElementById('formContainer').appendChild(block);
        enableImageDrop(block.querySelector('.image-preview'));
    }

    // -----------------------------
    // LOCATION FIELD
    // -----------------------------
    function addLocation() {
        const block = el(`
        <div class="card p-3 location-block position-relative">
            <div class="note-tools">
                <button type="button" class="btn btn-sm btn-outline-light btn-image" title="Add Image" onclick="App.triggerImageUpload(this.closest('.card').querySelector('.image-preview'))">📷</button>
                <button type="button" class="btn btn-sm btn-outline-danger note-remove" onclick="this.closest('.card').remove()">✖</button>
            </div>

            <h5>Location</h5>
            <input class="form-control location-text" placeholder="Where you went or met someone">

            <div class="image-preview mt-2 text-center" onclick="App.triggerImageUpload(this)">
                <p class="image-placeholder">📷 Click or drop an image here</p>
            </div>
        </div>
        `);

        document.getElementById('formContainer').appendChild(block);
        enableImageDrop(block.querySelector('.image-preview'));
    }

    // -----------------------------
    // TREASURE FIELD
    // -----------------------------
    function addTreasure() {
        const block = el(`
        <div class="card p-3 treasure-block position-relative">
            <div class="note-tools">
                <button type="button" class="btn btn-sm btn-outline-light btn-image" title="Add Image" onclick="App.triggerImageUpload(this.closest('.card').querySelector('.image-preview'))">📷</button>
                <button type="button" class="btn btn-sm btn-outline-danger note-remove" onclick="this.closest('.card').remove()">✖</button>
            </div>

            <h5>Treasure</h5>
            <div class="row g-2 align-items-center mb-2">
                <div class="col-md-2 d-flex align-items-center">
                    <input type="number" class="form-control treasure-plat" placeholder="0" min="0" value="0">
                    <span class="ms-2 text-muted">pp</span>
                </div>
                <div class="col-md-2 d-flex align-items-center">
                    <input type="number" class="form-control treasure-gold" placeholder="0" min="0" value="0">
                    <span class="ms-2 text-muted">gp</span>
                </div>
                <div class="col-md-2 d-flex align-items-center">
                    <input type="number" class="form-control treasure-silver" placeholder="0" min="0" value="0">
                    <span class="ms-2 text-muted">sp</span>
                </div>
                <div class="col-md-2 d-flex align-items-center">
                    <input type="number" class="form-control treasure-copper" placeholder="0" min="0" value="0">
                    <span class="ms-2 text-muted">cp</span>
                </div>
            </div>

            <button type="button" class="btn btn-sm btn-outline-light mb-2" onclick="App.addTreasureItem(this)">Add Item</button>
            <div class="item-list"></div>

            <div class="image-preview mt-2 text-center" onclick="App.triggerImageUpload(this)">
                <p class="image-placeholder">📷 Click or drop an image here</p>
            </div>
        </div>
        `);

        document.getElementById('formContainer').appendChild(block);
        enableImageDrop(block.querySelector('.image-preview'));
    }

    // -----------------------------
    // TREASURE ITEM FIELD
    // -----------------------------
    function addTreasureItem(btn) {
        const item = el(`
        <div class="input-group mb-2">
            <input class="form-control treasure-item" placeholder="Item name">
        </div>
        `);
        btn.closest('.treasure-block').querySelector('.item-list').appendChild(item);
    }

    // -----------------------------
    // PLOT FIELD
    // -----------------------------
    function addPlot() {
        const block = el(`
        <div class="card p-3 plot-block position-relative">
            <div class="note-tools">
                <button type="button" class="btn btn-sm btn-outline-light btn-image" title="Add Image" onclick="App.triggerImageUpload(this.closest('.card').querySelector('.image-preview'))">📷</button>
                <button type="button" class="btn btn-sm btn-outline-danger note-remove" onclick="this.closest('.card').remove()">✖</button>
            </div>

            <h5>Plot / Important Events</h5>
            <textarea class="form-control plot-text" rows="3" placeholder="What important things happened?"></textarea>

            <div class="image-preview mt-2 text-center" onclick="App.triggerImageUpload(this)">
                <p class="image-placeholder">📷 Click or drop an image here</p>
            </div>
        </div>
        `);

        document.getElementById('formContainer').appendChild(block);
        enableImageDrop(block.querySelector('.image-preview'));
    }

    // -----------------------------
    // EXTRA INFO FIELD
    // -----------------------------
    function addExtra() {
        const block = el(`
        <div class="card p-3 extra-block position-relative">
            <div class="note-tools">
                <button type="button" class="btn btn-sm btn-outline-light btn-image" title="Add Image" onclick="App.triggerImageUpload(this.closest('.card').querySelector('.image-preview'))">📷</button>
                <button type="button" class="btn btn-sm btn-outline-danger note-remove" onclick="this.closest('.card').remove()">✖</button>
            </div>

            <h5>Extra Info</h5>
            <textarea class="form-control extra-text" rows="3" placeholder="Quick note"></textarea>

            <div class="image-preview mt-2 text-center" onclick="App.triggerImageUpload(this)">
                <p class="image-placeholder">📷 Click or drop an image here</p>
            </div>
        </div>
        `);

        document.getElementById('formContainer').appendChild(block);
        enableImageDrop(block.querySelector('.image-preview'));
    }

    // -----------------------------
    // POPUP MESSAGE
    // -----------------------------
    function showPopup(message) {
        const popup = document.getElementById("arcanePopup");
        const msg = document.getElementById("popupMessage");
        const closeBtn = document.getElementById("popupClose");
        if (!popup || !msg || !closeBtn) return;

        msg.textContent = message;
        popup.style.display = "flex";

        closeBtn.onclick = () => popup.style.display = "none";
        popup.onclick = (e) => { if (e.target === popup) popup.style.display = "none"; };
    }



    // -----------------------------
    // PDF GENERATION HANDLER
    // -----------------------------
    async function makeItArcane(role) {
        const today = new Date();
        const dateString = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-'); // DD-MM-YYYY

        // --- NPCs ---
        const npcs = [...document.querySelectorAll('.npc-block')].map(b => ({
            name: b.querySelector('.npc-name')?.value || '',
            location: b.querySelector('.npc-location')?.value || '',
            spokeAbout: b.querySelector('.npc-spoke')?.value || '',
            relationship: b.querySelector('.npc-rel')?.value || '',
            image: b.querySelector('.preview-img')?.dataset.imageBase64 || null
        }));

        // --- Locations ---
        const locations = [...document.querySelectorAll('.location-block')].map(b => ({
            text: b.querySelector('.location-text')?.value || '',
            image: b.querySelector('.preview-img')?.dataset.imageBase64 || null
        }));

        // --- Treasures ---
        const treasures = [...document.querySelectorAll('.treasure-block')].map(b => ({
            platinum: parseInt(b.querySelector('.treasure-plat')?.value || '0'),
            gold: parseInt(b.querySelector('.treasure-gold')?.value || '0'),
            silver: parseInt(b.querySelector('.treasure-silver')?.value || '0'),
            copper: parseInt(b.querySelector('.treasure-copper')?.value || '0'),
            items: [...b.querySelectorAll('.treasure-item')].map(i => i.value).filter(Boolean),
            image: b.querySelector('.preview-img')?.dataset.imageBase64 || null
        }));

        // --- Plots ---
        const plots = [...document.querySelectorAll('.plot-block')].map(b => ({
            text: b.querySelector('.plot-text')?.value || '',
            image: b.querySelector('.preview-img')?.dataset.imageBase64 || null
        }));

        // --- Extras ---
        const extras = [...document.querySelectorAll('.extra-block')].map(b => ({
            text: b.querySelector('.extra-text')?.value || '',
            image: b.querySelector('.preview-img')?.dataset.imageBase64 || null
        }));

        // --- Header fields ---
        const noteTitle = document.getElementById('noteTitle')?.value || '';
        const gmName = document.getElementById('gmName')?.value || '';
        const playerName = document.getElementById('playerName')?.value || '';
        const characterName = document.getElementById('characterName')?.value || '';

        // --- Check for empty ---
        const hasData =
            npcs.length > 0 ||
            locations.length > 0 ||
            treasures.length > 0 ||
            plots.length > 0 ||
            extras.length > 0;

        if (!hasData) {
            showPopup("⚠️ You fool! Add something.");
            return;
        }

        // --- Build payload ---
        const payload = {
            role,
            date: dateString,
            title: noteTitle,
            gmName,
            playerName,
            characterName,
            npcs,
            locations,
            treasures,
            plots,
            extras
        };

        // --- Send to backend ---
        const res = await fetch('/Notes/ExportPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("PDF generation failed!");
            return;
        }

        // --- Download PDF ---
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dateString}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    }


    // -----------------------------
    // Expose public methods
    // -----------------------------
    return {
        addNpc,
        addLocation,
        addTreasure,
        addTreasureItem,
        addPlot,
        addExtra,
        makeItArcane,
        triggerImageUpload
    };
})();

window.App = App;
