'use strict';

/**
 * Ñäåëàíî çàäàíèå íà çâåçäî÷êó
 * Ðåàëèçîâàí ìåòîä importFromCsv
 */
exports.isStar = true;

/**
 * Òåëåôîííàÿ êíèãà
 */
var phoneBook = Object();

/**
 * Äîáàâëåíèå çàïèñè â òåëåôîííóþ êíèãó
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
    if (email !== undefined) {
        contact.email = email;
        phoneBook[phone] = contact;
    } else {
        phoneBook[phone] = contact;
    }
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

    return phone !== undefined && !isNaN(Number(phone));
}

/**
 * Îáíîâëåíèå çàïèñè â òåëåôîííîé êíèãå
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (checkName(name) && checkPhone(phone) && phoneBook[phone]) {
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
 * Óäàëåíèå çàïèñåé ïî çàïðîñó èç òåëåôîííîé êíèãè
 * @param {String} query
 * @returns {int}
 */
exports.findAndRemove = function (query) {
    if (query === '') {

        return 0;
    }
    var contactProperties = [];
    var count = 0;
    var properties = Object.getOwnPropertyNames(phoneBook);
    for (var i = 0; i < properties.length; i++) {
        contactProperties = Object.getOwnPropertyNames(phoneBook[properties[i]]);
        if (isFindNote(properties[i], contactProperties, query) || query === '*') {
            count++;
            delete phoneBook[properties[i]];
        }
    }

    return count;
};

function isFindNote(phone, contactProperties, query) {
    if (contactProperties.indexOf('email') !== -1) {
        return (phone.indexOf(query) !== -1 ||
        phoneBook[phone].email.indexOf(query) !== -1 ||
        phoneBook[phone].name.indexOf(query) !== -1);
    }

    return (phone.indexOf(query) !== -1 ||
    phoneBook[phone].name.indexOf(query) !== -1);
}

function createClient(phone, contactProperties) {
    var answer = phoneBook[phone].name + ', ' + toChangePhone(phone);
    if (contactProperties.indexOf('email') !== -1) {
        answer += ', ' + phoneBook[phone].email;
    }

    return answer;
}

exports.find = function (query) {
    var records = [];
    var contactProperties = [];
    var newPhoneBook = [];
    if (!checkQuery) {

        return records;
    }

    var properties = Object.getOwnPropertyNames(phoneBook);
    for (var i = 0; i < properties.length; i++) {
        contactProperties = Object.getOwnPropertyNames(phoneBook[properties[i]]);
        if (isFindNote(properties[i], contactProperties, query) || query === '*') {
            newPhoneBook.push(createClient(properties[i], contactProperties));
        }
    }

    return newPhoneBook.sort();
};


function checkQuery(query) {
    if (typeof query === 'string' && query.length > 0) {
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
 * Èìïîðò çàïèñåé èç csv-ôîðìàòà
 * @star
 * @param {String} csv
 * @returns {Number} – êîëè÷åñòâî äîáàâëåííûõ è îáíîâëåííûõ çàïèñåé
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
