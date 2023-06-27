
function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitkgpCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    localStorage.setItem('iitkgpCvData', JSON.stringify(cv.innerHTML));
});

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('iitkgpCvData');
    location.reload();
});
