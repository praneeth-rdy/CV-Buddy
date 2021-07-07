let edu_items = 0;

function removeEdu(event) {
    event.preventDefault();
    const toRemove = event.target.getAttribute('data-remove');
    document.querySelector(toRemove).remove();
}

function addEdu(event) {
    event.preventDefault();
    edu_items++;
    const formRow = document.createElement('div');
    formRow.classList.add('form-row');
    formRow.setAttribute('id', `edu-row${edu_items}`);
    let formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'col-6', 'col-md-3');
    let input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `program${edu_items}`);
    input.setAttribute('placeholder', 'Program');
    formGroup.appendChild(input);
    formRow.appendChild(formGroup);

    formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'col-6', 'col-md-3');
    input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `insti${edu_items}`);
    input.setAttribute('placeholder', 'Institution');
    formGroup.appendChild(input);
    formRow.appendChild(formGroup);

    formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'col-5', 'col-md-2');
    input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `grade${edu_items}`);
    input.setAttribute('placeholder', 'Percentage or cgpa');
    formGroup.appendChild(input);
    formRow.appendChild(formGroup);

    formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'col-5', 'col-md-2');
    input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `year${edu_items}`);
    input.setAttribute('placeholder', 'Year');
    formGroup.appendChild(input);
    formRow.appendChild(formGroup);

    let btnDiv = document.createElement('div');
    btnDiv.classList.add('col-2', 'edu-action-container');
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-success');
    btn.setAttribute('id', 'add-edu');
    btn.textContent = 'Add';
    btn.addEventListener('click', addEdu);
    btnDiv.appendChild(btn);
    formRow.appendChild(btnDiv);

    document.getElementById('edu-section').appendChild(formRow);

    event.target.remove()

    btn = document.createElement('button');
    btn.classList.add('btn', 'btn-danger');
    btn.setAttribute('id', 'remove-edu');
    btn.setAttribute('data-remove', `#edu-row${edu_items - 1}`);
    btn.textContent = 'Remove';
    btn.addEventListener('click', removeEdu);
    document.getElementById(`edu-row${edu_items - 1}`).querySelector('.edu-action-container').appendChild(btn);
}

$('#add-edu').on('click', addEdu);