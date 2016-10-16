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

function isPhone(phone) {
    var rePhone = /\d{10}/;

    return (rePhone.test(phone) && phone.length === 10);
}

function inPhoneBook(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
    }

    return false;
}


function findInNote(query, note) {
    var n = note.phone.indexOf(query);
    n += note.name.indexOf(query);
    n += note.email === undefined ? -1 : note.email.indexOf(query);

    return (n > -3);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!isPhone(phone) || name === undefined || inPhoneBook(phone)) {

        return false;
    }
    var note = {
        phone: phone,
        name: name,
        email: email
    };
    phoneBook.push(note);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (!inPhoneBook(phone) || name === undefined || !isPhone(phone)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;
        }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} nStr
 */
exports.findAndRemove = function (query) {
    var nStr = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (findInNote(query, phoneBook[i])) {
            phoneBook.splice(i, 1);
            nStr += 1;
        }
    }

    return nStr;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} allFound
 */
exports.find = function (query) {
    if (query === undefined) {
        return;
    }
    var allFound = [];
    var addnote = (query === '*');
    for (var i = 0; i < phoneBook.length; i++) {
        if (findInNote(query, phoneBook[i]) || addnote) {
            var phone = '+7 (' + phoneBook[i].phone.slice(0, 3) + ') ' +
            phoneBook[i].phone.slice(3, 6) + '-' + phoneBook[i].phone.slice(6, 8) + '-' +
            phoneBook[i].phone.slice(8);
            var strValue = phoneBook[i].name + ', ' + phone + ', ' + phoneBook[i].email;
            allFound.push(strValue);
        }
    }
    allFound.sort();
    
    return allFound;
};

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
    var notesCsv = csv.split('\n');
    var name;
    var phone;
    var email;
    var n = notesCsv.length;
    for (var i = 0; i < notesCsv.length; i++) {
        name = notesCsv[i].split(';')[0];
        name = notesCsv[i].split(';')[1];
        name = notesCsv[i].split(';')[2];
        var samePhone = csv.search(phone);
        n += 1 - samePhone.length;
        if (!exports.add(name, phone, email)) {
            exports.update(name, phone, email);
        }

    }

    return n;
};
