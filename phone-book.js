'use strict';

/*
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/*
 * Телефонная книга
 */
var phoneBook;
phoneBook = [];

/*
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
function correctPhone(phone) {
    if (phone.length === 10 && !isNaN(phone)) {
        return true;
    }

    return false;
}

function coincidePhone(phone) {
    if (phoneBook.length === 0) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i]._phone === phone) {

            return true;
        }
    }

    return false;
}

function correctName(name) {
    if (name === undefined) {
        return false;
    }

    return true;
}

function correctEmail(email) {
    var reg = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-zа-я0-9_-]+(\.[a-zа-я0-9_-]+)*\.[a-zа-я]{2,6}$/i;
    if (email !== undefined) {
        if (!reg.test(email)) {

            return false;
        }
    }

    return true;
}

exports.add = function (phone, name, email) {

    if (correctPhone(phone) && !coincidePhone(phone) && correctEmail(email) && correctName(name)) {
        phoneBook.push({ _phone: phone, _name: name, _email: email });

        return true;
    }

    return false;

};

/*
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
function searchNumb(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i]._phone === phone) {
            return i;
        }
    }

    return -1;
}

exports.update = function (phone, name, email) {
    if (correctPhone(phone) && correctName(name) && correctEmail(email)) {
        var indexPhone = searchNumb(phone);
        if (indexPhone !== -1) {
            phoneBook[indexPhone]._name = name;
            phoneBook[indexPhone]._email = email;

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
    var foundArr = findToRemove(query);
    var newBook = [];
    newBook = newBook.concat(phoneBook);
    var countRemove = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        var searchStr = '';
        if (phoneBook[i]._email !== undefined) {
            var name = phoneBook[i]._name;
            var email = phoneBook[i]._email;
            searchStr = name + ', ' + formatPhone(phoneBook[i]._phone) + ', ' + email;
        } else {
            searchStr = phoneBook[i]._name + ', ' + phoneBook[i]._phone;
        }
        if (foundArr.indexOf(searchStr) !== -1) {
            newBook.splice(i, 1);
            countRemove++;
        }
    }

    return countRemove;
};

function formatPhone(phone) {
    var partOne = phone.substring(0, 3);
    var partTwo = phone.substring(3, 6);
    var partThree = phone.substring(6, 8);
    var partFour = phone.substring(8);

    var newPhone = '+7 (' + partOne + ') ' + partTwo + '-' + partThree + '-' + partFour;

    return newPhone;
}

function returnDependEmail(currentN, currentPh, currentEm) {
    var returnStr = '';
    if (currentEm !== undefined) {
        returnStr = currentN + ', ' + currentPh + ', ' + currentEm;
    } else {
        returnStr = currentN + ', ' + currentPh;
    }

    return returnStr;
}

function searchMatch(query) {
    var coincidencePhone = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var chName = (phoneBook[i]._name.indexOf(query) !== -1);
        var chPhone = (phoneBook[i]._phone.indexOf(query) !== -1);
        var chEmail;
        if (phoneBook[i]._email !== undefined) {
            chEmail = (phoneBook[i]._email.indexOf(query) !== -1);
        } else {
            chEmail = false;
        }
        if (chName || chPhone || chEmail) {
            var currentN = phoneBook[i]._name;
            var currentPh = formatPhone(phoneBook[i]._phone);
            var currentEm = phoneBook[i]._email;

            coincidencePhone.push(returnDependEmail(currentN, currentPh, currentEm));
        }
    }

    return coincidencePhone;
}

exports.find = function (query) {
    if ((query === undefined) || (query === null) || (query === '')) {
        return null;
    }
    if (query === '*') {
        query = '';
    }

    var sortCoincidenceBook = searchMatch(query);
    sortCoincidenceBook.sort();
    console.info(sortCoincidenceBook);

    return sortCoincidenceBook;

};
function findToRemove(query) {
    if ((query === undefined) || (query === null) || (query === '')) {
        return null;
    }
    if (query === '*') {
        query = '';
    }
    var sortCoincidenceBook = searchMatch(query);
    sortCoincidenceBook.sort();
    console.info(sortCoincidenceBook);

    return sortCoincidenceBook;

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

    return csv.split('\n').length;
};
