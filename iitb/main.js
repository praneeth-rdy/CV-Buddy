
let cv = document.getElementById('cv');

function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitbCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitbCvData');
    location.reload();
});