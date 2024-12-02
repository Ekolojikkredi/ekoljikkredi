import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, addDoc, getDocs, query, where } from './firebase.js';

function toggleMenu() {
    var menuContent = document.getElementById('menuContent');
    menuContent.style.display = (menuContent.style.display === 'block') ? 'none' : 'block';
}

function showSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function showVeriGoruntuleme() {
    var form = document.getElementById('veriGoruntulemeForm');
    form.style.display = 'block';
    document.querySelector('.left-info').style.display = 'none';
    document.querySelector('.right-info').style.display = 'none';
    showSection('veriGoruntuleme');
}

// İl ve ilçe verileri
const iller = {
    "Adana": ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak"],
    "İstanbul": ["Beşiktaş", "Kadıköy", "Üsküdar", "Şişli"],
    // Diğer iller ve ilçeler
};

// İller dropdown'u doldur
const ilSelect = document.getElementById('il');
const ilceSelect = document.getElementById('ilce');

Object.keys(iller).forEach(il => {
    const option = document.createElement('option');
    option.value = il;
    option.textContent = il;
    ilSelect.appendChild(option);
});

// İlçeler dropdown'unu doldur
ilSelect.addEventListener('change', function() {
    ilceSelect.innerHTML = '';
    const selectedIl = iller[ilSelect.value];
    selectedIl.forEach(ilce => {
        const option = document.createElement('option');
        option.value = ilce;
        option.textContent = ilce;
        ilceSelect.appendChild(option);
    });
});

// İlk il seçildiğinde ilçeleri göster
document.addEventListener('DOMContentLoaded', () => {
    if (ilSelect.value) {
        const selectedIl = iller[ilSelect.value];
        selectedIl.forEach(ilce => {
            const option = document.createElement('option');
            option.value = ilce;
            option.textContent = ilce;
            ilceSelect.appendChild(option);
        });
    }
});

// Kayıt Ol formunu işleme
document.getElementById('kayitForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('sifre');
    const userData = {
        il: formData.get('il'),
        ilce: formData.get('ilce'),
        okul: formData.get('okul'),
        okulNumarasi: formData.get('okulNumarasi'),
        isim: formData.get('isim'),
    };

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentialdocument.getElementById('veriGirisiForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    // Puan hesaplama
    let puan = 0;
    switch (data.atikTuru.toLowerCase()) {
        case 'kağıt':
            puan = data.atikKutlesi * 10;
            break;
        case 'plastik':
            puan = data.atikKutlesi * 15;
            break;
        case 'cam':
            puan = data.atikKutlesi * 20;
            break;
        case 'metal':
            puan = data.atikKutlesi * 25;
            break;
        case 'elektronik atıklar':
            puan = data.atikKutlesi * 50;
            break;
    }
    if (data.hataliAyrisim === 'evet') {
        puan -= 5;
    }
    data.puan = puan;

    // Kullanıcı verilerini güncelle
    try {
        const q = query(collection(db, 'users'), where('email', '==', data.email), where('okulNumarasi', '==', data.okulNumarasi));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            let userId = null;
            querySnapshot.forEach((doc) => {
                userId = doc.id;
                const userData = doc.data();
                userData.puan = (userData.puan || 0) + puan;

                // Kullanıcı verilerini güncelleyin
                await addDoc(collection(db, 'users'), {
                    ...userData
                });

                // Veri girişi kayıtlarını saklayın
                await addDoc(collection(db, 'teslimler'), data);
                alert('Veri girişi başarılı! Toplam puanınız: ' + userData.puan);
            });
        } else {
            alert('Kullanıcı verisi bulunamadı.');
        }
    } catch (error) {
        alert('Veri girişi hatası: ' + error.message);
    }

    event.target.reset();
});

// Hamburger menü işlevi
function toggleMenu() {
    const menuContent = document.getElementById('menuContent');
    menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
}

// Sayfalar arasında geçiş işlevi
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}
