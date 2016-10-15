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

exports.add = function (phone, name, email) {
    if (checkInput(phone, name, email) ||
        !(typeof email === 'string' || email === undefined)) {

        return false;
    }
    if (this.find(phone).length) {
        return false;
    }
    var contact = { phone: phone.toString(), name: name, email: email };
    phoneBook.push(contact);

    return true;
};

function checkInput(phone, name) {
    return !name ||
        !phone || name === null ||
        typeof name !== 'string' || !(/^\d{10}$/.test(phone));
}

exports.update = function (phone, name, email) {
    if (checkInput(phone, name) ||
        !(typeof email === 'string' || email === undefined)) {
        return false;
    }
    phoneBook.forEach(function (contact) {
        if (contact.phone === phone) {
            contact.name = name;
            contact.email = email;
            if (!email) {
                contact.email = '';
            }
        }
        return true;
    });

    return false;
};

exports.findAndRemove = function (query) {
    var deleteCollection = this.find(query);
    phoneBook = phoneBook.filter(function (contacts) {
        return deleteCollection.indexOf(format(contacts)) === -1;
    });

    return deleteCollection.length;
};

exports.find = function (query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return phoneBook.map(format).sort();
    }
    var response = phoneBook.filter(function (contact) {
        return contact.phone.toString().indexOf(query) !== -1 ||
            contact.name.indexOf(query) !== -1 ||
            (contact.email !== undefined && contact.email.indexOf(query) !== -1);
    });

    return response.map(format).sort();
};

function format(contact) {
    var emailFormat = '';
    if (contact.email) {
        emailFormat += ', ' + contact.email;
    }
    var phone = contact.phone;

    return contact.name + ', ' +
        '+7 (' + phone.toString().slice(0, 3) + ') ' +
        phone.toString().slice(3, 6) + '-' +
        phone.toString().slice(6, 8) + '-' +
        phone.toString().slice(8, 10) +
        emailFormat;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var contacts = csv.split('\n');
    var firstCount = phoneBook.length;
    contacts.forEach(function (contact) {
        var newContact = contact.split(';');
        if (newContact.length === 2 || newContact.length === 3) {
            if (exports.find(newContact[1]).length &&
                newContact[1].length === 10) {
                exports.update(newContact[1], newContact[0], newContact[2]);
                firstCount --;
            } else {
                exports.add(newContact[1], newContact[0], newContact[2]);
            }
        }
    });

    return phoneBook.length - firstCount;
};
