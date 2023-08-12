

let cv = document.getElementById('cv');

$('#editCv').on('click', (event) => {
    if (cv.getAttribute('contenteditable') == 'false' || cv.getAttribute('contenteditable') == null) {
        if (document.getElementsByClassName('edit-message').length !== 0) {
            var editText = document.createTextNode('Edit Mode On');
            var greenText = document.createElement('p');
            greenText.appendChild(editText);

            // Set the color attribute to green
            greenText.setAttribute('style', 'color: green;');
            document.getElementsByClassName('edit-message')[0].appendChild(greenText);
        }        
        cv.setAttribute('contenteditable', 'true');
    }
});

$('#printCv').on('click', (event) => {
    cv.classList.add('cv-to-print');
    window.print();
    cv.classList.remove('cv-to-print');
});
