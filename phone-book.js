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

function isValidation(phone, name) {
    var re = /^\d{10}$/;
    if (re.test(phone) && name) {

        return true;
    }

    return false;
}

function isHave(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var contact = phoneBook[i];
        if (contact.phone === phone) {

            return false;
        }
    }

    return true;
}

function sortByName(contacts) {
    contacts.sort(function (a, b) {
        if (a.name > b.name) {

            return 1;
        }
        if (a.name < b.name) {

            return -1;
        }

        return 0;
    });

    return contacts;
}

function getContacts(contacts) {
    for (var i = 0; i < phoneBook.length; i++) {
        var newPhone = '+7 (' + contacts[i].phone.slice(0, 3) +
            ') ' + contacts[i].phone.slice(3, 6) +
            '-' + contacts[i].phone.slice(6, 8) +
            '-' + contacts[i].phone.slice(-2);
        if (contacts[i].email) {
            contacts[i] = contacts[i].name +
                ', ' + newPhone +
                ', ' + contacts[i].email;
        } else {
            contacts[i] = contacts[i].name +
                ', ' + newPhone;
        }
    }

    return contacts;
}

function addContact(contacts, query) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone.indexOf(query) !== -1 ||
            phoneBook[i].name.indexOf(query) !== -1 ||
            phoneBook[i].email.indexOf(query) !== -1) {
            contacts.push(phoneBook[i]);
        }
    }
    contacts = sortByName(contacts);

    return getContacts(contacts);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if (isValidation(phone, name) && isHave(phone)) {
        if (email !== undefined) {
            phoneBook.push({ 'phone': phone, 'name': name, 'email': email });
        } else {
            phoneBook.push({ 'phone': phone, 'name': name, 'email': '' });
        }

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone && name && email !== undefined) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
        if (phoneBook[i].phone === phone && name) {
            phoneBook[i].name = name;
            phoneBook[i].email = '';

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {number}
 */
exports.findAndRemove = function (query) {
    var count = 0;
    var len = phoneBook.length;
    if (!query) {

        return count;
    }
    if (query === '*') {
        for (var j = 0; j < len; j++) {
            phoneBook.shift();
            count++;
        }

        return count;
    }
    count = phoneBook.length;
    phoneBook = phoneBook.filter(function (obj) {
        if (obj.phone.indexOf(query) === -1 &&
            obj.name.indexOf(query) === -1 &&
            obj.email.indexOf(query) === -1) {

            return true;
        }

        return false;
    });


    return count - phoneBook.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var contacts = [];
    if (!query) {

        return contacts;
    }
    if (query === '*') {
        for (var j = 0; j < phoneBook.length; j++) {
            contacts.push(phoneBook[j]);
        }
        contacts = sortByName(contacts);
        contacts = getContacts(contacts);

        return contacts;
    }
    contacts = addContact(contacts, query);

    return contacts;
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
    var count = 0;
    if (!csv) {
        return count;
    }
    var contactInfo = [];
    var contacts = csv.split('\n');
    for (var i = 0; i < contacts.length; i++) {
        contactInfo = contacts[i].split(';');
        if (exports.add(contactInfo[1], contactInfo[0], contactInfo[2]) ||
            exports.update(contactInfo[1], contactInfo[0], contactInfo[2])) {
            count++;
        }
    }

    return count;
};
