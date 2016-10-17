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

function checkPhone(phone) {
    if (phone === undefined) {

        return false;
    }

    return phone.toString().match(/^[0-9]{10}$/) !== null;
}

function checkName(name) {
    return name === undefined || name === '';
}

exports.add = function (phone, name, email) {
    if (!checkPhone(phone) || checkName(name) || email === '') {
        return false;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }

    phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

    return true;
};

/*
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (name === undefined || typeof name !== 'string') {
        return false;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = { 'phone': phone, 'name': name, 'email': email };

            return true;
        }
    }

    return false;
};

/*
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var count = 0;

    var phoneList = this.find(query);

    phoneList.forEach(function kek(item) {
        for (var j = 0; j < phoneBook.length; j++) {
            if (item.split(', ')[1] === phoneFormat(phoneBook[j].phone)) {
                phoneBook.splice(j, 1);
                count++;
            }
        }
    });

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */

function phoneFormat(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

exports.find = function (query) {
    var phones = [];

    if (!query || typeof query !== 'string') {
        return phones;
    }

    phones = phoneBook.filter (function (item) {
        function itemFind(text) {
            return (text !== undefined && text.indexOf(query) !== -1 || query === '*');
        }

        return itemFind(item.name) || itemFind(item.phone) || itemFind(item.email);
    });


    for (var i = 0; i < phones.length; i++) {

        var phoneString = phones[i].name + ', ' + phoneFormat(phones[i].phone);
        if (phones[i].email !== undefined) {
            phoneString += ', ' + phones[i].email;
        }
        phones[i] = phoneString;
    }

    return phones.sort();
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
    var count = 0;
    var listLine = csv.split('\n');
    for (var i = 0; i < listLine.length; i++) {
        var name = listLine[i].split(';')[0];
        var phone = listLine[i].split(';')[1];
        var email = listLine[i].split(';')[2];
        if (this.add(phone, name, email) || this.update(phone, name, email)) {
            count++;
        }
    }

    return count;
};
