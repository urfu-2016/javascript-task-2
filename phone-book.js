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
    if (phone && /^\d{10}$/.test(phone) && name) {
        var isContained = phoneBook.some(function (item) {
            return phone === item.phone;
        });
        if (!isContained) {
            var newLine = {
                phone: phone,
                name: name,
                email: email
            };
            phoneBook.push(newLine);

            return true;
        }
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (phone && /^\d{10}$/.test(phone) && name) {
        var containedIndex = phoneBook.findIndex(function (item) {
            return phone === item.phone;
        });
        if (containedIndex !== -1) {
            phoneBook[containedIndex] = {
                phone: phone,
                name: name,
                email: email
            };

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    var removeCount = 0;
    if (!query) {
        removeCount = 0;
    } else if (query && query === '*') {
        removeCount = phoneBook.length;
        phoneBook = [];
    } else {
        var newPhoneBook = phoneBook.filter(function (item) {
            var isRetainItem = true;
            if (item.email) {
                isRetainItem = item.email.indexOf(query) === -1;
            }
            isRetainItem = item.name.indexOf(query) === -1 && isRetainItem;
            isRetainItem = item.phone.indexOf(query) === -1 && isRetainItem;

            return isRetainItem;
        });
        removeCount = phoneBook.length - newPhoneBook.length;
        phoneBook = newPhoneBook;
    }

    return removeCount;
};

var stringToPhone = function (str) {
    var result = '+7 (';
    result += str.slice(0, 3) + ') ' +
        str.slice(3, 6) + '-' +
        str.slice(6, 8) + '-' +
        str.slice(8, 10);

    return result;
};

exports.find = function (query) {
    var unsortedResult;
    if (!query) {
        unsortedResult = [];
    } else if (query !== '*') {
        unsortedResult = phoneBook.filter(function (item) {
            var contains = item.phone.indexOf(query) !== -1 || item.name.indexOf(query) !== -1;

            return contains || item.email.indexOf(query) !== -1;
        });
    } else {
        unsortedResult = phoneBook;
    }
    var result = unsortedResult.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }

        return 0;
    });

    return result.map(function (item) {
        var phoneLine = item.name + ', ' + stringToPhone(item.phone);
        if (item.email) {
            phoneLine += ', ' + item.email;
        }

        return phoneLine;
    });
};

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var tupleList = csv.split('\n');
    var changeCount = tupleList.reduce(function (acc, item) {
        var name = item.split(';')[0];
        var phone = item.split(';')[1];
        var email = item.split(';')[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            acc++;

            return acc;
        }

        return acc;
    }, 0);

    return changeCount;
};
