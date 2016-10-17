'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = Object();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (checkName(name) && checkPhone(phone)) {
        if (!phoneBook[phone]) {
            createContact(phone, name, email);

            return true;
        }
    }

    return false;
};

function createContact(phone, name, email) {
    var contact = Object();
    contact.name = name;
    contact.email = email;
    phoneBook[phone] = contact;
}

function checkName(name) {

    return name !== undefined && typeof name === 'string' &&
     name.length > 0;
}

function checkPhone(phone) {
    var reg = /\d{10}/;

    return reg.test(phone) && phone.length === 10 &&
    undefinedNaNPhone(phone);
}

function undefinedNaNPhone(phone) {

    return phone !== undefined && !isNaN(parseInt(phone));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (checkName(name) && phoneBook[phone]) {
        phoneBook[phone].name = name;
        if (email === undefined) {
            delete phoneBook[phone].email;

            return true;
        }
        phoneBook[phone].email = email;

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {int}
 */
exports.findAndRemove = function (query) {
    var records = this.find(query);
    var length = records.length;
    for (var j = 0; j < records.length; j++) {
        var phone = records[j].split(',')[1];
        phone = phone.replace('+7 ', '');
        phone = phone.replace('(', '');
        phone = phone.replace(') ', '');
        phone = phone.replace('-', '');
        phone = phone.replace('-', '');
        delete phoneBook[phone];

        return length;
    }
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var records = [];
    if (!checkQuery) {

        return records;
    }

    return findRecords(query);
};

function findRecords(query) {
    var records = [];
    var contactProperties = [];
    var properties = Object.getOwnPropertyNames(phoneBook);
    if (query === '*') {
        records = findAll(records, contactProperties);

        return records;
    }
    for (var i = 0; i < properties.length; i++) {
        contactProperties = Object.getOwnPropertyNames(phoneBook[properties[i]]);
        if (properties[i].indexOf(query) > -1) {
            records = ifEmail(contactProperties, properties, i, records);
            continue;
        }
        for (var j = 0; j < contactProperties.length; j++) {
            records = records.concat(checkProperties(i, j, query));
        }
    }

    return records.sort();
}

function checkProperties(i, j, query) {
    var records = [];
    var properties = Object.getOwnPropertyNames(phoneBook);
    var contactProperties = Object.getOwnPropertyNames(phoneBook[properties[i]]);
    if ((phoneBook[properties[i]][contactProperties[j]]).indexOf(query) > -1) {
        var record = phoneBook[properties[i]].name + ', ' + toChangePhone(properties[i]) +
         ', ' + phoneBook[properties[i]].email;
        records.push(record);
    }

    return records;
}

function checkQuery(query) {
    if (typeof query === 'string' && query.length !== 0) {
        return true;
    }

    return false;
}

function findAll(records, contactProperties) {
    var properties = Object.getOwnPropertyNames(phoneBook);
    for (var k = 0; k < properties.length; k++) {
        contactProperties = Object.getOwnPropertyNames(phoneBook[properties[k]]);
        records = ifEmail(contactProperties, properties, k, records);
    }
    records.sort();

    return records;
}

function ifEmail(contactProperties, properties, i, records) {
    var record = '';
    if (contactProperties.indexOf('email') > -1) {
        record = phoneBook[properties[i]].name + ', ' + toChangePhone(properties[i]) +
         ', ' + phoneBook[properties[i]].email;
        records.push(record);
    } else {
        record = phoneBook[properties[i]].name + ', ' + toChangePhone(properties[i]);
        records.push(record);
    }

    return records;
}

function toChangePhone(phone) {
    var ph = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6);
    ph += '-' + phone.slice(6, 8) + '-' + phone.slice(8);

    return ph;
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
