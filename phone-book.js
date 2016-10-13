'use strict';

exports.isStar = true;

var phoneBook = [];


function isCorrectPhone(phone) {
    return typeof phone === 'string' && /^(\d){10}$/.test(phone);
}

function phoneFormat(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) +
        '-' + phone.slice(8, 10);
}

function phoneToPrint(value) {
    var result = value.name + ', ' + phoneFormat(value.phone);
    if (value.email) {
        result += ', ' + value.email;
    }

    return result;
}

function searchToQuery(value, query) {
    return value.phone.indexOf(query) !== -1 ||
    value.name.indexOf(query) !== -1 || value.email.indexOf(query) !== -1;
}

function searchPhone(value, phone) {
    return value.phone === phone;
}

function getIndexNewPhone(phone) {
    return phoneBook.findIndex(
        function (value) {
            return searchPhone(value, phone);
        });
}

exports.add = function (phone, name, email) {
    if (isCorrectPhone(phone) && typeof name === 'string' &&
        (typeof email === 'string' || email === undefined) &&
        email !== '' && name !== '' && getIndexNewPhone(phone) === -1) {
        phoneBook.push({
            'name': name,
            'phone': phone,
            'email': email
        });

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (!name) {
        return false;
    }
    var newIndex = getIndexNewPhone(phone);
    if (newIndex !== -1) {
        phoneBook[newIndex].phone = phone;
        phoneBook[newIndex].name = name;
        if (email) {
            phoneBook[newIndex].email = email;
        } else {
            phoneBook[newIndex].email = '';
        }

        return true;
    }

    return false;
};

exports.findAndRemove = function (query) {
    var oldLen = phoneBook.length;
    if (query === '*') {
        phoneBook = [];
    } else {
        phoneBook = phoneBook.filter(
            function (value) {
                return !searchToQuery(value, query);
            });
    }
    var newLen = phoneBook.length;

    return oldLen - newLen;
};

exports.find = function (query) {
    if (!query) {

        return [];
    }

    if (query === '*') {

        return phoneBook.map(phoneToPrint).sort();
    }

    return phoneBook.filter(
        function (value) {
            return searchToQuery(value, query);
        })
    .map(phoneToPrint)
    .sort();
};

exports.importFromCsv = function (csv) {
    if (typeof csv !== 'string' || csv === '') {

        return 0;
    }
    var contacts = csv.split('\n').filter(
        function (contact) {
            contact = contact.split(';');
            if (contact.length > 3) {

                return false;
            }

            return exports.add(contact[1], contact[0], contact[2]) ||
                exports.update(contact[1], contact[0], contact[2]);
        });


    return contacts.length;
};
