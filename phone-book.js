'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

function Entry(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}
function FoundRecords(entry, index) {
    this.entry = entry;
    this.index = index;
}

var phoneBook = [];

exports.add = function (phone, name, email) {
    var unique = this.find(phone).length === 0;
    if (isDataCorrect(phone, email) && arguments.length >= 2 && unique) {
        if (email === undefined) {
            email = '';
        }
        phoneBook.push(new Entry(name, phone, email));

        return true;
    }

    return false;
};

function isDataCorrect(phone, email) {
    var rePhone = /^\+?(\d+)? ?\(?\d{3}\)? ?\d{3}(\s|-)?\d(\s|-)?\d{3}$/;
    var count = 0;
    for (var i = 0; i < phone.length; i++) {
        if (phone[i] === '(') {
            count++;
        }
        if (phone[i] === ')') {
            count--;
        }
    }
    var isPhoneCorrect = rePhone.test(phone) && count === 0;

    var isEmailCorrect = null;
    if (email === undefined) {
        isEmailCorrect = true;
    } else {
        var reEmail = /^\w+@\w[\w-]*?(\.\w+)+$/;
        isEmailCorrect = reEmail.test(email);
    }

    return isEmailCorrect && isPhoneCorrect;
}

exports.update = function (phone, name, email) {
    var entry = phoneBook.filter(function (item) {
        return item.phone === phone;
    });
    if (entry.length !== 0) {
        entry[0].email = email || '';
        entry[0].name = name;

        return true;
    }

    return false;
};

exports.findAndRemove = function (query) {
    var contacts = findContact(query);
    var count = 0;
    for (var i = 0; i < contacts.length; i++) {
        count++;
        var index = contacts[i].index;
        if (index === -1) {
            break;
        }
        phoneBook.splice(index, 1);
    }

    return count;
};

exports.find = function (query) {
    var contacts = findContact(query);
    var result = [];
    for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i].entry;
        var entry = contact.name + ', ' + normalize(contact.phone);
        if (contact.email !== '') {
            entry += ', ' + contact.email;
        }
        result.push(entry);
    }

    return result.sort();
};

function normalize(phone) {
    var newPhone = '+7 (' + phone.substring(0, 3) + ') ' +
        phone.substring(3, 6) + '-' + phone.substring(6, 8) +
        '-' + phone.substring(8);

    return newPhone;
}

function reverseStr(str) {
    var newStr = '';
    for (var i = str.length - 1; i >= 0; i--) {
        newStr += str.charAt(i);
    }

    return newStr;
}

function findContact(query) {
    var result = [];
    var removeIndex = 0;

    phoneBook.forEach(function (item, i) {
        if (query === '*') {
            result.push(new FoundRecords(item, -1));
        } else if (item.name.indexOf(query) > -1 ||
            item.phone.indexOf(query) > -1 ||
            item.email.indexOf(query) > -1) {
            result.push(new FoundRecords(item, i - removeIndex++));
        }
    });

    return result;
}

exports.importFromCsv = function (csv) {
    var count = 0;
    var contacts = csv.split('\n');
    for (var i = 0; i < contacts.length; i++) {
        var c = contacts[i].split(';');
        var name = c[0];
        var phone = c[1];
        var email = c[2];
        var tryUpdate = this.update(phone, name, email);
        var tryAdd = this.add(phone, name, email);
        if (tryUpdate || tryAdd) {
            count++;
        }
    }

    return count;
};
