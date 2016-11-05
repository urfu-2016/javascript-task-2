'use strict';

exports.isStar = false;

var phoneBook = [];

var i;

function isNotEmptyString(arg) {
    if (arg !== '') {

        return true;
    }

    return false;
}

function isNotUndefined(arg) {
    if (arg !== undefined) {

        return true;
    }

    return false;
}

function isInPhoneBook(phone) {
    var _phone = new RegExp(phone);
    if (_phone.exec(phoneBook)) {

        return true;
    }

    return false;
}

function isCorrectPhone(phone) {
    var _phone = /^\d{10}$/;
    if (_phone.test(phone)) {

        return true;
    }

    return false;
}

function canBeAdded(phone, name) {
    if (isNotEmptyString(name) && isNotUndefined(name) &&
        isCorrectPhone(phone) && !isInPhoneBook(phone)) {

        return true;
    }

    return false;
}

exports.add = function (phone, name, email) {
    if (canBeAdded(phone, name)) {
        phoneBook.push([phone, name, email]);

        return true;
    }

    return false;
};

function updateSpeciousColumnByPhone(phone, index, data) {
    for (i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i][0]) {
            phoneBook[i][index] = data;
        }
    }
}

function updatePhoneBook(phone, name, email) {
    if (isNotEmptyString(name) && isNotUndefined(name)) {
        updateSpeciousColumnByPhone(phone, 1, name);
    }
    updateSpeciousColumnByPhone(phone, 2, email);
}

exports.update = function (phone, name, email) {
    if (isCorrectPhone(phone) && isInPhoneBook(phone)) {
        updatePhoneBook(phone, name, email);

        return true;
    }

    return false;
};

function findQueryInPhoneBook(query) {
    if (query === '*') {

        return phoneBook;
    }
    if (query === '') {

        return null;
    }
    var _query = new RegExp(query);
    var foundByQuery = [];
    for (i = 0; i < phoneBook.length; i++) {
        if (_query.exec(phoneBook[i])) {
            foundByQuery.push(phoneBook[i]);
        }
    }

    return foundByQuery;
}

function removeUselessContact(uselessContact) {
    var _uselessContact = new RegExp(uselessContact);
    for (i = 0; i < phoneBook.length; i++) {
        if (_uselessContact.exec(phoneBook[i])) {
            phoneBook.splice(i, 1);
        }
    }
}

function removeAllUselessContacts(uselessContacts) {
    for (i = 0; i < uselessContacts.length; i++) {
        removeUselessContact(uselessContacts[i]);
    }
}

exports.findAndRemove = function (query) {
    var uselessContacts = findQueryInPhoneBook(query);
    if (findQueryInPhoneBook(query) === null) {

        return 0;
    }
    removeAllUselessContacts(uselessContacts);

    return uselessContacts.length;
};

function phoneToCorrectView(phone) {
    var splittedPhone = phone.split('');
    var correctPhone =
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

    return correctPhone;
}

function bookToCorrectView(book) {
    var bookWithCorrectPhones = [];
    for (i = 0; i < book.length; i++) {
        var correctPhone = phoneToCorrectView(book[i][0]);
        if (book[i][2] === undefined) {
            bookWithCorrectPhones.push([book[i][1], correctPhone]);
            break;
        }
        bookWithCorrectPhones.push([book[i][1], correctPhone, book[i][2]]);
    }
    var sortedBookWithCorrectPhones = bookWithCorrectPhones.sort();
    var correctBook = [];
    for (i = 0; i < sortedBookWithCorrectPhones.length; i++) {
        correctBook.push((sortedBookWithCorrectPhones[i]).join(', '));
    }

    return correctBook;
}

exports.find = function (query) {
    if (findQueryInPhoneBook(query) === null) {

        return null;
    }

    return bookToCorrectView(findQueryInPhoneBook(query));
};

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
};
