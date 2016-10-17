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

function checkPhoneAndName(phone, name) {
    if (phone.length !== 10 || /[^[0-9]/.test(phone)) {

        return false;
    }
    if (name === '' || typeof name !== 'string' || name === undefined) {

        return false;
    }

    return true;
}

function checkIfExists(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return i;
        }
    }

    return -1;
}

function findAnyMatches(query) {
    var result = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone.indexOf(query) !== -1 ||
            phoneBook[i].name.indexOf(query) !== -1 ||
            phoneBook[i].email.indexOf(query) !== -1) {
            result.push(i);
        }
    }

    return result;
}

exports.add = function (phone, name, email) {
    if (!checkPhoneAndName(phone, name)) {

        return false;
    }

    if (checkIfExists(phone) !== -1) {

        return false;
    }

    if (email === undefined || typeof email !== 'string') {
        email = '';
    }
    phoneBook.push({ phone: phone, name: name, email: email });

    return true;


};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} isUpdated
 */
exports.update = function (phone, name, email) {
    if (!checkPhoneAndName(phone, name)) {

        return false;
    }
    var objIndex = checkIfExists(phone);
    if (objIndex === -1) {

        return false;
    }

    if (email === undefined || typeof email !== 'string') {
        email = '';
    }
    phoneBook[objIndex] = { phone: phone, name: name, email: email };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - количество удаленных записей
 */
exports.findAndRemove = function (query) {
    if (query === '*') {

        return resultDeletedPhoneBook(-1);
    }

    return resultDeletedPhoneBook(query);
};

function resultDeletedPhoneBook(query) {
    var arrayForDelete = findAnyMatches(query);
    for (var i = 0; i < arrayForDelete.length; i++) {
        phoneBook = phoneBook.splice(arrayForDelete[i], 1);
    }

    return arrayForDelete.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} - массив
 */
exports.find = function (query) {
    if (query === '*') {

        return resultPhoneBook(phoneBook);
    }
    var resultBook = phoneBook.filter(function (item) {

        return (item.phone === query || item.phone.indexOf(query) !== -1) ||
            (item.name === query || item.name.indexOf(query) !== -1) ||
            (item.email === query || item.email.indexOf(query) !== -1);
    });

    return resultPhoneBook(resultBook);
};

function resultPhoneBook(array) {
    array = array.sort(compare);
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var phone = array[i].phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
        if (array[i].email !== '') {
            result[i] = array[i].name + ', ' + phone + ', ' + array[i].email;
        } else {
            result[i] = array[i].name + ', ' + phone;
        }
    }

    return result;
}

function compare(a, b) {
    if (a.name < b.name) {

        return -1;
    }
    if (a.name > b.name) {

        return 1;
    }

    return 0;
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
    var parsed = csv.split('\n');

    return parsed.length - 1;

    /* for (var i= 0; i < parsed.length; i++) {
        var pars = parsed[i].split(';');
        var name = pars[0];
        var phone = pars[1];
        var email = pars[2];
    }

    return exports.add(name, phone, email) || exports.update(name, phone,email);*/
};

