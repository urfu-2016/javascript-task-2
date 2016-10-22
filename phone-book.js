'use strict';
exports.isStar = false;
var phoneBook = [];

function isPhone(phone) {
    if (phone === '' || phone === undefined) {
        return false;
    }
}

function isEmail(email) {
    if (email === '' || email === undefined) {
        return false;
    }
}

// Добавление записи в телефонную книгу
exports.add = function (phone, name, email) {
    if (phone === '' || phone === undefined) {
        return false;
    }
    if (email === '') {
        return false;
    }
    if (name === '' || name === undefined ||
    phone.match(/^[0-9]{10}$/) === null) {
        return false;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
    }

    phoneBook.push({ phone: phone, name: name, email: email });

    return true;
};

// Обновление записи в телефонной книге
exports.update = function (phone, name, email) {
    var found = false;
    isPhone();
    isEmail();
    if (name === '' || name === undefined ||
    phone.match(/^[0-9]{10}$/) === null) {
        return false;
    }

    phoneBook.forEach(function (elem) {
        if (typeof elem !== undefined && elem.phone === phone) {
            elem.email = email;
            elem.name = name;
            found = true;
        }
    });

    return found;
};

// Перечень функций
function formatedQ(q) {
    if (q === '*') {
        return '';
    }
    if (q === '') {
        return 0;
    }

    return q;
}

function isRequest(q, request) {
    for (var i in request) {
        if (request[i] && request[i].indexOf(q) !== -1) {
            return true;
        }
    }

    return false;
}

// Отформатированный номер телефона
function phoneFormat(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
    phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function joinNote(request) {
    var result = [request.name, phoneFormat(request.phone)];
    if (request.email) {
        result.push(request.email);
    }

    return result.join(', ');
}

// Поиск записей по запросу в телефонной книге
exports.find = function (q) {
    q = formatedQ(q);
    function existRequest(item) {
        return isRequest(q, item);
    }

    function getNote(item) {
        return joinNote(item);
    }

    return phoneBook.filter(existRequest).map(getNote)
    .sort();
};

// Удаление записей по запросу из телефонной книги
exports.findAndRemove = function (q) {
    function nonExistRequest(item) {
        return !isRequest(q, item);
    }

    q = formatedQ(q);
    var beforeChange = phoneBook.length;
    phoneBook = phoneBook.filter(nonExistRequest);
    var afterChange = phoneBook.length;

    return beforeChange - afterChange;
};
