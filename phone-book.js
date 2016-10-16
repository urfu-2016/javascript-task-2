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
    checkTypeString(phone);
    if (phone.length !== 10 || phoneBook.hasOwnProperty(phone)) {
        return false;
    }
    for (var i = 0; i < 11; i++) {
        if (phone[i] < '0' || phone[i] > '9') {
            return false;
        }
    }

    return true;
}

function checkDefinition(name) {
    return typeof(name) !== 'undefined';
}

function checkPhoneAndName(phone, name) {
    if (checkDefinition(phone)) {

        return checkPhone(phone) && checkDefinition(name) && name !== '';
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – added or not
 */
exports.add = function (phone, name, email) {
    if (checkPhoneAndName(phone, name)) {
        if (checkDefinition(email)) {
            phoneBook[phone] = { 'name': name, 'email': email };
        } else {
            phoneBook[phone] = { 'name': name };
        }

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
    if (typeof(name) !== 'undefined' && Object.keys(phoneBook).includes(phone)) {
        checkTypeString(name);
        if (typeof(email) !== 'undefined') {
            checkTypeString(email);
            phoneBook[phone] = { 'name': name, 'email': email };
        } else {
            phoneBook[phone] = { 'name': name };
        }

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
    var prevLength = phones.length;
    phones.map(deleteNote);

    return prevLength;
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
    var contactsGoodForm = phones.map(makeCorrectFormat);

    return contactsGoodForm.sort();
};

function checkTypeString(query) {
    if (typeof (query) !== 'string') {
        throw new TypeError();
    }
}

function findCorrect(query) {
    checkTypeString(query);
    var result = [];
    var keys = Object.keys(phoneBook);
    if (query === '') {

        return result;
    } else if (query === '*') {

        return keys;
    }

    //  phoneBook.forEach(filterWithQuery(query));
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
    if (email !== '' && typeof (email) === 'string') {
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
    checkTypeString(csv);
    var added = 0;
    parseCSV(csv).forEach(function (note) {
        var phoneNote = note.split(';');
        var name = phoneNote[0];
        var phone = phoneNote[1];
        var mail;
        if (phoneNote.length === 2) {
            mail = undefined;
        }
        if ((exports.find(phoneNote[1])).length === 1) {
            if (exports.update(phone, name, mail)) {
                added++;
            }
        } else if (exports.add(phone, name, mail)) {
            added++;
        }
    });

    return added;
};

function parseCSV(csv) {
    checkTypeString(csv);

    return csv.split('\n');
}
