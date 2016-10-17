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
var phoneRegExp = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;
//var nameRegExp = /^[a-zA-Zа-яА-Я ]+$/;
//var emailRegExp = /^([a-zA-Z0-9_]+)@([a-zA-Z0-9_]+).([a-zA-Z0-9_]+)$/;

function phoneFormat(phone) {
    var phoneMatch = phone.match(phoneRegExp);

    return '+7 (' + phoneMatch[1] + ') ' + phoneMatch[2] +
        '-' + phoneMatch[3] + '-' + phoneMatch[4];
}

function createSign(phone, name, email) {
    var sign;
    if (email === undefined) {
        sign = {
            iPhone: phone,
            iName: name
        };
    } else {
        sign = {
            iPhone: phone,
            iName: name,
            iEmail: email
        };
    }

    return sign;
}

function findPhone(phone) {
    var bookLen = phoneBook.length;
    for (var i = 0; i < bookLen; i++) {
        if (phone === phoneBook[i].iPhone) {
            return true;
        }
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – если операция прошла успешна - true, иначе - false
 */
exports.add = function (phone, name, email) {
    try {
        if ((name.match(/.+/) === null) ||
            (phone.match(phoneRegExp) === null)) {
            throw new TypeError();
        }
        if (findPhone(phone)) {
            return false;
        }
        var sign = createSign(phone, name, email);
        phoneBook.push(sign);

        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – если операция прошла успешна - true, иначе - false
 */
exports.update = function (phone, name, email) {
    try {
        if ((name.match(/.+/) === null) ||
            (phone.match(phoneRegExp) === null)) {
            throw new TypeError();
        }
        var del = exports.findAndRemove(phone);
        if (del === 0) {
            return false;
        }
        phoneBook.push(createSign(phone, name, email));

        return true;
    } catch (e) {
        return false;
    }
};

function findSubString(query, sign) {
    if (query === '') {
        return false;
    }
    if (query === '*') {
        return true;
    }
    var keys = Object.keys(sign);
    var keysLen = keys.length;
    for (var i = 0; i < keysLen; i++) {
        if (sign[keys[i]].indexOf(query) !== -1) {
            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} – количество удаленных записей
 */
exports.findAndRemove = function (query) {
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        var count = phoneBook.length;
        phoneBook = [];

        return count;
    }
    var countOfDelSigns = 0;
    var bookLen = phoneBook.length;
    for (var i = bookLen - 1; i >= 0; i--) {
        if (findSubString(query, phoneBook[i])) {
            phoneBook.splice(i, 1);
            countOfDelSigns++;
        }
    }

    return countOfDelSigns;
};

function signToStr(sign) {
    var values = [];
    values.push(sign.iName);
    values.push(phoneFormat(sign.iPhone));
    if (sign.iEmail !== undefined) {
        values.push(sign.iEmail);
    }

    return values.join(', ');
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} – список нужных записей
 */
exports.find = function (query) {
    var result = [];
    var bookLen = phoneBook.length;
    for (var i = 0; i < bookLen; i++) {
        if (findSubString(query, phoneBook[i])) {
            result.push(signToStr(phoneBook[i]));
        }
    }
    result.sort();

    return result;
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
    var countOfNewSigns = 0;
    var countOfRefreshSigns = 0;
    var csvList = csv.split('\n');
    var csvLen = csvList.length;
    for (var i = 0; i < csvLen; i++) {
        var address = csvList[i].split(';');
        var phone = address[1];
        var name = address[0];
        var email = address[2];
        if ((findPhone(phone)) && (exports.update(phone, name, email))) {
            countOfNewSigns++;
        }
        if (exports.add(phone, name, email)) {
            countOfRefreshSigns++;
        }
    }

    return countOfNewSigns + countOfRefreshSigns;
};
