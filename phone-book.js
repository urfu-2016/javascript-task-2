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


function phoneIsValid(phone) {
    if (typeof phone !== 'string' || phone.length !== 10 || phone.match(/\d{10}/) === null) {
        return false;
    }

    return true;
}

exports.add = function (phone, name, email) {
    if (typeof name !== 'string' || name === '') {
        return false;
    }
    if (exports.find(name).length === 0 && exports.find(phone).length === 0 &&
        phoneIsValid(phone)) {
        var obj = {};
        obj.name = name;
        obj.phone = phone;
        if (email === undefined) {
            phoneBook.push(obj);

            return true;
        }
        if (typeof email === 'string' && exports.find(email).length === 0) {
            obj.email = email;
            phoneBook.push(obj);

            return true;
        }

        return false;
    }

    return false;
};


exports.update = function (phone, name, email) {
    if (typeof name !== 'string' || name === '') {

        return false;
    }
    var flag = false;
    phoneBook = phoneBook.map(function (item) {
        if (item.phone === phone) {
            if (name !== undefined) {
                item.name = name;
            }
            delete item.email;
            if (typeof email === 'string') {
                item.email = email;
            }
            flag = true;
        }

        return item;
    });

    return flag;
};


exports.findAndRemove = function (query) {
    var del = 0;
    switch (query) {
        case '*':
            del = phoneBook.length;
            phoneBook = [];
            break;
        case '':
        case undefined:
            break;
        default:
            var res = phoneBook.filter(function (item) {
                var keys = Object.keys(item);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = item[key];
                    if (value.match(query) !== null && value !== undefined) {

                        return false;
                    }
                }

                return true;
            });
            del = phoneBook.length - res.length;
            phoneBook = res;
    }

    return del;

};


function parsePhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8);
}

function parseAddres(item) {
    var name = item.name;
    var phone = parsePhone(item.phone);
    if (item.hasOwnProperty('email')) {

        return name + ', ' + phone + ', ' + item.email;
    }

    return name + ', ' + phone;
}


exports.find = function (query) {
    var res = [];
    switch (query) {
        case '*':
            res = phoneBook.sort(function (item1, item2) {
                return item1.name.localeCompare(item2.name);
            })
                .map(parseAddres);

            break;
        case '':
        case undefined:
            break;
        default:
            res = phoneBook.filter(function (item) {
                var keys = Object.keys(item);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    var value = item[key];
                    if (value.match(query) !== null && value !== undefined) {

                        return true;
                    }
                }

                return false;
            })
                .sort(function (item1, item2) {

                    return item1.name.localeCompare(item2.name);
                })
                .map(parseAddres);
            break;
    }

    return res;
};


exports.importFromCsv = function (csv) {
    phoneBook = [];
    function addRecordInBook(record) {
        var item = record.split(';');
        var name = item[0];
        var phone = item[1];
        var email;
        if (item.length === 3) {
            email = item[2];
        }
        if (exports.add(phone, name, email)) {
            return 1;
        }
        if (exports.update(phone, name, email)) {
            return 1;
        }

        return 0;
    }

    var book = csv.split('\n');
    var addRecord = 0;
    for (var i = 0; i < book.length; i++) {
        var record = book[i];
        addRecord += addRecordInBook(record);
    }

    return addRecord;
};
