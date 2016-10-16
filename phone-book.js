'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} Entry was added or no.
 */
exports.add = function (phone, name, email) {
    if (!isCorrectData(phone, name, email) || isSameEntries(phone, email)) {
        return false;
    }
    if (email === undefined) {
        email = '';
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

function isCorrectData(phone, name, email) {
    var i;
    if (name === undefined || phone.match(/\d/g).length !== 10) {
        return false;
    }
    if (name.match(/\w/g)) {
        return false;
    }
    if (email !== undefined && (email.indexOf('@') == -1 ||  email.indexOf('.') == -1)){
        return false;
    }


    return true;
}

function isSameEntries(phone, email) {
    var i;
    for (i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone || email === phoneBook[i].email) {
            return true;
        }
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} Entry was updated or no.
 */
exports.update = function (phone, name, email) {
    var i;
    if (!isCorrectData(phone, name, email)) {
        return false;
    }
    if (email === undefined) {
        email = '';
    }
    for (i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} The count of operations.
 */
exports.findAndRemove = function (query) {
    var i;
    var counter = 0;
    var entries = entriesToString();
    for (i = 0; i < phoneBook.length; i++) {
        if (entries[i].indexOf(query) !== -1 && query !== '') {
            entries.splice(i, 1);
            phoneBook.splice(i, 1);
            i--;
            counter++;
        }
    }

    return counter;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} The result Array of Strings.
 */
exports.find = function (query) {
    var result = [];
    var i;
    var entries = entriesToString();
    if (query === '*') {
        return allEntries();
    }
    for (i = 0; i < entries.length; i++) {
        if (entries[i].indexOf(query) !== -1 && query !== '') {
            result.push(phoneToFormat(entries[i]));
        }
    }

    return result.sort();
};

function entriesToString() {
    var result = [];
    var entry;
    var i;
    for (i = 0; i < phoneBook.length; i++) {
        entry = phoneBook[i].name + ' ' + phoneBook[i].phone;
        if (phoneBook[i].email !== '' && phoneBook[i].email !== undefined) {
            entry += ' ' + phoneBook[i].email;
        }
        result.push(entry);
    }

    return result;
}

function phoneToFormat(entry) {
    var phoneFormat;
    var p = entry.split(' ');
    phoneFormat = '+7 (' + p[1].slice(0, 3) + ') ';
    phoneFormat += p[1].slice(3, 6) + '-' + p[1].slice(6, 8) + '-' + p[1].slice(8, 10);
    if (p[2] === undefined) {

        return p[0] + ', ' + phoneFormat;
    }

    return p[0] + ', ' + phoneFormat + ', ' + p[2];
}

function allEntries() {
    var i;
    var result = [];
    var entries = entriesToString();
    for (i = 0; i < entries.length; i++) {
        result.push(phoneToFormat(entries[i]));
    }

    return result.sort();
}

function isEntryExist(csv) {
    var i;
    for (i = 0; i < phoneBook.length; i++) {
        if (csv[1] === phoneBook[i].phone) {
            phoneBook[i].phone = csv[1];
            phoneBook[i].name = csv[0];
            phoneBook[i].email = csv[2];

            return true;
        }
    }

    return false;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var k;
    var parseCSV = csv.split(/\s/g);
    var counter = parseCSV.length;
    for (k = 0; k < parseCSV.length; k++) {
        parseCSV[k] = parseCSV[k].split(';');
        if (!isCorrectData(parseCSV[k][1], parseCSV[k][0], parseCSV[k][2])) {
            counter--;
            break;
        }
        if (!isEntryExist(parseCSV[k])) {
            phoneBook.push({
                phone: parseCSV[k][1],
                name: parseCSV[k][0],
                email: parseCSV[k][2]
            });
        }
    }

    return counter;
};
