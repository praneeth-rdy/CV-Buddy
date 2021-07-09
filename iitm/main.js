
function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitmCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    localStorage.setItem('iitmCvData', JSON.stringify(cv.innerHTML));
});

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitmCvData');
    location.reload();
});