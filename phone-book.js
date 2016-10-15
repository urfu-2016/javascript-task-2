'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook;

exports.add = function (phone, name, email) {
    checkPhoneBook();
    if (!name || !phone ||
    phone.length !== 10) {

        return false;
    }
    if (this.find(phone).length) {
        return false;
    }
    var contact = { phone: phone, name: name, email: email };
    if (!email) {
        contact.email = '';
    }
    phoneBook.push(contact);
    phoneBook.sort(function (a, b) {
        return Number(a.phone) - Number(b.phone);
    });

    return true;
};

function checkPhoneBook() {
    if (!phoneBook) {
        phoneBook = [];
    }
}

exports.update = function (phone, name, email) {
    if (Number(phone) && phone.length === 10) {
        phoneBook.forEach(function (contact) {
            if (contact.phone === phone) {
                contact.name = name;
                contact.email = email;
                if (!email) {
                    contact.email = '';
                }

                return true;
            }
        });
    }

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
    if (!query.length) {
        return [];
    }
    if (query === '*') {
        return phoneBook.map(format).sort();
    }
    var response = [];
    phoneBook.forEach(function (contact) {
        if (contact.phone.search(query) !== -1 ||
        contact.name.search(query) !== -1 ||
        contact.email.search(query) !== -1) {
            response.push(contact);
        }
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
        '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8, 10) +
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
    var nowCount = phoneBook.length;
    contacts.forEach(function (contact) {
        var newContact = contact.split(';');
        if (exports.find(newContact[1]).length) {
            exports.update(newContact[1], newContact[0], newContact[2]);
        } else {
            exports.add(newContact[1], newContact[0], newContact[2]);
        }
    });

    return phoneBook.length - nowCount;
};
