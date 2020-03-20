class App {

    constructor() {

        this.$form = document.querySelector('#form');
        this.$formButtons = document.querySelector('#form-buttons');
        this.$notes = document.querySelector('#notes');
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector('#note-text');
        this.$placeholder = document.querySelector('#placeholder');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$modal = document.querySelector('.modal');
        this.$modalTitle = document.querySelector(".modal-title");
        this.$modalText = document.querySelector(".modal-text");
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorTooltip = document.querySelector('#color-tooltip');

        this.title = '';
        this.text = '';
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.id = ''

        this.displayNote();
        this.addEventListeners();
    }

    addEventListeners() {

        document.body.addEventListener('click', (event) => {
            //console.log('Click!');
            this.handleFormClick(event);
            this.deleteNote(event);
            this.selectNote(event);

        });

        this.$form.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            if (hasNote) {
                this.addNote({ title, text });
            }
            this.closeForm();
        });

        this.$formCloseButton.addEventListener('click', event => {
            event.stopPropagation();
            this.closeForm();
        }
        );

        this.$modalCloseButton.addEventListener('click', event => {
            console.log('Closing')
            this.closeModal();
        });

        document.body.addEventListener('mouseover', (event) => {
            this.openTooltip(event);
        });

        document.body.addEventListener('mouseout', (event) => {
            this.closeTooltip(event);
            console.log("Closing tooltip")
        });

        this.$colorTooltip.addEventListener('mouseover', (event) => {
            event.stopPropagation();
            this.$colorTooltip.style.display = 'flex';
            console.log("Keping it open");
        });

        this.$colorTooltip.addEventListener('mouseout', (event) => {
            event.stopPropagation();
            this.$colorTooltip.style.display = 'none';
        });

        this.$colorTooltip.addEventListener('click', (event) => {
            let color = event.target.dataset.color;
            if (color)
                this.changeNoteColor(color);
        });


    }

    handleNoteClick(event) {
        const isNoteClicked = event.target.closest('.note') || false;

    }

    handleFormClick(event) {
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;

        const isFormClicked = this.$form.contains(event.target);
        if (isFormClicked) {
            this.openForm();
        }
        else if (hasNote) {

            this.addNote({ title, text });
            this.closeForm();
        }
        else {
            this.closeForm();
        }

    }

    openModal(event) {
        console.log(`Open Modal+ ${event.target}`);
        if (event.target.matches('.toolbar-delete')) {
            console.log('No open modal');
            return
        }
        const $selectedNote = event.target.closest('.note');
        this.$modal.classList.toggle('open-modal');
        this.$modalTitle.value = this.title;
        this.$modalText.value = this.text;
    }

    closeModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    editNote(event) {
        let editedNotes = this.notes.map(note => {
            if (note.id === Number(this.id)) {
                console.log('Match', this.$modalTitle.value, this.$modalText.value);
                note.title = this.$modalTitle.value;
                note.text = this.$modalText.value;
                console.log(note);
                return note;
            }
            else
                return note;
        });
        console.log(editedNotes);
        this.notes = editedNotes;
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.displayNote();

    }

    deleteNote(event) {
        event.stopPropagation();
        if (!event.target.matches('.toolbar-delete'))
            return
        console.log('Deleting')

        this.id = Number(event.target.dataset.id);
        this.notes = this.notes.filter(note => note.id !== this.id);
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.displayNote();

    }

    changeNoteColor(color) {
        this.notes = this.notes.map(note => {
            return note.id === this.id ? { ...note, color } : note
            // if (note.id === this.id) {
            //     note.color = color;
            //     return note;
            // }
            // else
            //     return note;

        });
        localStorage.setItem('notes', JSON.stringify(this.notes));
        console.log(this.notes);
        this.displayNote();
        console.log('Color Changed ');
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if (!$selectedNote) {
            return
        }
        else {
            console.log('Note Clicked')
            let [title, text] = $selectedNote.children;
            this.title = title.innerText;
            this.text = text.innerText;
            this.id = $selectedNote.dataset.id;
            this.openModal(event);
        }
    }

    openForm() {
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    addNote({ title, text }) {
        const newNote = {
            title,
            text,
            id: this.notes.length ? this.notes[this.notes.length - 1].id + 1 : 1,
            color: 'white'
        }
        this.notes = [...this.notes, newNote];
        localStorage.setItem('notes', JSON.stringify(this.notes));
        console.log(this.notes);
        this.displayNote();
    }

    openTooltip(event) {
        if (!event.target.matches('.toolbar-color'))
            return
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = noteCoords.top + window.scrollY;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical + 20}px)`;
        this.$colorTooltip.style.display = 'flex';
        this.id = Number(event.target.dataset.id);
    }

    closeTooltip(event) {
        if (!event.target.matches('.toolbar-color'))
            return
        this.$colorTooltip.style.display = 'none';
    }

    displayNote() {

        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
            <div class = "${note.title && 'note-title'}"> ${note.title} </div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
                <div class="toolbar">
                    <img class="toolbar-color" src="https://icon.now.sh/palette" data-id='${note.id}'>
                    <img class="toolbar-delete" src="https://icon.now.sh/delete" data-id='${note.id}'>
                </div>    
            </div>
        </div>        
        `).join("");
    }


}

new App();