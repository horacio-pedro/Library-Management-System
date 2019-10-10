var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/User');
var bookModel = require.main.require('./models/Book');
var eBookModel = require.main.require('./models/E-Book');
var validationRules = require.main.require('./config/validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/dashboard', (req, res)=> {
    // var users = "";
    userModel.getAll((users)=> {
        if(!users){
            res.send("Invalid");
        }
        else {
            bookModel.getAll((books)=> {
                if(!books){
                    res.send("Invalid");
                }
                else {
                    bookModel.getAllBorrowedBooks((borrowed)=> {
                        if(!borrowed){
                            res.send("invalid");
                        }
                        else {
                            bookModel.totalBorrowed30((mostBorrowed)=> {
                                if(!mostBorrowed){
                                    res.send("not valid");
                                }
                                else {
                                    bookModel.mostRequestedBook((mostRequested)=> {
                                        if(!mostRequested){
                                            res.render("nothing here");
                                        }
                                        else {
                                            bookModel.mostBorrowedBook((mostBorrowedBook)=> {
                                                if(!mostBorrowedBook){
                                                    res.send("no borrowed books");
                                                }
                                                else {
                                                    var admin = userModel.getUser(req.session.admin, (result)=> {
                                                        if(!result){
                                                            res.send("invalid!");
                                                        }
                                                        else {
                                                            console.log(result);
                                                            res.render('admin/dashboard', {usr: users.length, bk: books.length, brwd: borrowed.length, mb: mostBorrowed.length, mrb: mostRequested, mbb: mostBorrowedBook, log: result});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });


});

router.get('/profile', (req, res)=> {
    var admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('admin/profile', {res: result, log: result});
        }
    });
});

router.get('/profile/edit', (req, res)=> {
    var admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid");
        }
        else {
            console.log(result);
            res.render('admin/profile-edit', {res: result, log: result, errs: []});
        }
    });
});

router.post('/profile/edit', (req, res)=> {
    var rules = validationRules.users.update;
    var validator = new asyncValidator(rules);
    var data = {
      user_id: req.body.user_id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updateUser(data, (result)=> {
                if(!result){
                    res.send('invalid');
                }
                else {
                    res.redirect('/admin/profile');
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/profile-edit', {errs: errors, res: []});
        }
    });
});

router.get('/changepass', (req, res)=> {
    var admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('admin/change-password', {res: result, log: result, errs: [], success: []});
        }
    });
});

router.post('/changepass', (req, res)=> {
    var logName = req.session.admin;
    var rules = validationRules.users.changePassword;
    var validator = new asyncValidator(rules);
    var data = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    };

    if(req.body.password == req.body.oldPassword){
        validator.validate(data, (errors, fields)=> {
            if(!errors){
                if(req.body.newPassword == req.body.confirmPassword){
                    userModel.updatePassword(req.body.newPassword, req.body.user_id, (result)=> {
                        if(!result){
                            res.send('invalid');
                        }
                        else {
                            userModel.getUser(logName, (showLog) =>{
                                if(!showLog){
                                    res.send("DADOS INVÁLIDOS: Contacte o administrador");
                                }else{
                                    res.render('admin/change-password', {errs:[], log: showLog, res: [], success: [{message: "Palavra passe alterada com sucesso"}]});
                                }
                            });
                        }
                    });
                }
                else {
                    userModel.getUser(logName, (showLog) =>{
                        if(!showLog){
                            res.send("DADOS INVÁLIDOS: Contacte o administrador");
                        }else{
                            res.render('admin/change-password', {errs:[{message: "As novas palavras-passe não coincidem!"}], res: [], log: showLog, success: []});
                        }
                    });
                }
            }
            else {
                userModel.getUser(logName, (showLog) =>{
                    if(!showLog){
                        res.send("DADOS INVÁLIDOS: Contacte o administrador");
                    }else{
                        console.log(fields, showLog);
                        res.render('admin/change-password', {errs: errors, log: showLog, res: [], success: []});
                    }
                });
            }
        });
    }
    else {
        userModel.getUser(logName, (showLog) =>{
            if(!showLog){
                res.send("DADOS INVÁLIDOS: Contacte o administrador");
            }else{
                res.render('admin/change-password', {errs: [{message: "A actual palavra-passe está incorrecta!"}], log: showLog, res: [], success: []});
            }
        });
    }

});

router.get('/books', (req, res)=> {
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            userModel.getUser(req.session.admin, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/books', {res: result, log: showLog, errs: []});
                }
            });
        }
    });
});

router.post('/books', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    var logName = req.session.admin;
    bookModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books', {res: [], errs: [{message: "Nenhum resultado encontrado!"}]});
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/books', {res: result, log: showLog, errs: []});
                }
            });
        }
    });
});

router.get('/customers', (req, res)=> {
    var logName = req.session.admin;
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/customers', {res: result, log: showLog, errs: []});
                }
            });
        }
    });
});

router.post('/customers', (req, res)=> {
    var logName = req.session.admin;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    userModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/customers', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/customers', {res: result, log: showLog, errs: []});
                }
            });
        }
    });
});

router.get('/customers/add', (req, res)=> {
    var logName = req.session.admin;
    userModel.getUser(logName, (showLog) =>{
        if(!showLog){
            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
        }else{
            res.render('admin/customers-add', {errs: [], log: showLog, success: [], data: []});
        }
    });
});

router.post('/customers/add', (req, res)=> {
    var logName = req.session.admin;
    var data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender,
        nip: req.body.nip,
        patent: req.body.patent
    };

    var rules = validationRules.users.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.createUser(data, (result)=> {
                if(!result){
                    userModel.getUser(logName, (showLog) =>{
                        if(!showLog){
                            res.send("")
                        }else{
                            res.render('admin/customers-add', {log: showLog, errs: [{message: "Já existe um Utilizador com este NIP no sistema"}], data: []});
                        }
                    });
                }
                else {
                    userModel.getUser(logName, (showLog) =>{
                        if(!showLog){
                            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                        }else{
                            console.log(result, showLog);
                            res.render('admin/customers-add', {errs: [], log: showLog, success: [{message: "Utilizador Adicionado com sucesso!"}], data: []});
                        }
                    });
                }
            });
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(fields, showLog);
                    res.render('admin/customers-add', {errs: errors, log: showLog, success: [], data});
                }
            });
        }
    });
});

router.get('/books/add', (req, res)=> {
    var logName = req.session.admin;
    userModel.getUser(logName, (showLog) => {
        if(!showLog){
            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
        }else{
            console.log(showLog);
            res.render('admin/books-add', {log: showLog, errs: [], success: [], data: []});
        }
    });
});

router.post('/books/add', (req, res)=> {
    var logName = req.session.admin;
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        edition: req.body.edition,
        isbn: req.body.isbn,
        pages: req.body.pages
    };

    var rules = validationRules.books.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.createBook(data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    userModel.getUser(logName, (showLog) => {
                        if(!showLog){
                            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                        }else{
                            console.log(result, showLog);
                            res.render('admin/books-add', {errs: [], log: showLog, success: [{message: "Book added successfully!"}], data: []});
                        }
                    });
                }
            });
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(fields, logName);
                    res.render('admin/books-add', {errs: errors, log: showLog, success: [], data});
                }
            });
        }
    });
});

router.get('/books/edit/:id', (req, res)=> {
    var logName = req.session.admin;
    var book = req.params.id;
    bookModel.getBook(book, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(logName);
                    res.render('admin/books-edit', {res: result, log: showLog, errs: [], success: []});
                }
            });
        }
    });
});

router.post('/books/edit/:id', (req, res)=> {
    var logName = req.session.admin;
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        edition: req.body.edition,
        isbn: req.body.isbn,
        pages: req.body.pages
    };
    var book_id = req.body.book_id;

    var rules = validationRules.books.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.updateBook(book_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    userModel.getUser(logName, (showLog) => {
                        if(!showLog){
                            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                        }else{
                            console.log(result, showLog);
                            res.render('admin/books-edit', {res: result, log: showLog, errs:[], success: [{message: "Book updated successfully!"}]});
                        }
                    });
                }
            });
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(fields, showLog);
                    res.render('admin/books-edit', {res: data, log: showLog, errs: errors, success: []})
                }
            });
        }
    });

});

router.get('/customers/edit/:id', (req, res)=> {
    var logName = req.session.admin;
    var customer = req.params.id;
    userModel.getUser(customer, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(showLog);
                    res.render('admin/customers-edit', {res: result, log: showLog, errs: [], success: []});
                }
            });
        }
    });
});

router.post('/customers/edit/:id', (req, res)=> {
    var logName = req.session.admin;
    var data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender
    };
    var customer_id = req.body.user_id;

    var rules = validationRules.users.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updateCustomer(customer_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    userModel.getUser(logName, (showLog) => {
                        if(!showLog){
                            res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                        }else{
                            console.log(result, showLog);
                            res.render('admin/customers-edit', {res: result, log: showLog, errs:[], success: [{message: "Customer updated successfully!"}]});
                        }
                    });
                }
            });
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(fields, showLog);
                    res.render('admin/customers-edit', {res: data, log: showLog, errs: errors, success: []});
                }
            });
        }
    });

});

router.get('/customers/profile/:id', (req, res)=> {
    var logName = req.session.admin;
    var id = req.params.id;
    var customer = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/customers-profile', {res: result, log: showLog});
                }
            });
        }
    });
});

router.get('/customers/delete/:id', (req, res)=> {
    var logName = req.session.admin;
    var id = req.params.id;
    var customer = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/customers-delete', {res: result, log: showLog});
                }
            });
        }
    });
});

router.post('/customers/delete/:id', (req, res)=> {
    var logName = req.session.admin;
    var id = req.body.user_id;
    var customer = userModel.deleteUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!");
                }else{
                    console.log(result, showLog);
                    res.redirect('/admin/customers', {log: showLog});
                }
            });
        }
    });
});

router.get('/books/delete/:id', (req, res)=> {
    var logName = req.session.admin;
    var id = req.params.id;
    var book = bookModel.getBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!");
                }else{
                    console.log(result, showLog);
                    res.render('admin/books-delete', {res: result, log: showLog});
                }
            })
        }
    });
});

router.post('/books/delete/:id', (req, res)=> {
    var logName = req.session.admin;
    var id = req.body.book_id;
    var book = bookModel.deleteBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                }else{
                    console.log(result, showLog);
                    res.redirect('/admin/books', {log: showLog});
                }
            })
        }
    });
});

router.get('/books/:id/issue', (req, res)=> {
    var logName = req.session.admin;
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) => {
                if(!showLog){
                    res.send("huuhhuioio")
                }else{
                    console.log(result, showLog);
                    res.render('admin/books-issue', {res: result, log: showLog, errs: [], success: []});
                }
            })
        }
    });
});

router.post('/books/:id/issue', (req, res)=> {
    var logName = req.session.admin;
    var book_id = req.params.id;
    var customer_id = req.body.user_id;

    bookModel.booksIssuedByCustomer(customer_id, (books)=> {
        if(!books){
            res.send("Invalid");
        }
        else {
            console.log(books.length);
            if(books.length <= 2){
                bookModel.setIssueDate(book_id, customer_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        userModel.getUser(logName, (showLog) => {
                            if(!showLog){
                                res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                            }else{
                                console.log(result, showLog);
                            }
                        });
                    }
                });
                bookModel.issueBook(book_id, customer_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        userModel.getUser(logName, (showLog) => {
                            if(!showLog){
                                res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!");
                            }else{
                                console.log(result, showLog);
                                res.redirect('/admin/books', {log: showLog});
                            }
                        });
                    }
                });
            }
            else{
                userModel.getAll((result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        userModel.getUser(logName, (showLog) => {
                            if(!showLog){
                                res.send("DADOS INVÁLIDOS: Contacte o Administrador do sistema!")
                            }else{
                                console.log(result, showLog);
                                res.render('admin/books-issue', {res: result, log: showLog, errs: [{message: "This customer has already issued 3 books, please unissue one first!"}], success: []});
                            }
                        })
                    }
                });
            }
        }
    });
});

router.get('/books/issued', (req, res)=> {
    var logName = req.session.admin;
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid!");
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sitema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/issued-books', {res: result, log: showLog});
                }
            })
        }
    });
});

router.post('/books/issued', (req, res)=> {
    var logName = req.session.admin;
    var book_id = req.body.book_id;
    bookModel.unissueBook(book_id, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sitema!")
                }else{
                    console.log(result, showLog);
                    res.redirect('/admin/books', {log: showLog});
                }
            })
        }
    });
});

router.get('/books/requested', (req, res)=> {
    var logName = req.session.admin;
    bookModel.getRequestedBooks((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sitema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/books-requested', {res: result, log: showLog, errs: []});
                }
            })
        }
    });
});

router.post('/books/requested', (req, res)=> {
    var logName = req.session.admin;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    bookModel.bookRequestSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books-requested', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            userModel.getUser(logName, (showLog) =>{
                if(!showLog){
                    res.send("DADOS INVÁLIDOS: Contacte o Administrador do sitema!")
                }else{
                    console.log(result, showLog);
                    res.render('admin/books-requested', {res: result, log: showLog, errs: []});
                }
            })
        }
    });
});



module.exports = router;
