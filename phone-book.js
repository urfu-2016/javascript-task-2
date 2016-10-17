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
var rPhone = /\d/g;
var regExpName = /^[ _a-zA-Zа-яА-Я0-9]+$/;

function Abonent(phone, name, email) {
    this.phone = phone.trim();
    this.name = name.trim();
    if (email !== undefined) {
        this.email = email.trim();
    } else {
        this.email = email;
    }
}

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
    var abonent = new Abonent(phone, name, email);
    if (!isDuplicated(phone)) {
        phoneBook.push(abonent);

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
    if (!isCorrectInput(phone, name, email) && mySearch(phone)) {
        return false;
    }
    function changing(item) {
        if (item.phone === phone) {
            return new Abonent(phone, name, email);
        }

        return item;
    }
    phoneBook = phoneBook.map(changing);

    return true;
};

function isString(query) {
    if (typeof(query) !== 'string' || query === '') {

        return false;
    }

    return true;
}

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
        if (email !== undefined) {
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
    var data = csv.split('\n');
    var counter = 0;
    for (var i = 0; i < data.length; i++) {
        var sData = data[i].split(';');
        if (!isCorrectInput(sData[1], sData[0], sData[2]) || sData.length > 3) {
            continue;
        }
        if (exports.find(sData[1]).length !== 0) {
            exports.update(sData[1], sData[0], sData[2]);
            counter++;
        } else {
            exports.add(sData[1], sData[0], sData[2]);
            counter++;
        }
    }

    return counter;
};

function isCorrectInput(phone, name, email) {
    if (isEmpty(phone) || isEmpty(name)) {

        return false;
    }
    if (isCorrectPhone(phone) && isCorrectName(name) && isCorrectEmail(email)) {

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
    var reg = phone.match(rPhone);
    if (reg.length === 10) {

        return true;
    }

    return false;
}

function isCorrectName(name) {
    if (regExpName.test(name)) {

        return true;
    }

    return false;
}

function isCorrectEmail(email) {
    if (!isEmpty(email)) {

        return true;
    }
    if (email !== null && email === undefined) {

        return true;
    }

    return false;
}

function isDuplicated(phone) {
    if (phoneBook.length !== 0 && mySearch(phone)) {

        return true;
    }

    return false;
}

/**
 * @param {String} phone
 * @returns {Boolean} isFound
 */
function mySearch(phone) {
    function searsh(item) {

        return item.phone === phone;
    }

    return phoneBook.some(searsh);
}
