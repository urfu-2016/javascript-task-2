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
    var rePhone = /^\d{10}$/;

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


function validName(name) {

    return (/\S+/.test(name) && Boolean(name));
}

function validMail(email) {
    if (email !== undefined) {
        if (email.length === 0 || email === ' ') {

            return false;
        }
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!isPhone(phone) || !validMail(email) || !validName(name) || inPhoneBook(phone)) {

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
    if (!inPhoneBook(phone)|| !validMail(email) || !validName(name) || !isPhone(phone)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }

    }

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} nStr
 */
exports.findAndRemove = function (query) {
    if (!validName(query)) {
        return 0;
    }
    var nStr = 0;
    var lenBook = phoneBook.length; // !!!!!!!!!!
    var allNotes = (query === '*');
    for (var i = lenBook - 1; i > -1; i--) {
        if (findInNote(query, phoneBook[i]) || allNotes) {
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
    if (!validName(query)) {
        return;
    }
    var allFound = [];
    var addnote = (query === '*');
    for (var i = 0; i < phoneBook.length; i++) {
        if (findInNote(query, phoneBook[i]) || addnote) {
            var phone = '+7 (' + phoneBook[i].phone.slice(0, 3) + ') ' +
            phoneBook[i].phone.slice(3, 6) + '-' + phoneBook[i].phone.slice(6, 8) + '-' +
            phoneBook[i].phone.slice(8);
            var strValue = phoneBook[i].name + ', ' + phone;
            var endStr = phoneBook[i].email ? ', ' + phoneBook[i].email : '';
            strValue += endStr;
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
    var n = 0;
    for (var i = 0; i < notesCsv.length; i++) {
        name = notesCsv[i].split(';')[0];
        phone = notesCsv[i].split(';')[1];
        email = notesCsv[i].split(';')[2];
        if (!exports.add(phone, name, email)) {
            n += exports.update(phone, name, email);
        } else {
            n += 1;
        }
    }

    return n;
};
