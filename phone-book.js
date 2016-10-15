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
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (checkInput(phone, name)) {
        var isExist = phoneBook.some(function (item) {

            return phone === item.phone;
        });

        if (!isExist) {
            var newRecord = {
                name: name,
                phone: phone,
                email: email
            };

            phoneBook.push(newRecord);

            return true;
        }
    }

    return false;
};

function checkInput(phone, name) {

    return (phone && /^\d{10}$/.test(phone) && name);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (checkInput(phone, name)) {
        var updateIndex = phoneBook.findIndex(function (item) {

            return phone === item.phone;
        });
        if (updateIndex !== -1) {
            phoneBook[updateIndex] = {
                phone: phone,
                name: name,
                email: email
            };

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    if (!query || typeof query !== 'string') {

        return 0;
    }

    var count;
    if (query !== '*') {
        var newPhoneBook = getNotRemovedItems(query);
        count = phoneBook.length - newPhoneBook.length;
        phoneBook = newPhoneBook;
    } else {
        count = phoneBook.length;
        phoneBook = [];
    }

    return count;
};

function getNotRemovedItems(query) {

    return phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) === -1 &&
            item.name.indexOf(query) === -1;
        if (item.email) {
            result = result && item.email.indexOf(query) === -1;
        }

        return result;
    });
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (!query || typeof query !== 'string') {

        return [];
    }
    var queryResult;
    if (query !== '*') {
        queryResult = getItemsByQuery(query);
    } else {
        queryResult = phoneBook;
    }

    var sortedResult = sortArray(queryResult);

    return sortedResult.map(function (item) {
        var queryLine = item.name + ', ' + convertPhone(item.phone);

        if (item.email) {
            queryLine += ', ' + item.email;
        }

        return queryLine;
    });
};

function convertPhone(phone) {

    return '+7 (' +
        phone.substring(0, 3) + ') ' +
        phone.substring(3, 6) + '-' +
        phone.substring(6, 8) + '-' +
        phone.substring(8, phone.length);
}

function sortArray(arr) {

    return arr.sort(function (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }

        return 0;
    });
}

function getItemsByQuery(query) {

    return phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) !== -1 ||
            item.name.indexOf(query) !== -1;
        if (item.email) {
            result = result || item.email.indexOf(query) !== -1;
        }

        return result;
    });
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
    var counter = 0;
    var users = csv.split('\n');
    users.forEach(function (user) {
        var newUser = user.split(';');
        var name = newUser[0];
        var phone = newUser[1];
        var email = newUser[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            counter++;
        }
    });

    return counter;
};
