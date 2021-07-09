
function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitbCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    localStorage.setItem('iitbCvData', JSON.stringify(cv.innerHTML));
});

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitbCvData');
    location.reload();
});