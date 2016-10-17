'use strict';

/**
 * Naaeaii caaaiea ia caacai?eo
 * ?aaeeciaai iaoia importFromCsv
 */
exports.isStar = false;

/**
 * Oaeaoiiiay eieaa
 */
var phoneBook = [];

/**
 * Aiaaaeaiea caiene a oaeaoiiio? eieao
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */

function checkPhoneBook(phone) {
    for (var index = 0; index < phoneBook.length; index++) {
        if (phoneBook[index].phone === phone) {
            return false;
        }
    }

    return true;
}


exports.add = function (phone, name, email) {
    if (checkName(name) && checkPhone(phone)) {
        if (checkPhoneBook(phone)) {
            phoneBook.push(createContact(phone, name, email));

            return true;
        }
    }

    return false;
};


function createContact(phone, name, email) {
    var contact = Object();
    contact.name = name;
    contact.phone = phone;
    if (email !== undefined) {
        contact.email = email;
    }

    return contact;
}


function checkName(name) {

    return name !== undefined && typeof name === 'string' &&
        name.length !== 0;
}

function checkPhone(phone) {
    var reg = /\d{10}/g;

    return reg.test(phone) && phone.length === 10 &&
        undefinedNaNPhone(phone);
}

function undefinedNaNPhone(phone) {

    return phone !== undefined && !isNaN(Number(phone));
}

/**
 * Iaiiaeaiea caiene a oaeaoiiiie eieaa
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */

exports.update = function (phone, name, email) {
    if (!checkName(name) || !checkPhone(phone)) {
        return false;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = createContact(phone, name, email);

            return true;
        }
    }

    return false;
};

/**
 * Oaaeaiea caienae ii cai?ino ec oaeaoiiiie eieae
 * @param {String} query
 * @returns {int}
 */
exports.findAndRemove = function (query) {
    if (query === '') {

        return 0;
    }
    var newPhoneBook = [];
    for (var index = 0; index < phoneBook.length; index++) {
        if (!isFindNote(index, query) && query !== '*') {
            newPhoneBook.push(phoneBook[index]);
        }
    }
    var count = phoneBook.length - newPhoneBook.length;
    phoneBook = newPhoneBook;

    return count;
};

function isFindNote(index, query) {
    var contact = phoneBook[index];
    if (contact.hasOwnProperty('email')) {
        return (contact.phone.indexOf(query) !== -1 ||
        contact.email.indexOf(query) !== -1 ||
        contact.name.indexOf(query) !== -1);
    }

    return (contact.phone.indexOf(query) !== -1 ||
    contact.name.indexOf(query) !== -1);
}

function createClient(contact) {
    var answer = contact.name + ', ' + toChangePhone(contact.phone);
    if (contact.hasOwnProperty('email')) {
        answer += ', ' + contact.email;
    }

    return answer;
}

exports.find = function (query) {
    if (!checkQuery) {

        return [];
    }

    var newPhoneBook = [];
    for (var index = 0; index < phoneBook.length; index++) {
        if (isFindNote(index, query) || query === '*') {
            var client = phoneBook[index];
            newPhoneBook.push(createClient(client));
        }

    }

    return newPhoneBook.sort();
};


function checkQuery(query) {
    if (typeof query === 'string' && query.length !== 0) {
        return true;
    }

    return false;
}


function toChangePhone(phone) {
    var ph = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6);
    ph += '-' + phone.slice(6, 8) + '-' + phone.slice(8);

    return ph;
}

/**
 * Eiii?o caienae ec csv-oi?iaoa
 * @star
 * @param {String} csv
 * @returns {Number} – eiee?anoai aiaaaeaiiuo e iaiiaeaiiuo caienae
 */
exports.importFromCsv = function (csv) {
    var recordsNumber = 0;
    var records = csv.split('\n');
    var length = records.length;
    for (var i = 0; i < length; i++) {
        var record = records[i].split(';');
        var name = record[0];
        var phone = record[1];
        var email = record[2];
        var check = exports.update(phone, name, email) || exports.add(phone, name, email);
        if (check) {
            recordsNumber += 1;
        }
    }

    return recordsNumber;
};