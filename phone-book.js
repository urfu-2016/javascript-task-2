'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;
exports.isStar = false;
/**
 * Телефонная книга
 */
var phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
function checkPhone(phone){
    var phoneReg = /^\d{10}$/;
    if (phone !== undefined && !phoneReg.test(phone)) {

    return false;
    }

    return true;
 }
exports.add = function (phone, name, email) {
    if (checkPhone(phone) && correctName(name) && checkUnique(phone)) {
        if (email === undefined || correctEmail(email)) {
            phoneBook.push({
                phone: phone,
                name: name,
                email: email
            });
        }

        return true
    }

    return false
};
function checkUnique(element) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (element === phoneBook[i].phone) {

            return false;
        }
    }

    return true;
}
function correctName(name) {
    if(name === undefined || (typeof value === 'string') || value !== '') {

        return false;
    }

    return true;
}
function correctEmail(email) {
    if(email === undefined || (typeof value === 'string') || value !== '') {

    return false;
    }

    return true;
 }
/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
function FindPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return phoneBook[i];
        }
    }

    return false;
}
exports.update = function (phone, name, email) {
    if (checkPhone(phone) && correctName(name)) {
        var UpdatePhone = FindPhone(phone);
        if (UpdatePhone !== false) {
            UpdatePhone.name = name;
            UpdatePhone.email = email;

            return true;
        }

    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var Counter = 0;
    var realEmail='';
    if (correctName(query)) {
        var refreshedBook = phoneBook.filter(function (element) {
            if (element.email === undefined) {
                realEmail='';
            } else { 
                realEmail=', ' + element.email;
            };
            var lowerQuery = query.toLowerCase();
            return (element.phone.indexOf(query) === -1 &&
                    element.name.toLowerCase().indexOf(lowerQuery) === -1 &&
                    realEmail.toLowerCase().indexOf(lowerQuery) === -1);
        });
        if (query === '*') {
            Counter = phoneBook.length;
            phoneBook = [];

            return Counter;

        }
        Counter = phoneBook.length - refreshedBook.length;
        phoneBook = refreshedBook;
    }

    return Counter;
};

function returnEmail(Name, Phone, Email) {
    var returnStr = '';
    if (Email !== undefined && Email !== null) {
        returnStr = Name + ', ' + Phone + ', ' + Email;
    } else {
        returnStr = Name + ', ' + Phone;
    }

    return returnStr;
}

function comfortFormat(phone) {

    return (
        '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) +
        '-' + phone.slice(8));
}
/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if ((query === undefined) || (query === null) || (query === '')) {
        var empty = [];

        return empty;
    }
    if (query === '*') {
        query = '';
    }
    var coincidencePhone = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var bookName = (phoneBook[i]._name.indexOf(query) !== -1);
        var bookPhone = (phoneBook[i]._phone.indexOf(query) !== -1);
        var bookEmail;
        if (phoneBook[i]._email !== undefined && phoneBook[i]._email !== null) {
            bookEmail = (phoneBook[i]._email.indexOf(query) !== -1);
        } else {
            bookEmail = false;
        }
        if (bookName || bookPhone || bookEmail) {
            var currentName = phoneBook[i]._name;
            var currentPhone = comfortFormat(phoneBook[i]._phone);
            var currentEmail = phoneBook[i]._email;
            coincidencePhone.push(returnEmail(currentName, currentPhone, currentEmail));
        }
    }
    coincidencePhone.sort();

    return coincidencePhone;
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

    return csv.split('\n').length;
};
