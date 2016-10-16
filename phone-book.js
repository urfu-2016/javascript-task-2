'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

function Entry (name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}
function FoundRecords (entry, index) {
    this.entry = entry;
    this.index = index;
}

var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
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
    for (var i=0; i<phone.length; i++) {
        if (phone[i] == '(')
            count ++;
        if (phone[i] == ')')
            count--;
    }
    var isPhoneCorrect = rePhone.test(phone) && count == 0;

    if (email === undefined) {
        isEmailCorrect = true;
    } else {
        var reEmail = /^\w+@\w[\w-]*?(\.\w+)+$/;
        var isEmailCorrect = reEmail.test(email);
    }
    return isEmailCorrect && isPhoneCorrect;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var entry = phoneBook.filter(function(item) {
        return item.phone === phone;
    });
    if (entry.length != 0) {
        //phoneBook[entry[0].index].email = email || '';
        //phoneBook[entry[0].index].name = name;
        entry[0].email = email || '';
        entry[0].name = name;
        return true;
    }
    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var result = findContact(query);
    var count = 0;
    for (var i in result) {
        count++;
        var index = result[i].index;
        if (index == -1) break;
        phoneBook.splice(index, 1);
    }
    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var contacts = findContact(query);
    var result = [];
    for (var i in contacts) {
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
    var p = phone.replace(/\D/g, "");
    var newPhone = "";

    for (var i in p) {
        var digit = p[p.length - 1 - i];
        newPhone += digit;
        if (newPhone.length == 2) newPhone += "-";
        if (newPhone.length == 5) newPhone += "-";
        if (newPhone.length == 9) newPhone += " )";
        if (newPhone.length == 14) newPhone += "( ";
        if (newPhone.length >= 17 && i == p.length - 1) newPhone += "+";
    }
    newPhone += "7+";
    return reverseStr(newPhone);
}

function reverseStr(str) {
    var newStr = '', i;
    for (i = str.length - 1; i >= 0; i--) {
        newStr += str.charAt(i);
    }
    return newStr;
}

function findContact(query) {
    var result = [];
    var removeIndex = 0;
    var index = 0;

    phoneBook.forEach(function(item, i) {
        if (query === '*') {
            result.push(new FoundRecords(item, -1));
        }
        else if (query === '') { }
        else if (item.name.indexOf(query) > -1 ||
            item.phone.indexOf(query) > -1 ||
            item.email.indexOf(query) > -1) {
            result.push(new FoundRecords(item, i - removeIndex++));
        }
    });
    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var count = 0;
    var contacts = csv.split('\n');
    for (var i in contacts) {
        var c = contacts[i].split(';');
        var name = c[0];
        var phone = c[1];
        var email = c[2];
        var up = this.update(phone, name, email);
        if (up) {
            count++;
        } else {
            up = this.add(phone, name, email);
            if (up) {
                count++;
            }
        }
    }

    return count;
};
