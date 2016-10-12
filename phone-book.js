'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];
var PHONE_REG = /^(\d)\1\1(\d)\2\2(\d)\3(\d)\4$/;
// var NAME_REG = /^([А-ЯЁа-яё]+(?:\s[А-ЯЁа-яё]+)?)$/;
// var EMAIL_REG = /^(((?:\w+\.?)+\w+)@([A-Za-z]+\.[A-Za-z]{2,3}))$/;

function checkValidPhoneName(phone, name) {
    return PHONE_REG.test(phone) && (name);
}

function checkValidEmail(email) {
    return !email;
}

function addNewUser(phone, name, email) {
    var newUser = {};
    if (!checkValidPhoneName(phone, name)) {
        return false;
    }
    var hasInfo = phoneBook.filter(getContainsFunc(phone));
    if (hasInfo.length !== 0) {
        return false;
    }
    newUser.phone = phone;
    newUser.name = name;
    if (!checkValidEmail(email)) {
        newUser.email = email;
    }
    phoneBook.push(newUser);

    return true;

}

function getRewriteFunction(phone, name, email) {
    return function (element) {
        if (element.phone !== phone) {
            return false;
        }
        element.name = name;
        if (!checkValidEmail(email)) {
            element.email = email;
        } else {
            delete element.email;
        }

        return true;
    };
}

function updateUser(phone, name, email) {
    if (!checkValidPhoneName(phone, name)) {
        return false;
    }

    return phoneBook.some(getRewriteFunction(phone, name, email));
}

function getContainsFunc(info) {
    return function (item) {
        if (item.phone.indexOf(info) !== -1) {
            return true;
        } else if (item.name.indexOf(info) !== -1) {
            return true;
        } else if (item.hasOwnProperty('email') &&
                    item.email.indexOf(info) !== -1) {
            return true;
        }

        return false;
    };
}

function compareNames(item1, item2) {
    if (item1.name > item2.name) {
        return 1;
    }
    if (item1.name < item2.name) {
        return -1;
    }

    return 0;
}

function numberFormat(phone) {
    var phoneNumber = phone;

    return '+7 (' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3, 6) +
        '-' + phoneNumber.slice(6, 8) + '-' + phoneNumber.slice(8, 10);
}

function bookToString(item) {
    var outString = item.name + ', ' + numberFormat(item.phone);
    if (item.hasOwnProperty('email')) {
        outString += ', ' + item.email;
    }

    return outString;
}

function filterInfo(info) {
    return phoneBook
        .filter(getContainsFunc(info))
        .sort(compareNames)
        .map(bookToString);
}

function hasUserInfo(findItem) {
    return function (compareItem) {
        return findItem.phone === compareItem.phone;
    };
}

function getDeleteFilter(foundInfo) {
    return function (item) {
        return !foundInfo.some(hasUserInfo(item));
    };
}

function findAndRemove(info) {
    var foundInfo = phoneBook.filter(getContainsFunc(info));
    phoneBook = phoneBook.filter(getDeleteFilter(foundInfo));

    return foundInfo.length;
}

function csvUserRecord(acc, data) {
    var parsedData = data.split(';');
    var phone = parsedData[1];
    var name = parsedData[0];
    var email = parsedData[2];
    if (addNewUser(phone, name, email)) {
        acc[0]++;
    } else if (updateUser(phone, name, email)) {
        acc[1]++;
    }

    return acc;
}

function csvProcess(data) {
    var users = data.split('\n');
    var count = users.reduce(csvUserRecord, [0, 0]);

    return count[0] + count[1];
}

exports.add = function (phone, name, email) {
    return addNewUser(phone, name, email);
};

exports.update = function (phone, name, email) {
    return updateUser(phone, name, email);
};


exports.findAndRemove = function (query) {
    if (query === '*') {
        var size = phoneBook.length;
        phoneBook = [];

        return size;
    } else if (!query) {
        return 0;
    }

    return findAndRemove(query);
};

exports.find = function (query) {
    if (query === '*') {
        return filterInfo('');
    } else if (!query) {
        return [];
    }

    return filterInfo(query);
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {

    return csvProcess(csv);
};
