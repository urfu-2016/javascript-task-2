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
var rPhone = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} is it correct
 */
exports.add = function (phone, name, email) {
    if (!isCorrectInput(phone, name, email) || arguments.length > 3) {
        return false;
    }
    if (!mySearch(phone)) {
        phoneBook.push({
            phone: phone,
            name: name,
            email: email
        });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} is it correct
 */
exports.update = function (phone, name, email) {
    if (!isCorrectInput(phone, name, email)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook.splice(i, 1, {
                phone: phone,
                name: name,
                email: email
            });

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} number of removed strings
 */
exports.findAndRemove = function (query) {
    var counter = 0;
    if (!isString(query)) {

        return 0;
    }
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (findStr(query, phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email)) {
            phoneBook.splice(i, 1);
            i--;
            counter++;
        }
    }

    return counter;
};

function findStr(query, phone, name, email) {
    if (name.indexOf(query) !== -1 || phone.indexOf(query) !== -1) {

        return true;
    }
    if (email !== undefined && email.indexOf(query) !== -1) {

        return true;
    }

    return false;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} finedList
 */
exports.find = function (query) {
    var result = [];
    if (!isString(query)) {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (findStr(query, phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email)) {
            result.push(toCorrect(phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email));
        }
    }
    function toCorrect(phone, name, email) {
        var string;
        string = name + ', +7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
            phone.slice(6, 8) + '-' + phone.slice(8, 10);
        if (email !== undefined && email !== '') {
            string += ', ' + email;
        }

        return string;
    }

    return result.sort();
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
    var counter = 0;
    var data = csv.split('\n');
    data.forEach(function (str) {
        var sData = str.split(';');
        if (isCorrectInput(sData[1], sData[0], sData[2]) && sData.length < 4) {
            if (exports.update(sData[1], sData[0], sData[2])) {
                counter++;
            }
            if (exports.add(sData[1], sData[0], sData[2])) {
                counter++;
            }
        }
    });

    return counter;
};

function isCorrectInput(phone, name, email) {
    if (isEmpty(phone) || isEmpty(name)) {

        return false;
    }
    if (isCorrectPhone(phone) && isCorrectEmail(email)) {

        return true;
    }

    return false;
}

function isEmpty(str) {
    if (typeof str === 'string' && str !== undefined && str.trim().length !== 0) {

        return false;
    }

    return true;
}

function isCorrectPhone(phone) {
    if (phone === null || phone === undefined) {

        return false;
    }
    if (rPhone.test(phone)) {

        return true;
    }

    return false;
}

function isCorrectEmail(email) {
    if (typeof email === 'string') {

        return true;
    }
    if (email !== null && email === undefined) {

        return true;
    }

    return false;
}

/**
 * @param {String} phone
 * @returns {Boolean} isFound
 */
function mySearch(phone) {
    return phoneBook.some(function (item) {
        return item.phone === phone;
    });
}

function isString(query) {
    if (typeof(query) !== 'string' || query === '') {

        return false;
    }

    return true;
}
