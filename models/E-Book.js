var db = require.main.require('./config/conn');

var getAll = (callback) => {
    var sql = "SELECT * FROM e-books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM e-books WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var createEBook = (ebook, callback) => {
    var date = new Date();
    var sql = "INSERT INTO e-books VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [0, ebook.genre, ebook.title, ebook.author, ebook.publisher, ebook.edition, ebook.isbn, ebook.pages, ebook.file, date], function(result) {
        callback(result);
    });
};

var getEBook = (id, callback) => {
    var sql = "SELECT * FROM e-books WHERE e-book_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updateEBook = (id, ebook, callback) => {
    var sql = "UPDATE e-books SET genre = ?, title = ?, author = ?, publisher = ?, edition = ?, isbn = ?, pages = ?, file = ? WHERE e-book_id = ?";
    db.executeQuery(sql, [ebook.genre, ebook.title, ebook.author, ebook.publisher, ebook.edition, ebook.isbn, ebook.pages, ebook.file, id], function(result) {
        callback(result);
    });
};

var deleteEBook = (id, callback) => {
    var sql = "DELETE FROM e-books WHERE e-book_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var readEBook = (ebook_id, customer_id, callback) => {
    var date = new Date();
    var sql = "UPDATE e-books SET user_id = ?, date_readed = ? WHERE e-book_id = ?";
    db.executeQuery(sql, [customer_id, date, ebook_id], function(result) {
        callback(result);
    });
};

var unreadEBook = (ebook_id, callback) => {
    var sql = "UPDATE e-books SET user_id = '', date_readed = '' WHERE e-book_id = ?";
    db.executeQuery(sql, [ebook_id], function(result) {
        callback(result);
    });
};

var getReadEBooks = (id, callback) => {
    var sql = "SELECT * FROM e-books WHERE NOT user_id = ''";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var getUnborrowedEBooks = (callback) => {
    var sql = "SELECT * FROM e-books WHERE (user_id = 'NULL') OR (user_id = 0)";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var eBookRequest = (customer_id, ebook, callback) => {
    var date = new Date();
    var sql = "INSERT INTO books_request VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [customer_id, ebook.genre, ebook.title, ebook.author, ebook.edition, ebook.isbn, eBook.file, date], function(result) {
        callback(result);
    });
};

var customerSearch = (searchBy, word, callback) => {
    var sql = "(SELECT * FROM e-books WHERE "+searchBy+" = ?) AND ((user_id = '') OR (user_id = 0))";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var getRequestedEBooks = (callback) => {
    var sql = "SELECT * FROM e-books_request";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var eBookRequestSearch = (searchBy, word, callback) => {
    var sql = "SELECT * FROM e-books_request WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var setIssueDate = (ebook_id, customer_id, callback) => {
    var date = new Date();
    var sql = "INSERT INTO read_date VALUES(null, ?, ?, ?)";
    db.executeQuery(sql, [ebook_id, customer_id, date], function(result) {
        callback(result);
    });
};

var eBooksIssuedByCustomer = (customer_id, callback) => {
    var sql = "SELECT * FROM e-books WHERE user_id = ?";
    db.executeQuery(sql, [customer_id], function(result) {
        callback(result);
    });
};

var getAllBorrowedEBooks = (callback) => {
    var sql = "SELECT * FROM read_date";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var totalBorrowed30 = (callback) => {
    var result = new Date();
    var newDate = result.setDate(result.getDate() + 30);
    var sql = "SELECT e-books.*, read_date.e-book_id FROM read_date INNER JOIN e-books ON read_date.e-book_id=e-books.e-book_id WHERE (date BETWEEN ? AND ?)";
    db.executeQuery(sql, [newDate, result], function(result) {
        callback(result);
    });
};

var mostBorrowedEBook = (callback) => {
    var sql = "SELECT e-books.*, Read_date.e-book_id, COUNT(*) AS magnitude FROM read_date INNER JOIN e-books ON read_date.e-book_id=e-books.e-book_id GROUP BY e-books.isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

var mostRequestedEBook = (callback) => {
    var sql = "SELECT *, COUNT(*) AS magnitude FROM e-books_request GROUP BY isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

// SELECT e-books.*, read_date.e-book_id, COUNT(*) AS magnitude FROM read_date INNER JOIN e-books ON read_date.e-book_id=e-books.e-book_id WHERE (date BETWEEN '2019-07-10' AND '2019-08-10') GROUP BY e-books.isbn ORDER BY magnitude DESC LIMIT 1


module.exports = {
    getAll,
    searchBy,
    createEBook,
    getEBook,
    updateEBook,
    deleteEBook,
    readEBook,
    unreadEBook,
    getReadEBooks,
    getUnborrowedEBooks,
    eBookRequest,
    customerSearch,
    getRequestedEBooks,
    eBookRequestSearch,
    setIssueDate,
    eBooksIssuedByCustomer,
    getAllBorrowedEBooks,
    totalBorrowed30,
    mostRequestedEBook,
    mostBorrowedEBook
};
