

let cv = document.getElementById('iitm-cv');

function initCv() {
    cvData = JSON.parse(localStorage.getItem('cvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#editCv').on('click', (event) => {
    cv.setAttribute('contenteditable', 'true');
});

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    localStorage.setItem('cvData', JSON.stringify(cv.innerHTML));
});

$('#printCv').on('click', (event) => {
    cv.classList.add('cv-to-print');
    window.print();
    cv.classList.remove('cv-to-print');
});

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('cvData');
    location.reload();
});