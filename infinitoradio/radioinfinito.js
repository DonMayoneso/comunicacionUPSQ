document.addEventListener('DOMContentLoaded', () => {
    console.log("Infinito Radio: Iniciando sistemas de Consola y BDD...");
    
    /* ========================================================
       1. CONSOLA ANALÓGICA: VISIBILIDAD MÓVIL Y ANIMACIÓN
       ======================================================== */
    const controlRow = document.querySelector('.master-control-row');
    const channelRack = document.querySelector('.channel-rack');
    const combinedRack = document.querySelector('.combined-rack');
    const dbMeterRack = document.querySelector('.db-meter-rack');
    
    const spectrumContainer = document.getElementById('spectrumAnalyzer');
    const dbNeedleL = document.getElementById('dbNeedleL');
    const dbNeedleR = document.getElementById('dbNeedleR');
    const dbNeedleMid = document.getElementById('dbNeedleMid');
    const dbNeedlePeak = document.getElementById('dbNeedlePeak');
    
    const numBars = 16;
    const bars = [];

    function handleMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            if (channelRack) channelRack.style.display = 'none';
            if (combinedRack) combinedRack.style.display = 'none';
            if (dbMeterRack) dbMeterRack.style.display = 'none';
            if (controlRow) { controlRow.style.gridTemplateColumns = '1fr'; controlRow.style.gap = '15px'; }
        } else {
            if (channelRack) channelRack.style.display = 'flex';
            if (combinedRack) combinedRack.style.display = 'flex';
            if (dbMeterRack) dbMeterRack.style.display = 'flex';
            if (controlRow) { controlRow.style.gridTemplateColumns = 'minmax(200px, 1fr) minmax(250px, 1.2fr) minmax(320px, 1.5fr) minmax(220px, 1fr)'; controlRow.style.gap = '20px'; }
        }
    }
    window.addEventListener('resize', handleMobileLayout);
    handleMobileLayout();

    if (spectrumContainer) {
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('spec-bar');
            spectrumContainer.appendChild(bar);
            bars.push(bar);
        }

        let time = 0;
        function animateStudioHardware() {
            time += 0.15;
            let totalVolume = 0; 
            
            bars.forEach((bar, index) => {
                let noise = Math.random() * 20; 
                let wave = Math.sin(time + index) * 30; 
                let bassBoost = (index < 4) ? Math.random() * 40 : 0; 
                let heightValue = Math.max(5, Math.abs(wave + noise + bassBoost));
                heightValue = Math.min(heightValue, 55); 
                totalVolume += heightValue;
                bar.style.height = `${heightValue}px`;
                bar.classList.remove('peak', 'mid');
                if (heightValue > 45) bar.classList.add('peak'); 
                else if (heightValue > 25) bar.classList.add('mid'); 
            });

            if (window.innerWidth > 768) {
                if (dbNeedleL && dbNeedleR) {
                    let avgVolume = totalVolume / numBars; 
                    let angleBase = -45 + (avgVolume * 2.5); 
                    let angleL = Math.min(45, Math.max(-45, angleBase + (Math.random() * 8)));
                    let angleR = Math.min(45, Math.max(-45, angleBase + (Math.random() * 8)));
                    dbNeedleL.style.transform = `translateX(-50%) rotate(${angleL}deg)`;
                    dbNeedleR.style.transform = `translateX(-50%) rotate(${angleR}deg)`;
                }

                if (dbNeedleMid && dbNeedlePeak && bars.length === numBars) {
                    let midVolume = (bars[6].clientHeight + bars[7].clientHeight + bars[8].clientHeight) / 3 || 20;
                    let angleMid = -15 + (midVolume * 0.8) + (Math.random() * 10 - 5);
                    dbNeedleMid.style.transform = `translateX(-50%) rotate(${Math.min(25, Math.max(-25, angleMid))}deg)`;

                    let peakVolume = Math.max(bars[0].clientHeight, bars[1].clientHeight, bars[2].clientHeight) || 20;
                    let anglePeak = 10 + (peakVolume * 0.6) + (Math.random() * 8); 
                    dbNeedlePeak.style.transform = `translateX(-50%) rotate(${Math.min(45, Math.max(0, anglePeak))}deg)`;
                }
            }
            setTimeout(() => { requestAnimationFrame(animateStudioHardware); }, 50); 
        }
        animateStudioHardware();
    }

    /* ========================================================
       2. BDD PROGRAMAS: FETCH DIRECTO A GOOGLE
       ======================================================== */
       
    // URL con los permisos correctos
    const GOOGLE_API_URL = 'https://script.google.com/macros/s/AKfycbzj58UoeuSrSJv8PS33z3dJR4RS17gV7EQ_GZLKNj0_F6_tEVqlCzIinMQiEaKAheZv/exec';
    
    const CACHE_KEY = 'radio_programs_cache';
    const CACHE_TIME_KEY = 'radio_programs_time';
    const CACHE_DURATION = 10 * 60 * 1000; 
    
    const gridContainer = document.getElementById('programsGrid');
    const modal = document.getElementById('programModal');
    const closeBtn = document.getElementById('closeModalBtn');
    let programsData = [];

    async function loadPrograms() {
        if (!gridContainer) return;

        // Vaciamos caché si estamos en localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIME_KEY);
        }
        
        const now = Date.now();
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData && cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION)) {
            programsData = JSON.parse(cachedData);
            if (programsData.length === 0) {
                gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; font-family: monospace;">[ No hay programas en la parrilla actualmente ]</div>';
            } else {
                renderGrid(programsData);
            }
            return; 
        }

        gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; font-family: monospace; padding: 40px;">SINTONIZANDO FRECUENCIAS... <i class="fas fa-circle-notch fa-spin"></i></div>';

        try {
            // Conexión limpia, directa y con redirección seguida explícitamente
            const response = await fetch(GOOGLE_API_URL, { redirect: "follow" });
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const textData = await response.text();

            // DETECTOR DE PANTALLA DE LOGIN (HTML)
            if (textData.trim().startsWith('<')) {
                throw new Error("Google bloqueó el acceso y devolvió una página web HTML en lugar de los datos.");
            }

            const rawData = JSON.parse(textData);
            
            programsData = rawData.filter(prog => prog.id && String(prog.id).trim() !== '');

            localStorage.setItem(CACHE_KEY, JSON.stringify(programsData));
            localStorage.setItem(CACHE_TIME_KEY, now.toString());

            if (programsData.length === 0) {
                gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; font-family: monospace;">[ No hay programas en la parrilla actualmente ]</div>';
                return;
            }

            renderGrid(programsData);
        } catch (error) {
            console.error("Error final de conexión:", error);
            if (cachedData) {
                programsData = JSON.parse(cachedData);
                renderGrid(programsData);
            } else {
                gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ff3333; font-family: monospace;">[ ERROR DE CONEXIÓN ]<br><span style="font-size: 0.8rem; color:#888;">${error.message}</span></div>`;
            }
        }
    }

    function renderGrid(data) {
        gridContainer.innerHTML = data.map(prog => `
            <div class="program-card" onclick="openProgramModal(${prog.id})">
                <img src="${prog.imagen || '../assets/upscomunicacionlogo.png'}" alt="${prog.titulo}" onerror="this.src='../assets/upscomunicacionlogo.png'">
                <div class="program-card-title">${prog.titulo || 'Sin Título'}</div>
            </div>
        `).join('');
    }

    function updateModalField(containerId, textId, value, displayType = 'block') {
        const container = document.getElementById(containerId);
        const textElement = document.getElementById(textId);
        if (value && String(value).trim() !== '') {
            textElement.textContent = value;
            container.style.display = displayType; 
        } else {
            container.style.display = 'none'; 
        }
    }

    window.openProgramModal = function(id) {
        const prog = programsData.find(p => parseInt(p.id) === id);
        if(!prog) return;

        // Cargar imagen en el vinilo del modal
        document.getElementById('modalImg').src = prog.imagen || '../assets/upscomunicacionlogo.png';
        
        // ==========================================
        // LÓGICA DE COLOR DE VINILO DINÁMICO
        // ==========================================
        const vinylCenter = document.getElementById('modalVinylCenter');
        if (vinylCenter) { // Nos aseguramos de que el elemento exista en el DOM
            if (prog.colorvinilo && String(prog.colorvinilo).trim() !== '') {
                vinylCenter.style.backgroundColor = prog.colorvinilo;
            } else {
                vinylCenter.style.backgroundColor = '#93c01f'; // Color institucional por defecto
            }
        }

        // Cargar resto de la información
        document.getElementById('modalTitle').textContent = prog.titulo || 'Programa';

        updateModalField('modalPresenterContainer', 'modalPresenter', prog.presentador, 'block');
        updateModalField('modalDirectorContainer', 'modalDirector', prog.direccion, 'block');
        updateModalField('modalCollabsContainer', 'modalCollabs', prog.colaboradores, 'block');
        updateModalField('modalDescContainer', 'modalDesc', prog.descripcion, 'block');

        const linkContainer = document.getElementById('modalLinkContainer');
        const customLink = document.getElementById('modalCustomLink');
        const linkText = document.getElementById('modalLinkText');

        if (prog.link_texto && prog.link_url && String(prog.link_texto).trim() !== '' && String(prog.link_url).trim() !== '') {
            linkText.textContent = prog.link_texto;
            customLink.href = prog.link_url;
            linkContainer.style.display = 'block';
        } else {
            linkContainer.style.display = 'none';
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    };

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300); 
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    loadPrograms();
});