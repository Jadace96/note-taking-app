const noteBoxesContainer = document.querySelector('#noteBoxesContainer');
const sidebarNoteList = document.querySelector('#sidebarNoteList');

const changeDeleteButtonsDisableState = () => {
  const deleteNoteButton = document.querySelector('#deleteNoteButton');
  const deleteAllNotesButton = document.querySelector('#deleteAllNotesButton');

  const storedNotes = JSON.parse(localStorage.notes || '{}');
  const noteListLengt = Object.keys(storedNotes).length;

  deleteAllNotesButton.disabled = noteListLengt === 0;
  deleteNoteButton.disabled = !this.selectedNote;
};

function createElement({
  id = '',
  value = '',
  node = 'div',
  className = '',
  parentToAppendNode,
  onClick = () => {},
  onChange = () => {},
}) {
  const newElement = document.createElement(node);

  newElement.id = id;
  newElement.className = className;
  newElement.innerHTML = value;

  newElement.addEventListener('click', onClick);
  newElement.addEventListener('change', onChange);

  parentToAppendNode && parentToAppendNode.appendChild(newElement);

  return newElement;
}

function removeActiveClass(className) {
  const elementList = document.querySelectorAll(`.${className}`);
  elementList.forEach((element) => element.classList.remove('active'));
}

const onClickNote = ({ target }) => {
  const noteCard = document.getElementsByClassName(`new-note-box`)[target.id];
  const sidebarNote =
    document.getElementsByClassName(`sidebar-note`)[target.id];

  this.selectedNote = target;

  removeActiveClass('new-note-box');
  removeActiveClass('sidebar-note');

  sidebarNote.className += ' active';
  noteCard.className += ' active';
  changeDeleteButtonsDisableState();
};

const onDeleteNote = () => {
  const storedNotes = JSON.parse(localStorage.notes || '{}');
  delete storedNotes[this.selectedNote.id];
  localStorage.notes = JSON.stringify(storedNotes);
  location.reload();
};

function onDeleteAllNotes() {
  localStorage.removeItem('notes');
  location.reload();
}

function onCreateSidebarNote(noteCard, prevValue) {
  const elementParams = {
    node: 'li',
    id: noteCard.id,
    onClick: onClickNote,
    className: 'sidebar-note',
    value: prevValue || noteCard.value,
    parentToAppendNode: sidebarNoteList,
  };

  createElement(elementParams);
  changeDeleteButtonsDisableState();
}

function storeNotes(note) {
  const storedNotes = JSON.parse(localStorage.notes || '{}');
  const newNotes = { ...storedNotes, [note.id]: note };
  localStorage.notes = JSON.stringify(newNotes);
}

function onChangeNote() {
  const { id, value } = this;
  const storedNotes = JSON.parse(localStorage.notes || '{}');

  const selectedNote = document.getElementById(id);

  const sidebarNoteValue = `${value.substr(0, 40)}...
  <span class="last-update">Last update ${new Date().toLocaleString()}</span>`;
  selectedNote.innerHTML = sidebarNoteValue;

  storedNotes[id].value = value;
  storedNotes[id].sidebarNoteValue = sidebarNoteValue;

  localStorage.notes = JSON.stringify(storedNotes);
}

const onCreateNote = ({ event, storedElement } = {}) => {
  event?.preventDefault();
  const date = new Date();
  const defaultNoteElementData = {
    node: 'textarea',
    id: date.getTime(),
    className: `new-note-box ${date.getTime()}`,
    value: `New note - ${date.toLocaleString()}`,
  };

  const elementParams = storedElement || defaultNoteElementData;

  !storedElement && storeNotes(elementParams);

  elementParams.onClick = onClickNote;
  elementParams.onChange = onChangeNote;
  elementParams.parentToAppendNode = noteBoxesContainer;

  const newNoteBox = createElement(elementParams);

  onCreateSidebarNote(newNoteBox, elementParams.sidebarNoteValue);
};

function loadData() {
  const storedNotes = JSON.parse(localStorage?.notes || '{}');

  Object.values(storedNotes).forEach((storedElement) =>
    onCreateNote({ storedElement })
  );
}

loadData();
