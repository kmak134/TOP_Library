class Book {
    constructor(
        title = "none",
        author = "none",
        pages = 0,
        hasRead = false
    ) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.hasRead = hasRead;
    }

    info() {
        let hasReadText = "";
        if (hasRead) hasReadText = 'read';
        else hasReadText = 'not read yet';
        return `${title} by ${author}, ${pages} pages, ${hasReadText}`;
    }
}

class Library {
    constructor () {
        this.myLibrary = [];
    }

    addBookToLibrary(book) {
        this.myLibrary.push(book);
        updateLocalStorage();
    } 

    removeBookFromLibrary(title) {
        this.myLibrary = this.myLibrary.filter(b => b.title !== title);
        updateLocalStorage();
    }

    getBookIndexFromLibrary(title) {
        return this.myLibrary.findIndex(b => b.title === title);
    }
}

const library = new Library();

const overlay = document.querySelector(".form-overlay");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector("#close-button");
const addFormButton = document.querySelector("#add-form-toggle");
const addBookForm = document.querySelector("#add-book-form");

function addBookToLibrary(book) {
    library.addBookToLibrary(book);
}

function removeBook(key, title) {
    library.removeBookFromLibrary(title);
    let cardToRemove = document.querySelector(`#${key}`);
    cardToRemove.remove();
}

function createCardForGrid(key, book) {
    const cardGrid = document.querySelector(".cards-grid");
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    let idForCard = `card-${key}`;
    cardDiv.setAttribute("id", idForCard);
    
    const title = document.createElement("p");
    const author = document.createElement("p");
    const pages = document.createElement("p");
    const readButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    title.textContent = book.title;
    author.textContent = `by ${book.author}`;
    pages.textContent = `${book.pages} Pages`;
    if (book.hasRead) {
        readButton.textContent = "Read";
        readButton.classList.add('book-read');
    } else {
        readButton.textContent = "Not Read";
        readButton.classList.add('book-not-read');
    }
    deleteButton.textContent = "Delete";

    title.classList.add("card-title");
    author.classList.add("card-author");
    pages.classList.add("card-pages");


    readButton.classList.add("card-read-button");
    readButton.addEventListener('click', () => {
        bookIndex = library.getBookIndexFromLibrary(book.title);
        if (readButton.classList.contains('book-read')) {
            readButton.classList.remove('book-read');
            readButton.classList.add('book-not-read');
            readButton.textContent = "Not Read";
            library.myLibrary[bookIndex].hasRead = false;
        } else if (readButton.classList.contains('book-not-read')) {
            readButton.classList.remove('book-not-read');
            readButton.classList.add('book-read');
            readButton.textContent = "Read";
            library.myLibrary[bookIndex].hasRead = true;
        } else {
            console.log("Error");
        }
        updateLocalStorage();
    });

    deleteButton.classList.add("card-delete-button");
    deleteButton.addEventListener('click', () => {
        removeBook(idForCard, book.title);
    });

    cardDiv.appendChild(title);
    cardDiv.appendChild(author);
    cardDiv.appendChild(pages);
    cardDiv.appendChild(readButton);
    cardDiv.appendChild(deleteButton);
    cardGrid.appendChild(cardDiv);
}

function addBooksToGrid() {
    for (let [key, book] of library.myLibrary.entries()) {
        createCardForGrid(key, book);
    }
}

function closeModal() {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
}

function updateLocalStorage() {
    localStorage.setItem("library", JSON.stringify(library.myLibrary));
}

function retrieveLocalStorage() {
    let libraryFromLocal = JSON.parse(localStorage.getItem("library"))
    if (libraryFromLocal) {
        library.myLibrary = libraryFromLocal.map(book => convertJSONToBook(book));
    } else {
        library.myLibrary = [];
    }
}

function convertJSONToBook(book) {
    return new Book(book.title, book.author, book.pages, book.hasRead);
}

addFormButton.addEventListener('click', () => {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
})

closeButton.addEventListener('click', () => {
    closeModal();
});

overlay.addEventListener('click', () => {
    closeModal();
});

addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let title = document.querySelector("#book-title");
    let author = document.querySelector("#book-author");
    let pages = document.querySelector("#book-pages");
    let hasRead = document.querySelector("#book-have-read");
    let newBook = new Book(title.value, author.value, pages.value, hasRead.checked);
    let sizeOfLibrary = library.myLibrary.length;
    library.addBookToLibrary(newBook);
    createCardForGrid(sizeOfLibrary, newBook);
    closeModal();
    addBookForm.reset();
});

retrieveLocalStorage();
addBooksToGrid();


