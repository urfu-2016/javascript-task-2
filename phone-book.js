'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = {};


function checkPhone(phone) {
    if (phone.length !== 10) {
        return false;
    }
    var telForm = /^[0-9]{10}$/;

    return telForm.test(phone);
}

function checkDefinition(name) {
    return typeof(name) !== 'undefined';
}

function checkString(name) {
    return typeof(name) === 'string' && name.length !== 0;
}

function checkPhoneAndName(phone, name) {
    return checkDefinition(phone) && checkPhone(phone) && checkDefinition(name) &&
        checkString(name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – added or not
 */
exports.add = function (phone, name, email) {
    if (checkPhoneAndName(phone, name) && !phoneBook.hasOwnProperty(phone)) {
        phoneBook[phone] = { 'name': name, 'email': email };

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (typeof(name) !== 'undefined' && Object.keys(phoneBook).includes(phone) &&
        name.length !== 0 && checkPhoneAndName(phone, name)) {
        phoneBook[phone] = { 'name': name, 'email': email };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} deleted
 */
exports.findAndRemove = function (query) {
    var phones = findCorrect(query);
    phones.map(deleteNote);

    return phones.length;
};

function deleteNote(phone) {
    delete phoneBook[phone];
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} – массив строк
 */
exports.find = function (query) {
    var phones = findCorrect(query);
    var contactsGoodForm = phones.sort(sortByName).map(makeCorrectFormat);

    return contactsGoodForm;
};

function sortByName(phone1, phone2) {
    return phoneBook[phone1].name.localeCompare(phoneBook[phone2].name);
}

function findCorrect(query) {
    var result = [];
    var keys = Object.keys(phoneBook);
    if (query === '') {

        return result;
    } else if (query === '*') {

        return keys;
    }
    keys.forEach(function (key) {
        if (phoneBook[key].name.indexOf(query) !== -1 || key.indexOf(query) !== -1) {
            result.push(key);
        } else if (typeof (phoneBook[key].email) !== 'undefined') {
            if (phoneBook[key].email.indexOf(query) !== -1) {
                result.push(key);
            }
        }
    });

    return result;
}

function makeCorrectFormat(phone) {
    var name = phoneBook[phone].name;
    var email = phoneBook[phone].email;
    var newPhone = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) +
        '-' + phone.slice(-2);
    var newNote = [name, newPhone];
    if (typeof (email) !== 'undefined' && email.length !== 0) {
        newNote.push(email);
    }

    return newNote.join(', ');
}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */

exports.importFromCsv = function (csv) {
    var added = 0;
    parseCSV(csv).forEach(function (note) {
        var phoneNote = note.split(';');
        var name = phoneNote[0];
        var phone = phoneNote[1];
        var mail;
        if (phoneNote.length === 2) {
            mail = undefined;
        } else {
            mail = phoneNote[2];
        }
        if (exports.add(phone, name, mail) || exports.update(phone, name, mail)) {
            added++;
        }
    });

    return added;
};

function parseCSV(csv) {

    return csv.split('\n');
}
