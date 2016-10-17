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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!isHavePhone(phone)) {
        return update(phone, name, email);
    } else {
        return false;
    }
};

function isCorrectPhone(phone) {
    var re = /^\d{10}$/;

    return re.test(phone);
}

function isHavePhone(phone) {
    return Object.keys(phoneBook).indexOf(phone) !== -1;
}
/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = update;

function update (phone, name, email) {
    if (isCorrectPhone(phone) && name !== undefined) {
        phoneBook[phone] = {
            name: name
        };
        if (email !== undefined) {
            phoneBook[phone]['email'] = email;
        }

        return true;
    } else {
        return false;
    }
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var foundPhones = findPhones(query);
    for(var i in foundPhones) {
        delete phoneBook[foundPhones[i]];
    }

    return foundPhones.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var foundPhones = findPhones(query);
    for (var i in foundPhones) {
        var item = [phoneBook[foundPhones[i]].name, convertPhone(foundPhones[i])];
        if (phoneBook[foundPhones[i]].hasOwnProperty('email')) {
            item.push(phoneBook[foundPhones[i]].email);
        }
        foundPhones[i] = item;
    }
    foundPhones.sort(function(a, b) {return a[0] > b[0]});
    for (var index in foundPhones) {
        foundPhones[index] = foundPhones[index].join(', ');
    }

    return foundPhones;
};

function findPhones(query) {
    if (query === '') {
        return [];
    }
    var foundPhones = [];
    for (var phone in phoneBook) {
        if (query === '*' || isHasQuery(phone, query)) {
            foundPhones.push(phone);
        }
    }

    return foundPhones;
}

function isHasQuery (phone, query) {
    return (phone.indexOf(query) !== -1 || phoneBook[phone].name.indexOf(query) !== -1 ||
    (phoneBook[phone].hasOwnProperty('email') && phoneBook[phone].email.indexOf(query) !== -1));
}

function convertPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8);
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
    var items = csv.split('\n');
    var success = 0;
    for (var i in items) {
        var item = items[i].split(';');
        if (item.length === 2) {
            if (update(item[1], item[0])) {
                success++;
            }
        } else if (item.length === 3) {
            if (update(item[1], item[0], item[2])) {
                success++;
            }
        }
    }
    
    return success;
};
