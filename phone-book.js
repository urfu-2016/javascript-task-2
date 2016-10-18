'use strict';

exports.isStar = true;
var phoneBook = [];

function isCorrectPhone(phone) {
    return typeof (phone) === 'string' && /^(\d){10}$/.test(phone);
}

function isNewPhone(phone) {
    if (phoneBook.length === 0) {
        return true;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][0] === phone) {

            return false;
        }
    }

    return true;
}
function correctNameAndEmail(name, email) {
    if (typeof(name) === 'string' && name.length > 0) {
        if ((typeof(email) === 'string' && email.length > 0 && email.indexOf('@') !== -1) ||
            email === undefined) {

            return true;
        }
    }

    return false;
}
exports.add = function (phone, name, email) {
    if (isCorrectPhone(phone) && correctNameAndEmail(name, email)) {
        if (isNewPhone(phone)) {
            phoneBook.push([phone, name, email]);

            return true;
        }
    }

    return false;
};
exports.update = function (phone, name, email) {
    if (!isCorrectPhone(phone) || !correctNameAndEmail(name, email)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][0] === phone) {
            phoneBook[i] = [phone, name, email];

            return true;
        }
    }

    return false;
};
exports.findAndRemove = function (query) {
    var newPhoneBook = [];
    if (query === '') {
        return 0;
    }
    if (typeof(query) !== 'string') {

        return 0;
    }
    if (query === '*') {
        var allRemoved = phoneBook.length;
        phoneBook = [];

        return allRemoved;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (!isSubstr(phoneBook[i], query)) {
            newPhoneBook.push(phoneBook[i]);
        }
    }
    var removed = phoneBook.length - newPhoneBook.length;
    phoneBook = newPhoneBook;

    return removed;
};
function formatPhoneBook(itemPhoneBook) {
    var formatedItem = '';
    var phone = '+7 (' + itemPhoneBook[0].slice(0, 3) + ') ' + itemPhoneBook[0].slice(3, 6) +
        '-' + itemPhoneBook[0].slice(6, 8) + '-' + itemPhoneBook[0].slice(8, 10);
    if (itemPhoneBook[2] !== undefined) {
        formatedItem = itemPhoneBook[1] + ', ' + phone + ', ' + itemPhoneBook[2];
    } else {
        formatedItem = itemPhoneBook[1] + ', ' + phone;
    }

    return formatedItem;
}
function isSubstr(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined && arr[i].indexOf(str) !== -1) {

            return true;
        }
    }

    return false;
}
function endedFind(query) {
    var findPhone = [];
    if (query === '*') {
        for (var j = 0; j < phoneBook.length; j++) {
            findPhone.push(formatPhoneBook(phoneBook[j]));
        }

        return findPhone;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (isSubstr(phoneBook[i], query)) {
            findPhone.push(formatPhoneBook(phoneBook[i]));
        }
    }

    return findPhone;

}
exports.find = function (query) {
    var findPhone = [];
    if (typeof(query) !== 'string' || query === '') {
        return findPhone.sort();
    }
    findPhone = endedFind(query);

    return findPhone.sort();
};

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var count = 0;
    var splitCsv = csv.split('\n');
    for (var i = 0; i < splitCsv.length; i++) {
        var data = splitCsv[i].split(';');
        var name = data[0];
        var phone = data[1];
        var email = data[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            count++;
        }
    }

    return count;
};
