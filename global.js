

let cv = document.getElementById('cv');

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
