// Mobil cihaz kontrolü
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Mobil klavye işlevleri
function setupMobileKeyboard() {
    const keyboardBtn = document.getElementById('mobileKeyboardBtn');
    const keyboard = document.createElement('div');
    keyboard.className = 'mobile-keyboard';
    keyboard.innerHTML = `
        <div class="keyboard-display" id="keyboardDisplay"></div>
        <div class="keyboard-keys">
            <button class="keyboard-btn" data-key="1">1</button>
            <button class="keyboard-btn" data-key="2">2</button>
            <button class="keyboard-btn" data-key="3">3</button>
            <button class="keyboard-btn" data-key="4">4</button>
            <button class="keyboard-btn" data-key="5">5</button>
            <button class="keyboard-btn" data-key="6">6</button>
            <button class="keyboard-btn" data-key="7">7</button>
            <button class="keyboard-btn" data-key="8">8</button>
            <button class="keyboard-btn" data-key="9">9</button>
            <button class="keyboard-btn" data-key="0">0</button>
            <button class="keyboard-btn" id="keyboardBackspace">⌫</button>
            <button class="keyboard-btn" id="keyboardEnter">⏎</button>
        </div>
    `;
    
    document.body.appendChild(keyboard);
    const keyboardDisplay = document.getElementById('keyboardDisplay');
    let currentCode = '';
    
    // Klavye tuşlarına tıklama
    keyboard.addEventListener('click', (e) => {
        const key = e.target.closest('.keyboard-btn');
        if (!key) return;
        
        const keyValue = key.dataset.key;
        const keyId = key.id;
        
        if (keyValue) {
            // Sayı tuşları
            currentCode += keyValue;
            keyboardDisplay.textContent = '*'.repeat(currentCode.length);
            checkCode(currentCode);
        } else if (keyId === 'keyboardBackspace') {
            // Geri tuşu
            currentCode = currentCode.slice(0, -1);
            keyboardDisplay.textContent = '*'.repeat(currentCode.length);
        } else if (keyId === 'keyboardEnter') {
            // Enter tuşu
            currentCode = '';
            keyboardDisplay.textContent = '';
        }
    });
    
    // Klavye butonuna tıklama
    keyboardBtn.addEventListener('click', () => {
        keyboard.classList.toggle('visible');
    });
    
    // Dışarı tıklandığında kapat
    document.addEventListener('click', (e) => {
        if (!keyboard.contains(e.target) && e.target !== keyboardBtn) {
            keyboard.classList.remove('visible');
        }
    });
    
    // Kod kontrolü
    function checkCode(code) {
        if (code.endsWith(secretSequence)) {
            // Yönetici modunu aç/kapat
            const isAdmin = !toggleNotesBtn.classList.contains('visible');
            toggleNotesBtn.classList.toggle('visible', isAdmin);
            
            if (isAdmin) {
                notesList.style.display = 'block';
                document.body.classList.remove('hidden-notes');
                showMessage('Yönetici modu aktif!', 'success');
            } else {
                notesList.style.display = 'none';
                document.body.classList.add('hidden-notes');
                showMessage('Yönetici modu kapatıldı', 'success');
            }
            
            currentCode = '';
            keyboardDisplay.textContent = '';
            keyboard.classList.remove('visible');
        } else if (code.endsWith(imageSequence)) {
            // Gizli resmi göster
            secretModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            showMessage('Gizli resim açıldı!', 'success');
            
            currentCode = '';
            keyboardDisplay.textContent = '';
            keyboard.classList.remove('visible');
        }
    }
}

// Dokunmatik etkinlikleri yönet
function setupTouchEvents() {
    const catCards = document.querySelectorAll('.cat-card');
    
    catCards.forEach(card => {
        // Uzun basma olayını önle
        card.addEventListener('touchstart', function(e) {
            this.classList.add('active');
            e.preventDefault();
        }, { passive: false });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const catCards = document.querySelectorAll('.cat-card');
    const catSound = document.getElementById('catSound');
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const toggleNotesBtn = document.getElementById('toggleNotesBtn');
    const notesSection = document.querySelector('.notes-section');
    const secretModal = document.getElementById('secretModal');
    const closeModal = document.querySelector('.close-modal');
    
    let notes = JSON.parse(localStorage.getItem('catNotes')) || [];
    let secretCode = '';
    const secretSequence = '1337'; // Yönetici modu için gizli kod
    const imageSequence = '2468'; // Gizli resim için kod (istediğiniz gibi değiştirebilirsiniz)

    // Kedi kartlarına tıklama işlevi
    catCards.forEach(card => {
        card.addEventListener('click', function() {
            const soundFile = this.getAttribute('data-sound');
            catSound.src = `sounds/${soundFile}`;
            catSound.play();
            
            // Tıklama animasyonu
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Not ekleme formu
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userNote = document.getElementById('userNote').value.trim();
        
        if (userNote) {
            const newNote = {
                id: Date.now(),
                text: userNote,
                timestamp: new Date().toLocaleString('tr-TR')
            };
            
            notes.unshift(newNote); // En üste ekle
            saveNotes();
            renderNotes();
            noteForm.reset();
            
            // Başarılı mesajı
            showMessage('Notunuz eklendi!', 'success');
        }
    });
    
    // Notları kaydet
    function saveNotes() {
        localStorage.setItem('catNotes', JSON.stringify(notes));
        // Notları konsola da yazdır (sadece yönetici görebilir)
        console.log('Güncel notlar:', notes);
    }
    
    // Notları listele
    function renderNotes() {
        if (notes.length === 0) {
            notesList.innerHTML = '<p class="no-notes">Henüz not yok. İlk notu sen bırak! 😊</p>';
            return;
        }
        
        notesList.innerHTML = '<h4>📜 Notlar</h4>';
        
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.innerHTML = `
                <div class="note-text">${note.text}</div>
                <div class="note-time">${note.timestamp}</div>
            `;
            notesList.appendChild(noteElement);
        });
    }
    
    // Uyarı mesajı göster
    function showMessage(message, type = 'success') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 3000);
    }
    
    // Gizli kodu dinle
    document.addEventListener('keydown', (e) => {
        // Sadece sayısal tuşları dinle
        if (e.key >= '0' && e.key <= '9') {
            secretCode += e.key;
            
            // Yönetici modu için gizli kodu kontrol et
            if (secretCode.endsWith(secretSequence)) {
                // Yönetici modunu aç/kapat
                const isAdmin = !toggleNotesBtn.classList.contains('visible');
                toggleNotesBtn.classList.toggle('visible', isAdmin);
                secretCode = ''; // Kodu sıfırla
                
                // Not bölümünün görünürlüğünü ayarla
                if (isAdmin) {
                    notesList.style.display = 'block';
                    document.body.classList.remove('hidden-notes');
                    showMessage('Yönetici modu aktif!', 'success');
                } else {
                    notesList.style.display = 'none';
                    document.body.classList.add('hidden-notes');
                    showMessage('Yönetici modu kapatıldı', 'success');
                }
            } 
            // Gizli resim için kodu kontrol et
            else if (secretCode.endsWith(imageSequence)) {
                secretModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
                secretCode = ''; // Kodu sıfırla
                showMessage('Gizli resim açıldı!', 'success');
            }
            
            // Kodu uzun tutmamak için süreli sıfırlama
            setTimeout(() => {
                secretCode = '';
            }, 3000);
        }
    });
    
    // Gizli notlar butonuna tıklama
    toggleNotesBtn.addEventListener('click', () => {
        // Yönetici modunu aç/kapat
        const isAdmin = toggleNotesBtn.classList.toggle('visible');
        
        // Not bölümünün görünürlüğünü ayarla
        if (isAdmin) {
            notesList.style.display = 'block';
            document.body.classList.remove('hidden-notes');
        } else {
            notesList.style.display = 'none';
            document.body.classList.add('hidden-notes');
        }
        
        // Mesaj göster
        showMessage(
            isAdmin ? 'Yönetici modu aktif!' : 'Yönetici modu kapatıldı',
            'success'
        );
    });
    
    // Not başlığına tıklayınca sadece yönetici modunda çalışsın
    const notesTitle = document.querySelector('.notes-section h3');
    if (notesTitle) {
        notesTitle.addEventListener('click', () => {
            if (toggleNotesBtn.classList.contains('visible')) {
                notesList.style.display = notesList.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    // Sayfa yüklendiğinde notları yükle
    renderNotes();
    // Varsayılan olarak notları ve not bölümünü gizle
    document.body.classList.add('hidden-notes');
    // Yönetici modu kapalı başlasın
    toggleNotesBtn.classList.remove('visible');
    // Not listesini gizle
    notesList.style.display = 'none';
    
    // Modal kapatma işlevi
    function closeImageModal() {
        secretModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı tekrar etkinleştir
    }

    // Kapatma butonuna tıklama
    closeModal.addEventListener('click', closeImageModal);

    // ESC tuşuna basınca kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && secretModal.classList.contains('show')) {
            closeImageModal();
        }
    });

    // Modal dışına tıklayınca kapat
    secretModal.addEventListener('click', (e) => {
        if (e.target === secretModal) {
            closeImageModal();
        }
    });

    // Mobil etkinlikleri ayarla
    if (isMobile) {
        setupTouchEvents();
        setupMobileKeyboard();
        
        // Mobilde daha iyi dokunma deneyimi için
        document.body.classList.add('mobile-device');
    }
    
    // Konsola özel mesaj (sadece yönetici görür)
    console.log('%c🔍 Yönetici Paneli', 'color: #9f6bff; font-size: 16px; font-weight: bold;');
    console.log('Yönetici modu için: 1337');
    console.log('Gizli resim için: 2468');
    console.log('Tüm notlara erişmek için: localStorage.getItem(\'catNotes\')');
});
