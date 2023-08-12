
function initCv() {
    cvData = JSON.parse(localStorage.getItem('iitkgpCvData'));
    if(cvData){
        cv.innerHTML = cvData;
    }
}

initCv();

$('#saveCv').on('click', (event) => {
    cv.removeAttribute('contenteditable');
    var editMessageElement = document.getElementsByClassName('edit-message')[0];
    var greenTextElement = editMessageElement.querySelector('p');

    if (greenTextElement) {
        editMessageElement.removeChild(greenTextElement);
    }
    localStorage.setItem('iitkgpCvData', JSON.stringify(cv.innerHTML));
});

$('#resetCv').on('click', (event) => {
    if(confirm('Are you sure you want to reset your CV?')){
    localStorage.removeItem('iitkgpCvData');
    location.reload();
    }
});
