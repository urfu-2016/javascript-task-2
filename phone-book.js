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
// 'Алексей;5551110011;alex@example.com',
exports.add = function (phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].p.indexOf(phone) !== -1) {
            return false;
        }
    }
    if (check(phone, name) && (name.length > 0)) {
        var em = {
            n: name,
            p: phone,
            e: email
        };
        phoneBook.push(em);

        return true;
    }

    return false;
};

function check(phone, name) {
    if ((typeof(phone) === 'string') && (phone.length === 10) &&
        (/\d{10}/g.test(phone)) && (typeof(name) === 'string')) {

        return true;
    }

    return false;
}

exports.update = function (phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i].p === phone) && check(phone, name) && (name.length > 0)) {
            phoneBook[i].n = name;
            phoneBook[i].e = email;

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    var res = exports.find(query);
    for (var i = 0; i < res.length; i++) {
        delete_(res[i]);
    }

    return res.length;
};

function delete_(arr) {
    var s = '';
    for (var y = 0; y < phoneBook.length; y++) {
        s = phoneBook[y].n;
        if (s === '') {
            s += '+7 (' + phoneBook[y].p.slice(0, 3) + ') ' +
            phoneBook[y].p.slice(3, 6) + '-' +
            phoneBook[y].p.slice(6, 8) + '-' + phoneBook[y].p.slice(-2);
        } else {
            s += ', +7 (' + phoneBook[y].p.slice(0, 3) + ') ' +
            phoneBook[y].p.slice(3, 6) + '-' +
            phoneBook[y].p.slice(6, 8) + '-' + phoneBook[y].p.slice(-2);
        }
        if (phoneBook[y].e !== undefined) {
            s += ', ' + phoneBook[y].e;
        }
        if (s === arr) {
            phoneBook.splice(y, 1);
            break;
        }
    }
}

// 'Алексей;5551110011;alex@example.com',
// 'Валерий;5553330033;valera@example.com',
exports.find = function (query) {
    var res = [];
    if (query === '' || query === undefined) {

        return res;
    }
    if ((typeof query === 'string') && (query.length > 0)) {
        if (query === '*') {
            res = zv();
        } else {
            res = is(query);
        }
    }

    return res.sort();
};

function zv() {
    var res = [];
    for (var j = 0; j < phoneBook.length; j++) {
        var l = phoneBook[j].p;
        var k = '+7 (' + l.slice(0, 3) + ') ' + l.slice(3, 6) + '-' +
        l.slice(6, 8) + '-' + l.slice(-2);
        if (phoneBook[j].e === undefined) {
            res.push(phoneBook[j].n + ', ' + k);
        } else {
            res.push(phoneBook[j].n + ', ' + k + ', ' + phoneBook[j].e);
        }
    }

    return res;
}

function is(query) {
    var res = [];
    for (var i = 0; i < phoneBook.length; i++) {
        checker(phoneBook[i], query, res);
    }

    return res;
}

function checker(element, query, array) {
    if ((element.p.indexOf(query) !== -1) || (element.n.indexOf(query) !== -1) ||
        (element.e !== undefined && element.e.indexOf(query) !== -1)) {
        var t = '+7 (' + element.p.slice(0, 3) + ') ' + element.p.slice(3, 6) +
        '-' + element.p.slice(6, 8) + '-' + element.p.slice(-2);
        if (element.e === undefined) {
            array.push(element.n + ', ' + t);
        } else {
            array.push(element.n + ', ' + t + ', ' + element.e);
        }
    }
}

exports.importFromCsv = function (csv) {
    csv = csv.split('\n');
    var res = 0;
    var data = [];
    for (var i = 0; i < csv.length; i++) {
        data = csv[i].split(';');
        if (data.length > 3) {
            continue;
        }
        if (exports.add(data[1], data[0], data[2]) || exports.update(data[1], data[0], data[2])) {
            res++;
        }
    }

    return res;
};
