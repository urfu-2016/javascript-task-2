'use strict';

exports.isStar = false;
var phoneBook = {};

function getPhone(phone) {

    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

exports.add = function (phone, name, email) {
    if (isPhoneCorrect(phone) && isNameCorrect(name)) {
        phoneBook[phone] = [name, email];

        return true;
    }

    return false;
};

function isNameCorrect(name) {
    return (name !== undefined && name.length !== 0);

}

function isPhoneCorrect(phone) {
    return (/\d{10}/.test(phone) && isPhoneUnique(phone));

}

function isPhoneUnique(phone) {
    return !phoneBook[phone];
}

exports.update = function (phone, name, email) {
    if (!isNameCorrect(name)) {
        return false;
    }
    phoneBook[phone][0] = name;
    if (!email) {
        phoneBook[phone][1] = '';
    } else {
        phoneBook[phone][1] = email;
    }

    return true;
};


exports.find = function (query) {
    var result = [];
    if (query === '') {
        return result;
    }

    var keys = (Object.keys(phoneBook));
    keys.forEach(function (phone) {
        if (query === '*' || contains(phone, query)) {
            result.push(phone);
        }
    });

    result.sort(function (first, second) {
        return phoneBook[first][0].localeCompare(phoneBook[second][0])
    });

    return result.map(format);
};

function contains(phone, query) {
    return (phone.indexOf(query) !== -1 || phoneBook[phone][0].indexOf(query) !== -1 ||
    (phoneBook[phone][1] != undefined && phoneBook[phone][1].indexOf(query) !== -1 ))
}

function format(phone) {
    var result = '';
    result += phoneBook[phone][0] + ', ' + getPhone(phone);
    if (phoneBook[phone][1] !== undefined && phoneBook[phone][1] !== '') {
        result += ', ' + phoneBook[phone][1];
    }

    return result;
}

exports.findAndRemove = function (query) {
    var array = exports.find(query);
    var count = 0;
    var beginSlice;
    var endSlice;
    var phone;
    for (var i = 0; i < array.length; i++) {
        beginSlice = array[i].indexOf('+');
        endSlice = array[i].indexOf(',', beginSlice);
        phone = array[i].slice(beginSlice, endSlice);
        delete phoneBook[phone];
        count++;
    }

    return count;
};


