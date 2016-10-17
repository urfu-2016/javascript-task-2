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
    if (i._phone === object._phone && i._name === object._name && i._email === object._email) {
        return true;
    }

    return false;
}

function isFound(i, q) {
    if (i._email === q && i._phone === q && i._name === q) {
        return false;
    }

    return true;
}

exports.add = function (phone, name, email) {
    var object = {
        _phone: phone,
        _name: name,
        _email: email
    };
    if (name === '' || typeof name === 'undefined') {
        return false;
    }
    if (phone.length !== 10) {
        return false;
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
    if (name === '') {
        return false;
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
    if (query === '*') {
        var x = phoneBook.length();
        phoneBook = [];

        return x;
    }
    var t = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (isFound(phoneBook[i], query)) {
            phoneBook.splice(i, 1);
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
        if (isFound(phoneBook1[i], query) || query === '*') {
            var str = phoneBook1[i]._phone;
            var x1 = str.substring(0, 3);
            var x2 = str.substring(3, 6);
            var x3 = str.substring(6, 8);
            var x4 = str.substring(8, 10);
            var x = ', 7 (' + x1 + ') ' + x2 + '-' + x3 + '-' + x4;
            var email = ', ' + phoneBook[i]._email;
            if (typeof phoneBook[i]._email === 'undefined') {
                email = '';
            }
            arr.push(phoneBook1[i]._name + x + email);
        }
    }

    return arr;
};

exports.importFromCsv = function (csv) {
    var t = 0;
    for (var i = 0; i < csv.length; i++) {
        var str = csv[i].split(';');
        if (exports.add(str[1], str[0], str[2]) === true) {
            t = t + 1;
        } else if (exports.update(str[1], str[0], str[2]) === true) {
            t = t + 1;
        }
    }

    return t;
};
