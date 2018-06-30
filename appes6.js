class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  constructor() {}

  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create A Table Row Element
    const row = document.createElement('tr');
    // Insert Columns To Table Row
    row.innerHTML = 
    `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }
  showAlert(message, className) {
    // Create Div Element
    const div = document.createElement('div');
    // Add Classes
    div.className = `alert ${className}`;
    // Add Text Node
    div.appendChild(document.createTextNode(message));
    // Get Parent
    const container = document.querySelector('.container');
    // Get Form
    const form = document.querySelector('#book-form');

    // Insert Alert
    container.insertBefore(div, form);
    // Clear Alert After 3 Seconds (Timeout)
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields(form) {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store { 
  constructor() {}

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    }
    else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();
    // Loop Through Book Items In Array
    books.forEach(book => {
      new UI().addBookToList(book);
    });
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event Listener For Loading Books To DOM
document.addEventListener('DOMContentLoaded', Store.displayBooks);
// Event Listener For Adding Book
document.getElementById('book-form').addEventListener('submit', (event) => {
  console.log('Test');
  // Declaring Scope Variables
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  
  // Instantiating Book
  const book = new Book(title, author, isbn);
  // Instantiating User Interface
  const ui = new UI();
  // Validate User Interface
  if(title === '' || author === '' || isbn === '') {
    // Error Alert
    ui.showAlert('Please Fill In All Fields', 'error');
  }
  else {
    // Adding UI Instance To Book List
    ui.addBookToList(book);
    // Add To Local Storage
    Store.addBook(book);
    // Show Alert
    ui.showAlert('Book Added Successfully', 'success')
    // Clear Input Fields
    ui.clearFields(); 
  }

  event.preventDefault();
});
// Event Listener For Delete
document.getElementById('book-list').addEventListener('click', (event) => {
  if (event.target) {
    // Instantiate The User Interface
    const ui = new UI();
    // Delete Book Function
    ui.deleteBook(event.target);
    // Remove From Local Storage
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    // Show An Alert
    ui.showAlert('Book Removed!', 'success');
  }
  event.preventDefault();
});