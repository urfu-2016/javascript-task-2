'use strict';

exports.isStar = true;

var phoneBook = [];

function compareFunction(a, b) {
    if (a._name < b._name) {
        return -1;
    }
    if (a._name > b._name) {
        return 1;
    }

    return 0;
}

function isConstains(i, object) {
    if (i._phone === object._phone || i._name === object._name || i._email === object._email) {
        return true;
    }

    return false;
}

function isFound(i, q) {
    var email = String(i._email);
    var phone = String(i._phone);
    var name = String(i._name);
    if (email.indexOf(q) !== -1 || phone.indexOf(q) !== -1 || name.indexOf(q) !== -1) {
        return true;
    }

    return false;
}

function isString(m) {
    if (m === '' || typeof m === 'undefined' || m === null) {
        return false;
    }

    return true;
}

function isCorrectPhone(phone1) {
    var phone = String(phone1);
    var reg = '[0123456789]{10}';
    if (!phone.match(reg) || phone.length !== 10) {
        return false;
    }

    return true;
}

function isEmail(email, x) {
    if (isString(email)) {
        return x + ', ' + email;
    }

    return x;
}

function isCorrectEmail(email) {
    var mail = String(email);
    if (mail.indexOf('@') !== -1 || email === '') {
        return true;
    }

    return false;
}

function isCorrectQuery(i, query) {
    if (isFound(i, query) || query === '*') {
        return true;
    }

    return false;
}

function parsePhone(phone) {
    var str = phone;
    var x1 = str.substring(0, 3);
    var x2 = str.substring(3, 6);
    var x3 = str.substring(6, 8);
    var x4 = str.substring(8, 10);

    return ', +7 (' + x1 + ') ' + x2 + '-' + x3 + '-' + x4;
}

exports.add = function (phone, name, email) {
    var object = {
        _phone: phone,
        _name: name,
        _email: email
    };
    if (!isString(name)) {
        return false;
    }
    if (!isCorrectPhone(phone)) {
        return false;
    }
    if (!isCorrectEmail(email)) {
        return false
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (isConstains(phoneBook[i], object)) {
            return false;
        }
    }
    phoneBook.push(object);

    return true;
};

exports.update = function (phone, name, email) {
    if (!isString(name)) {
        return false;
    }
    if (!isCorrectEmail(email)) {
        return false
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i]._phone === phone) {
            phoneBook[i]._name = name;
            phoneBook[i]._email = email;

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    if (query === '') {
        return 0;
    }
    var t = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (isCorrectQuery(phoneBook[i], query)) {
            phoneBook.splice(i, 1);
            i = i - 1;
            t = t + 1;
        }
    }

    return t;
};

exports.find = function (query) {
    var arr = [];
    var phoneBook1 = phoneBook.sort(compareFunction);
    if (query === '') {
        return '';
    }
    for (var i = 0; i < phoneBook1.length; i++) {
        if (isCorrectQuery(phoneBook1[i], query)) {
            var x = parsePhone(phoneBook1[i]._phone);
            x = isEmail(phoneBook[i]._email, x);
            arr.push(phoneBook1[i]._name + x);
        }
    }

    return arr;
};

exports.importFromCsv = function (csv) {
    var csv1 = csv.split('\n');
    var t = 0;
    for (var i = 0; i < csv1.length; i++) {
        var str = csv1[i].split(';');
        if (exports.add(str[1], str[0], str[2]) === true) {
            t = t + 1;
        } else if (exports.update(str[1], str[0], str[2]) === true) {
            t = t + 1;
        }
    }

    return t;
};
