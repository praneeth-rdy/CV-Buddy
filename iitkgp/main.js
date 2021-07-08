
let cv = document.getElementById('cv');

function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitkgpCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitkgpCvData');
    location.reload();
});