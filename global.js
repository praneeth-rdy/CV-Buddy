

let cv = document.getElementById('cv');

$('#editCv').on('click', (event) => {
    cv.setAttribute('contenteditable', 'true');
});

$('#printCv').on('click', (event) => {
    cv.classList.add('cv-to-print');
    window.print();
    cv.classList.remove('cv-to-print');
});
