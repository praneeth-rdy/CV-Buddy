
let cv = document.getElementById('cv');

function initCv() {
    cvData = JSON.parse(localStorage.getItem('clgnameCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('clgnameCvData');
    location.reload();
});