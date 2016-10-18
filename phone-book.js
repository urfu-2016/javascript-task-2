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
    if ((phone.length === 10) && (/\d{10}/g.test(phone)) &&
      (typeof(phone) === 'string') && (typeof(name) === 'string')) {

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
    if (typeof query === 'string') {
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
        if (under(phoneBook[j].e) === '') {
            res.push(phoneBook[j].n + ', ' + k);
        } else {
            res.push((phoneBook[j].n + ', ' + k + ', ' + under(phoneBook[j].e)));
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
        (under(element.e).indexOf(query) !== -1)) {
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
    var phone;
    var name;
    var email;
    for (var i = 0; i < csv.length; i++) {
        data = csv[i].split(';');
        phone = data[1];
        name = data[0];
        email = data[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            res++;
        }
    }

    return res;
};
