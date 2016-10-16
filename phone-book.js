'use strict';

exports.isStar = true;

var phoneBook = [];

function isValidPhone(phone) {
    return typeof(phone) === 'string' && /^(\d){10}$/.test(phone);
}

function isValidEmail(email) {
    if (email === undefined) {
        return true;
    }

    return typeof(email) === 'string' && email !== '' && email.indexOf('@') !== -1;
}

function isValidName(name) {
    return typeof(name) === 'string' && name !== undefined && name !== '';
}

function checkExists(value, phone) {
    return value.phone === phone;
}

exports.add = function (phone, name, email) {
    if (isValidPhone(phone) && isValidName(name) && isValidEmail(email)) {
        var samePhones = phoneBook.filter(function (value) {
            return checkExists(value, phone);
        });
        if (samePhones.length === 0) {
            phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

            return true;
        }
    }

    return false;
};

function updateField(value, phone, name, email) {
    if (value.phone === phone) {
        value.name = name;
        value.email = email;
    }

    return value;
}

exports.update = function (phone, name, email) {
    if (isValidPhone(phone) && isValidName(name) && isValidEmail(email)) {
        var updatedFields = phoneBook.map(function (value) {
            return updateField(value, phone, name, email);
        });
        phoneBook = updatedFields;

        return true;
    }

    return false;
};

exports.findAndRemove = function (query) {
    if (isValidQuery(query)) {
        var otherFields = phoneBook.filter(function (value) {
            return !findQuery(value, query);
        });
        var diff = phoneBook.length - otherFields.length;
        phoneBook = otherFields;

        return diff;
    }

    return 0;
};

function isValidQuery(query) {
    return typeof(query) === 'string' && query.length > 0;
}

function findQuery(value, query) {
    if (value.email !== undefined) {
        return value.phone.indexOf(query) !== -1 ||
                value.name.indexOf(query) !== -1 ||
                value.email.indexOf(query) !== -1;
    }

    return value.phone.indexOf(query) !== -1 ||
            value.name.indexOf(query) !== -1;
}

function convertForHumans(value) {
    if (value.email !== undefined) {
        return value.name + ', +7 (' +
            value.phone.substring(0, 3) + ')' +
            value.phone.substring(3) + ', ' +
            value.email;
    }

    return value.name + ', +7 (' +
        value.phone.substring(0, 3) + ')' +
        value.phone.substring(3);

}

exports.find = function (query) {
    if (isValidQuery(query)) {
        if (query === '*') {
            return phoneBook.map(convertForHumans).sort();
        }
        var foundMatches = phoneBook.filter(function (value) {
            return findQuery(value, query);
        });

        return foundMatches.map(convertForHumans).sort();
    }

    return [];
};

function isValidCSV(csv) {
    return typeof(csv) === 'string' && csv.length > 0 &&
            csv.indexOf(';') !== -1;
}

function tryToAdd(value) {
    var name = value.split(';')[0];
    var phone = value.split(';')[1];
    var email = value.split(';')[2];
    exports.add(phone, name, email);
}

function tryToUpdate(value) {
    var name = value.split(';')[0];
    var phone = value.split(';')[1];
    var email = value.split(';')[2];
    exports.update(phone, name, email);
}

exports.importFromCsv = function (csv) {
    if (isValidCSV(csv)) {
        var fields = csv.split('\n');
        fields.forEach(function processField(value) {
            tryToAdd(value);
            tryToUpdate(value);
        });

        return phoneBook.length;
    }

    return 0;
};
