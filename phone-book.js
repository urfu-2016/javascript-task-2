'use strict';

exports.isStar = true;

var phoneBook = [];

function isValidPhone(phone) {
    return /^(\d)\1{2}(\d)\2{2}(\d)\3{1}(\d)\4{1}$/.test(phone);
}

function checkInput(phone, name, email) {
    return typeof phone === 'string' && isValidPhone(phone) &&
           typeof name === 'string' && name !== '' &&
           (email === undefined ||
            typeof email === 'string' && email !== '');
}

function formatPhone(phone) {
    return '+7 (' + phone.substring(0, 3) +
           ') ' + phone.substring(3, 6) +
           '-' + phone.substring(6, 8) +
           '-' + phone.substring(8, 10);
}

function getContactByPhone(phone) {
    return phoneBook.find(
        function (element) {
            return element.phone === phone;
        }
    );
}

function formatContact(contact) {
    var result = contact.name + ', ' + formatPhone(contact.phone);
    if (contact.email !== undefined) {
        result += ', ' + contact.email;
    }

    return result;
}

function isStringInContact(contact, string) {
    return contact.phone.indexOf(string) !== -1 ||
           contact.name.indexOf(string) !== -1 ||
           contact.email !== undefined &&
           contact.email.indexOf(string) !== -1;
}

exports.add = function (phone, name, email) {
    if (!checkInput(phone, name, email) ||
        getContactByPhone(phone) !== undefined) {
        return false;
    }

    phoneBook.push({
        'phone': phone,
        'name': name,
        'email': email
    });

    return true;
};

exports.update = function (phone, name, email) {
    if (!checkInput(phone, name, email)) {
        return false;
    }

    var contact = getContactByPhone(phone);
    if (contact === undefined) {
        return false;
    }

    contact.name = name;
    contact.email = email;

    return true;
};

exports.findAndRemove = function (query) {
    if (query === '*') {
        var result = phoneBook.length;
        phoneBook = [];

        return result;
    }
    if (typeof query !== 'string' || query === '') {
        return 0;
    }

    var originalLength = phoneBook.length;
    phoneBook = phoneBook.filter(
        function (element) {
            return !isStringInContact(element, query);
        }
    );

    return originalLength - phoneBook.length;
};

exports.find = function (query) {
    if (query === '*') {
        return phoneBook.map(formatContact).sort();
    }
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    return phoneBook
        .filter(
            function (element) {
                return isStringInContact(element, query);
            }
        )
        .map(formatContact)
        .sort();
};

function addOrUpdate(phone, name, email) {
    return exports.add(phone, name, email) ||
           exports.update(phone, name, email);
}

exports.importFromCsv = function (csv) {
    if (typeof csv !== 'string') {
        return 0;
    }

    var added = 0;
    csv = csv.split('\n');
    for (var i = 0; i < csv.length; i++) {
        var parts = csv[i].split(';');
        if (parts.length > 3) {
            continue;
        }

        if (addOrUpdate(parts[1], parts[0], parts[2])) {
            added++;
        }
    }

    return added;
};
