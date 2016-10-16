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
    if (!isCorrectData(phone, name) || isSameEntries(phone, email)) {
        return false;
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

function isCorrectData(phone, name) {
    if (name === undefined || !name.match(/^[a-zA-Zа-яА-Я]+$/g)) {
        return false;
    }
    if (phone.match(/\d/g).length !== 10) {
        return false;
    }

    return true;
}

function isSameEntries(phone, email) {
    for (var i = 0; i < phoneBook.length; i++) {
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
    if (!isCorrectData(phone, name)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
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
    var counter = 0;
    var entries = entriesToString();
    for (var i = 0; i < phoneBook.length; i++) {
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
    var entries = entriesToString();
    if (query === '*') {
        return allEntries();
    }
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].indexOf(query) !== -1 && query !== '') {
            result.push(phoneToFormat(entries[i]));
        }
    }

    return result.sort();
};

function entriesToString() {
    var result = [];
    var entry;
    for (var i = 0; i < phoneBook.length; i++) {
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
    var result = [];
    var entries = entriesToString();
    for (var i = 0; i < entries.length; i++) {
        result.push(phoneToFormat(entries[i]));
    }

    return result.sort();
}

function isEntryExist(csv) {
    for (var i = 0; i < phoneBook.length; i++) {
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
    var pCSV = csv.split(/\s/g);
    var counter = pCSV.length;
    for (var i = 0; i < pCSV.length; i++) {
        pCSV[i] = pCSV[i].split(';');
        if (!isCorrectData(pCSV[i][1], pCSV[i][0]) || pCSV[i].length > 3) {
            counter--;
        } else if (!isEntryExist(pCSV[i])) {
            phoneBook.push({
                phone: pCSV[i][1],
                name: pCSV[i][0],
                email: pCSV[i][2]
            });
        }
    }

    return counter;
};
