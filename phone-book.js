'use strict';

exports.isStar = false;

var phoneBook = [];

exports.add = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) ||
        (name === '') ||
        (name === undefined) ||
        (currentPhone.exec(phoneBook))) {

        return false;
    }
    phoneBook.push([phone, name, email]);

    return true;
};

exports.update = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) ||
        (name === '') ||
        (name === undefined)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (currentPhone.exec(phoneBook[i])) {
            phoneBook.splice(i, 1);
            phoneBook.splice(i, 0, [phone, name, email]);

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    if (query === '*') {
        phoneBook = [];

        return (phoneBook.length - 1);
    }
    else if (query === '') {

        return 0;
        }
    var s = 0;
    var foundRegExp = new RegExp(query);
    for (var i = phoneBook.length - 1; i >= 0; i--) {
        if ((foundRegExp.test((phoneBook[i])[0])) ||
        (foundRegExp.test((phoneBook[i])[1])) ||
        (foundRegExp.test((phoneBook[i])[2]))) {
            phoneBook.splice(i, 1);
            s++;
        }
    }

    return s;
};

exports.find = function (query) {
    if (query === '') {

        return null;
    }
    else if (query === '*') {

        return phoneBookToCustomView(phoneBook);
        }
    var foundRegExp = new RegExp(query);
    var arrayOfFounded = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if ((foundRegExp.test((phoneBook[i])[0])) ||
        (foundRegExp.test((phoneBook[i])[1])) ||
        (foundRegExp.test((phoneBook[i])[2]))) {
            arrayOfFounded.push(phoneBook[i]);
        }
    }

    return phoneBookToCustomView(arrayOfFounded);
};

function phoneBookToCustomView(book) {
    var bookWithCustomPhones = [];
    for (var i = 0; i < book.length; i++) {
        var splittedPhone = ((book[i])[0]).split('');
        var customPhone =
        '+7 (' +
        splittedPhone[0] +
        splittedPhone[1] +
        splittedPhone[2] +
        ') ' +
        splittedPhone[3] +
        splittedPhone[4] +
        splittedPhone[5] +
        '-' +
        splittedPhone[6] +
        splittedPhone[7] +
        '-' +
        splittedPhone[8] +
        splittedPhone[9];
        bookWithCustomPhones.push([(book[i])[1], customPhone, (book[i])[2]]);
    }
    var sortedBookWithCustomPhones = bookWithCustomPhones.sort();
    var customBook = [];
    for (var j = 0; j < sortedBookWithCustomPhones.length; j++) {
        customBook.push((sortedBookWithCustomPhones[j]).join(', '));
    }

    return customBook;
}

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
};
