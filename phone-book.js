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
 */
exports.add = function (phone, name, email) {
    if (isPhoneCorrect(phone) && isNameCorrect(String(name)) && isPhoneUnique(phone)) {
        phoneBook.push({ name: name, phone: phone, email: getRightEmail(email) });

        return true;
    }

    return false;
};

function isPhoneCorrect(phone) {
    return (/\d{10}/.test(phone));
}

function isPhoneUnique(phone) {
    var result = true;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) result = false;
    }

    return result;
}

function isNameCorrect(name) {
    return ((name !== 'undefined') && (name.length !== 0));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var isFound = false;
    if (isNameCorrect(String(name)) && isPhoneCorrect(phone)) {
        for (var i = 0; i < phoneBook.length; i++) {
            var note = phoneBook[i];
            if (note.phone === phone) {
                var keys = Object.keys(note);
                note[keys[0]] = name;
                note[keys[2]] = getRightEmail(email);
                isFound = true;
            }
        }
    }

    return isFound;
};

function getRightEmail(email) {
    if (typeof email === 'undefined') {
        email = '';
    }

    return email;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var foundNotes = exports.find(query);
    for (var i = 0; i < foundNotes.length; i++) {
        for (var j = 0; j < phoneBook.length; j++) {
            var note = phoneBook[j];
            if (note.phone === (foundNotes[i].split(',')[1].slice(5, 8) +
                                foundNotes[i].split(',')[1].slice(10, 13) +
                                foundNotes[i].split(',')[1].slice(14, 16) +
                                foundNotes[i].split(',')[1].slice(17))) {
                phoneBook.splice(j,1);
            }
        }
    }

    return foundNotes.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var result = [];
    if (!isNameCorrect(query)) {
        return result;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        var keys = Object.keys(note);
        for (var j = 0; j < keys.length; j++) {
            if ((note[keys[j]].indexOf(query) !== -1) || (query === '*')) {
                if (note[keys[2]] === '') {
                    result.push(note[keys[0]] + ', ' +
                                getRightPhone(note[keys[1]]));
                }
                else {
                    result.push(note[keys[0]] + ', ' +
                                getRightPhone(note[keys[1]]) + ', ' + note[keys[2]]);
                }
                if (query === '*') {
                    break;
                }
            }
        }
    }

    return result.sort();
};

function getRightPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    var result = 0;
    csv = csv.split('\n');
    for (var i = 0; i < csv.length; i++) {
        var note = csv[i].split(';');
        if ((exports.add(note[1], note[0], note[2])) ||
            (exports.update(note[1], note[0], note[2]))) {
            result++;
        }
    }

    return result;
};
