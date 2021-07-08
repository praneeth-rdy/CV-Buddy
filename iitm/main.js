
let cv = document.getElementById('cv');

function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitmCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitmCvData');
    location.reload();
});