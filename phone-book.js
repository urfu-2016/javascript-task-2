'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = {};

/**
 * Проверка телефонного номера по формату  5556667788
 * @param {String} phone
 *  @returns {Bool}
 */
function checkPhone(phone) {
    if (!phone) {

        return false;
    }
    var re = /[0-9]{10}/;
    if (!phone.match(re)) {

        return false;
    }

    return true;
}

// function checkEmail(email) {
//     // if (!email) {

//     //     return true;
//     // }
//     // var re = /[\wа-я.-]+@[a-zа-я0-9]+[a-zа-я0-9.-]*[a-zа-я0-9]+\.[a-zа-я]+/i;
//     // if (!email.match(re)) {

//     //     return false;
//     // }

//     return true;
// }

/**
 * Перевод из формата  5556667788 в +7 (555) 666-77-88
 * @param {String} phone
 *  @returns {String}
 */
function formatPhone(phone) {

    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
}


function queryAppropriate(query, phone) {
    var email = phoneBook[phone].email;
    var name = phoneBook[phone].name;
    if (phone.match(query) || (email && email.match(query)) ||
        name.match(query)) {

        return true;
    }

    return false;
}

function escapeRegExp(str) {

    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
function findPhones(query) {
    if (!query) {
        return [];
    }
    if (query === '*') {

        return Object.keys(phoneBook);
    }
    query = escapeRegExp(query);
    query = new RegExp('(.*)' + query + '(.*)');
    var result = [];
    for (var phone in phoneBook) {
        if (phone && queryAppropriate(query, phone)) {
            result.push(phone);
        }
    }

    return result;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 *  @returns {Bool}
 */
exports.add = function (phone, name, email) {
    if (!checkPhone(phone)) {

        return false;
    }

    // if (!checkEmail(email)) {

    //     return false;
    // }
    if (phone in phoneBook) {

        return false;
    }
    if (!name) {

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
  *  @returns {Bool}
 */

exports.update = function (phone, name, email) {
    if (!checkPhone(phone)) {

        return false;
    }

    // if (!checkEmail(email)) {

    //     return false;
    // }

    if (!(phone in phoneBook)) {

        return false;
    }

    if (!name) {
        return false;
    }

    if (email && email === '') {

        return false;
    }
    // if (phoneBook[phone].name === name &&
    //     phoneBook[phone].email === email) {

    //     return false;
    // }
    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var phones = findPhones(query);
    var phonesToDelete = [];
    for (var i in phones) {
        if (i) {
            var phone = phones[i];
            phonesToDelete.push(phone);
        }
    }
    for (var j = 0; j < phonesToDelete.length; j++) {
        delete phoneBook[phonesToDelete[j]];
    }

    return phones.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
  * @returns {Array}
 */
exports.find = function (query) {
    var result = [];
    var phones = findPhones(query);
    for (var i in phones) {
        if (!i) {
            break;
        }
        var phone = phones[i];
        var email = phoneBook[phone].email;
        var name = phoneBook[phone].name;
        var list = [];
        list.push(name);
        list.push(formatPhone(phone));
        if (email) {
            list.push(email);
        }
        result.push(list.join(', '));
    }

    return result.sort();
};


// function checkCsvDataLength(data) {
//     if (data.length < 2 || data.length > 3) {

//         return false;
//     }

//     return true;
// }

// function checkCsv(csv) {
//     if (!csv || typeof csv !== 'string') {

//         return false;
//     }

//     return true;
// }

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
    if (typeof csv !== 'string') {

        return 0;
    }
    var csvArray = csv.split('\n');
    var n = 0;
    csvArray.forEach(function (elem) {
        if (elem.split(';').length === 3 || elem.split(';').length === 2) {
            var name = elem.split(';')[0];
            var phone = elem.split(';')[1];
            var email = elem.split(';')[2];
            if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
                n++;
            }
        }
    });

    return n;
};
