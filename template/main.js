
function initCv() {
    cvData = JSON.parse(localStorage.getItem('clgnameCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    localStorage.setItem('clgnameCvData', JSON.stringify(cv.innerHTML));
});

$('#resetCv').on('click', (event) => {
    localStorage.removeItem('clgnameCvData');
    location.reload();
});