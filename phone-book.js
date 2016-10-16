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

function isValidation(phone, name, email) {
    var re = /^\d{10}$/;
    if (re.test(phone) && name !== undefined && name.length > 0 &&
        typeof name === 'string' &&
        (typeof email === 'string' || email === undefined)) {

        return true;
    }

    return false;
}

function isHave(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone.toString()) {

            return false;
        }
    }

    return true;
}

function getContact(contact) {
    var correctEmail = '';
    var newPhone = '+7 (' + contact.phone.slice(0, 3) +
        ') ' + contact.phone.slice(3, 6) +
        '-' + contact.phone.slice(6, 8) +
        '-' + contact.phone.slice(-2);
    if (contact.email !== undefined) {
        correctEmail = ', ' + contact.email;
    }

    return contact.name + ', ' + newPhone + correctEmail;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if (isValidation(phone, name, email) && isHave(phone)) {
        phoneBook.push({ 'phone': phone.toString(),
            'name': name,
            'email': email });

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
    if (!isValidation(phone, name, email)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone.toString()) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

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
    var contactsWithQuery = exports.find(query);
    phoneBook = phoneBook.filter(function (contacts) {
        return contactsWithQuery.indexOf(getContact(contacts)) === -1;
    });

    return contactsWithQuery.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var contacts = [];
    if (query === '') {

        return contacts;
    }
    if (query === '*') {
        contacts = phoneBook.map(getContact).sort();

        return contacts;
    }
    contacts = phoneBook.filter(function (item) {
        return item.phone.toString().indexOf(query) !== -1 ||
                item.name.indexOf(query) !== -1 ||
            (item.email !== undefined &&
            item.email.indexOf(query) !== -1);
    });

    return contacts.map(getContact).sort();
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
