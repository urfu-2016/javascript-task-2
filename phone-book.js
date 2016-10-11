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
    var re = /(\d)\1{2}(\d)\2{2}(\d)\3{1}(\d)\4{1}/;
    if (phone.match(re) === null) {

        return false;
    }

    return true;
}

function checkEmail(email) {
    if (!email) {

        return true;
    }
    var re = /[\wа-я.-]+@[a-zа-я0-9]+[a-zа-я0-9.-]*[a-zа-я0-9]+\.[a-zа-я]+/i;
    if (email.match(re) === null) {

        return false;
    }

    return true;
}

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

function findPhones(query) {
    if (query === '' || query === undefined) {
        return [];
    }
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

    if (!checkEmail(email)) {

        return false;
    }

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

    if (!checkEmail(email)) {

        return false;
    }

    if (!(phone in phoneBook)) {

        return false;
    }

    if (!name) {
        return false;
    }

    if (phoneBook[phone].name === name &&
        phoneBook[phone].email === email) {

        return false;
    }
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
    for (var i in phones) {
        if (i) {
            var phone = phones[i];
            delete phoneBook[phone];
        }
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


function checkCsvDataLength(data) {
    if (data.length < 2 || data.length > 3) {

        return false;
    }

    return true;
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
    if (!csv) {
        return 0;
    }
    var contactList = csv.split('\n');
    for (var i = 0; i < contactList.length; i++) {
        var data = contactList[i].split(';');
        if (!checkCsvDataLength(data)) {
            contactList.splice(i, 1);
            continue;
        }
        var name = data[0];
        var phone = data[1];
        var email = data[2];
        if (!(module.exports.update(phone, name, email) ||
            module.exports.add(phone, name, email))) {
            contactList.splice(i, 1);
        }
    }

    return contactList.length;
};
