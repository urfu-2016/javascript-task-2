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
 * @returns {Boolean} - результат операции
 */
exports.add = function (phone, name, email) {
    if (name && isValidPhone(phone) && checkPhonebook(phone, name, email) && checkEmail(email)) {
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

function isValidPhone(phone) {
    if ((/^\d{10}$/).test(phone)) {

        return true;
    }

    return false;
}

function checkEmail(email) {

    return (^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$).test(email);
}

function checkPhonebook(phone, name, email) {
    var currData;
    for (var i = 0; i < phoneBook.length; i++) {
        currData = phoneBook[i];
        if (currData.phone === phone || currData.name === name || currData.email === email) {

            return false;
        }
    }

    return true;
}


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - результат операции
 */
exports.update = function (phone, name, email) {
    var currData;
    for (var i = 0; i < phoneBook.length; i++) {
        currData = phoneBook[i];
        if (checkToUpdate(currData, phone, name, email)) {

            return true;
        }
    }

    return false;
};

function checkToUpdate(currData, phone, name, email) {
    if (currData.phone === phone) {
        currData.name = (name || currData.name);
        if (email) {
            currData.email = email;
        } else {
            delete currData.email;
        }

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - результат операции
 */
exports.findAndRemove = function (query) {
    var count;
    count = 0;
    if (query === '') {

        return 0;
    }
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkIndex(query, phoneBook[i])) {
            phoneBook.splice(i, 1);
            count++;
            i--;
        }
    }

    return count;
};

function checkIndex(query, currData) {
    if (currData.name.indexOf(query) >= 0) {

        return true;
    }
    if (currData.phone.indexOf(query) >= 0) {

        return true;
    }
    if ((currData.email || '//').indexOf(query) >= 0) {

        return true;
    }

    return false;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Boolean} - результат операции
 */
exports.find = function (query) {
    if (query === undefined || query === '') {

        return [];
    }

    return getSortArray(query);
};

function getSortArray(query) {
    var currData;
    var userArray = [];
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        currData = phoneBook[i];
        if (checkIndex(query, currData)) {
            userArray.push(getString(currData.name, currData.phone, currData.email));
        }
    }

    return userArray.sort();
}

function getString(name, phone, email) {
    var newString;
    newString = name + convertPhone(phone);
    if (email) {

        return newString + ', ' + email;
    }

    return newString;
}


function convertPhone(phone) {
    var newPhone;
    newPhone = '(' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-';

    return ', +7 ' + newPhone + phone.slice(8);
}

/**
* Импорт записей из csv-формата
* @star
* @param {String} csv
* @returns {Number} – количество добавленных и обновленных записей
*/
exports.importFromCsv = function (csv) {
    var count;
    var csvSplit;
    csvSplit = csv.split('\n');
    count = 0;
    for (var i = 0; i < csvSplit.length; i++) {
        if (isValidAdUpCsv(csvSplit[i].split(';'), i)) {
            count++;
        }
    }

    return count;
};

function isValidAdUpCsv(user, index) {
    if (!isValidPhone(user[1]) && user[0] && !checkEmail(user[2])) {

        return false;

    }
    if (checkBook(user[1], user[0], user[2], index)) {
        phoneBook.push({ phone: user[1], name: user[0], email: user[2] });

        return true;
    }
    phoneBook[index].phone = user[1];
    phoneBook[index].name = user[0];
    phoneBook[index].email = user[2];

    return true;
}

function checkBook(phone, name, email, index) {
    var currData;
    currData = phoneBook[index];
    if (currData.phone === phone || currData.name === name || currData.email === email) {

        return false;
    }

    return true;
}
