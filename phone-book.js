'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = {};

function correctData(value) {
    return value !== undefined && (typeof value === 'string') && value !==
        '';
}

function correctNumber(phone) {
    var phoneReg = /^\d{10}$/;

    return correctData(phone) && phoneReg.test(phone);
}

function validEmail(email) {
    if (email !== undefined && correctData(email)) {

        return email;
    }

    return undefined;
}

function correctMail(mail) {
    if (typeof mail === 'undefined') {

        return true;

    }

    if (typeof mail === 'string' && mail !== '') {

        return true;

    }

    return false;

}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – успех или не успех операции
 */
exports.add = function (phone, name, email) {
    if (!correctNumber(phone)) {

        return false;

    }
    if (!correctData(name) || !correctMail(email)) {

        return false;

    }
    if (phone in phoneBook) {

        return false;

    }
    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;

};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – успех или не успех операции
 */
exports.update = function (phone, name, email) {
    if (!correctNumber(phone)) {

        return false;

    }
    if (!correctData(name) || !correctMail(email)) {

        return false;

    }
    if (!(phone in phoneBook)) {

        return false;

    }
    phoneBook[phone] = {
        name: name,
        email: validEmail(email)
    };

    return true;

};

function gettingRightNumbers(query) {
    var search = [];
    var keys = Object.keys(phoneBook);
    for (var id = 0; id < keys.length; id +=1) {
        if (psuccessFind(query, keys[id])) {
            search.push(keys[id]);
        }
    }

    return search;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} – кол-во удалённых записей
 */
exports.findAndRemove = function (query) {
    var firstSize = Object.keys(phoneBook).length;
    if (query === '*') {
        phoneBook = {};

        return firstSize;

    }
    if (!correctData(query)) {

        return 0;

    }
    var searchForDelete = gettingRightNumbers(query);
    if (searchForDelete.length === 0) {

        return 0;

    }
    for (var index in searchForDelete) {
        delete phoneBook[searchForDelete[index]];
    }

    return searchForDelete.length;
};

function comfortFormat(phone) {

    return ('+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8));

}

function emailSugar(email) {
    if (email === undefined) {

        return '';

    }

    return ', ' + email;

}

function successFind(query, phone) {
    if (phone.indexOf(query) > -1 || (phoneBook[phone].email && phoneBook[
            phone].email.indexOf(query > -1)) || phoneBook[phone].name.indexOf(
            query) > -1) {
        console.log(phone);
        return true;
    }

    return false;

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Number} – записи, удовлетворяющие условию
 */
exports.find = function (query) {
    if (query === '*') {

        return Object.keys(phoneBook).map(function (element) {
            var realEmail = emailSugar(phoneBook[element].email);

            return phoneBook[element].name + ', ' + comfortFormat(element) + realEmail;

        })
        .sort();
    }
    if (!correctData(query)) {

        return false;

    }
    var searchFor = [];
    for (var phone in phoneBook) {
        if (phone && successFind(query, phone)) {
            searchFor.push(phone);
        }
    }
    if (searchFor.length === 0) {

        return [];

    }

    return searchFor.map(function (element) {
        var realEmail = emailSugar(phoneBook[element].email);

        return phoneBook[element].name + ', ' + comfortFormat(element) + realEmail;

    })
    .sort();
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
