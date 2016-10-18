'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/*
 * Телефонная книга
 */
var phoneBook = [];

function phoneIsValid(phone) {
    return phone && phone.length === 10 && !phone.match(/[^0-9]/gi) && !isNaN(Number(phone));
}

exports.add = function (phone, name, email) {
    if (!phoneIsValid(phone) || !name || typeof name !== 'string') {
        return false;
    }

    var checkPhoned = phoneBook.some(function (record) {

        return record.phone === phone;
    });

    if (!checkPhoned) {
        phoneBook.push({ 'name': name, 'phone': phone, 'email': email });

        return true;
    }

    return false;
};


exports.update = function (phone, name, email) {
    if (typeof name !== 'string' || name === '') {

        return false;
    }
    var indexPhoned = -1;
    var findPhoned = phoneBook.some(function (record, index) {
        indexPhoned = index;

        return record.phone === phone;
    });

    if (findPhoned && name) {
        phoneBook[indexPhoned].name = name;
        phoneBook[indexPhoned].email = email;

        return true;
    }

    return false;
};


exports.findAndRemove = function (query) {
    var del = 0;
    if (query === '') {
        return del;
    }
    if (query === '*') {
        del = phoneBook.length;
        phoneBook = [];

        return del;
    }

    var res = phoneBook.filter(function (record) {
        if (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1) {
            return false;
        }

        if (record.email) {
            return record.email.indexOf(query) === -1;
        }

        return true;
    });

    del = phoneBook.length - res.length;

    return del;
};


function phoneToString(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' +
        phone.substring(3, 6) + '-' +
        phone.substring(6, 8) + '-' +
        phone.substring(8, 10);
}

function objectToString(record) {
    var name = record.name;
    var phone = phoneToString(record.phone);
    if (record.email) {

        return name + ', ' + phone + ', ' + record.email;
    }

    return name + ', ' + phone;
}


exports.find = function (query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return phoneBook.map(objectToString)
            .sort();
    }
    var res = phoneBook.filter(function (record) {
        if (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1) {
            return true;
        }
        if (record.email) {
            return record.email.indexOf(query) !== -1;
        }

        return false;
    }).map(objectToString)
        .sort();

    return res;
};


exports.importFromCsv = function (csv) {
    function addRecordInBook(record) {
        var item = record.split(';');
        var name = item[0];
        var phone = item[1];
        var email = item[2];
        if (exports.add(phone, name, email) ||
           exports.update(phone, name, email)) {
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

