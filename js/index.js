const content = document.getElementById("content");
const noteListContainer = document.getElementById("noteListContainer");

const shouldDisableDeleteButtons = () => {
  const deleteNoteButton = document.getElementById("deleteNoteButton");
  const deleteAllButton = document.getElementById("deleteAllButton");

  const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};
  const lengthNoteList = Object.keys(storedNotes).length;

  deleteAllButton.disabled = lengthNoteList === 0;
  deleteNoteButton.disabled = !this.selectedNote;
};

function createNode({
  id = "",
  onClick,
  onChange,
  node = "div",
  className = "",
  value = "",
  parentToAppendNode
}) {
  const newNode = document.createElement(node);

  newNode.id = id;
  newNode.className = className;
  newNode.innerHTML = value;

  onClick && newNode.addEventListener("click", onClick);
  onChange && newNode.addEventListener("change", onChange);

  parentToAppendNode && parentToAppendNode.appendChild(newNode);

  return newNode;
}

function removeActiveClass(className) {
  const nodeList = document.querySelectorAll(`.${className}`);
  nodeList.forEach(node => node.classList.remove("active"));
}

const onClickNote = ({ target }) => {
  const noteCard = document.getElementsByClassName(`new-note`)[target.id];
  const sidebarNote = document.getElementsByClassName(`sidebar-note`)[
    target.id
  ];

  this.selectedNote = target;

  removeActiveClass("new-note");
  removeActiveClass("sidebar-note");

  sidebarNote.className += " active";
  noteCard.className += " active";
  shouldDisableDeleteButtons();
};

const onDeleteNote = () => {
  const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};
  delete storedNotes[this.selectedNote.id];
  localStorage.setItem("notes", JSON.stringify(storedNotes));
  location.reload();
};

function onDeleteAllNotes() {
  localStorage.removeItem("notes");
  location.reload();
}

function onCreateSidebarNote(noteCard, prevValue) {
  const nodeParams = {
    node: "li",
    id: noteCard.id,
    onClick: onClickNote,
    className: "sidebar-note",
    value: prevValue || noteCard.value,
    parentToAppendNode: noteListContainer
  };

  createNode(nodeParams);
  shouldDisableDeleteButtons();
}

function storeNotes(note) {
  const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};
  const newNotes = { ...storedNotes, [note.id]: note };
  localStorage.setItem("notes", JSON.stringify(newNotes));
}

function onChangeNote() {
  const { id, value } = this;
  const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};

  const selectedNote = document.getElementById(id);

  const sidebarNoteValue = `${value.substr(0, 40)}
  <span class="last-update">Last update ${new Date().toLocaleString()}</span>`;
  selectedNote.innerHTML = sidebarNoteValue;

  storedNotes[id].value = value;
  storedNotes[id].sidebarNoteValue = sidebarNoteValue;

  localStorage.setItem("notes", JSON.stringify(storedNotes));
}

const onCreateNote = ({ event, storedElement } = {}) => {
  event && event.preventDefault();
  const elementId = new Date();

  const nodeParams = storedElement || {
    node: "textarea",
    id: elementId.getTime(),
    className: `new-note ${elementId.getTime()}`,
    value: `Last update ${elementId.toLocaleString()}`
  };

  !storedElement && storeNotes(nodeParams);

  nodeParams.onClick = onClickNote;
  nodeParams.onChange = onChangeNote;
  nodeParams.parentToAppendNode = content;

  const newNoteCard = createNode(nodeParams);

  onCreateSidebarNote(newNoteCard, nodeParams.sidebarNoteValue);
};

function loadData() {
  const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};
  if (storedNotes) {
    Object.values(storedNotes).forEach(storedElement =>
      onCreateNote({ storedElement })
    );
  }
}

loadData();
