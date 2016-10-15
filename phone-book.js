'use strict';


exports.isStar = true;

var phoneBook = [];

function isValidPhone(phone) {
    var validPhone = /\d{10}/;

    return validPhone.test(phone);
}

function isValidEmail(email) {
    var validEmail = /\w+@\w+-?\w+.\w{2,255}/;

    return validEmail.test(email) || email === undefined;
}

function getFormattedPhone(phone) {
    var phoneRegEx = /(\d{3})(\d{3})(\d{2})(\d{2})/;

    return phone.replace(phoneRegEx, '+7 ($1) $2-$3-$4');
}

function isValidRecord(phone, name, email) {
    return isValidPhone(phone) && isValidEmail(email) &&
        typeof name === 'string' && name;
}

function findRecordIndex(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

function isQueryInRecord(query, record) {
    for (var property in record) {
        if (record[property].indexOf(query) !== -1) {
            return true;
        }
    }

    return false;
}

function normalizeQuery(query) {
    if (query === '*') {
        return '';
    }

    if (query === '') {
        return '\0';
    }

    return query;
}

exports.add = function (phone, name, email) {
    if (isValidRecord(phone, name, email) && findRecordIndex(phone) === -1) {
        phoneBook.push({
            phone: phone,
            name: name,
            email: email
        });

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (isValidRecord(phone, name, email)) {
        var index = findRecordIndex(phone);
        if (index !== -1) {
            var toEdit = phoneBook[index];
            toEdit.name = name;
            toEdit.email = email;
            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    query = normalizeQuery(query);
    var sourceLength = phoneBook.length;
    phoneBook = phoneBook.filter(function(item) {

        return !isQueryInRecord(query, item);
    });

    return sourceLength - phoneBook.length;
};

exports.find = function (query) {
    query = normalizeQuery(query);

    return phoneBook.filter(function(item) {
        return isQueryInRecord(query, item);
    }).map(function(item) {
        return [item.name, getFormattedPhone(item.phone), item.email].join(', ');
    })
        .sort()
        .join('\n');
};

exports.importFromCsv = function (csv) {
    return csv.split('\n').reduce(function(acc, item) {
        var args = item.split(';');
        var phone = args[1];
        var name = args[0];
        var email = args[2];
        
        return acc + exports.add(phone, name, email) || exports.update(phone, name, email);
    }, 0);
};
