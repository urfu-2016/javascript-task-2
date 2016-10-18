'use strict';

function strAndEmp(phone, name) {
    var isString = typeof name !== 'string';
    var isEmpty = name === '' || phone === '';
    var isUndefuned = typeof name === 'undefined';

    return isString || isEmpty || isUndefuned;
}

function check(phone, name) {
    var isStringP = isNaN(Number(phone));
    var isPositive = phone === '';
    var reg = !/^[0-9]{10}$/.test(phone) || isPositive;
    if (phone.length !== 10 || strAndEmp(phone, name) || isStringP || reg) {

        return false;
    }

    return true;
}

exports.isStar = true;

var phoneBook = {
    phone: [],
    name: [],
    email: []
};

function addEmail(email) {
    if (typeof email === 'undefined') {

        return '';
    }

    return email;
}

exports.add = function (phone, name, email) {
    if (check(phone, name)) {
        var indexP = phoneBook.phone.indexOf(phone) === -1;
        var indexN = phoneBook.name.indexOf(name) === -1;
        var indexE = phoneBook.email.indexOf(email) === -1;
        if (indexE && indexN && indexP) {
            var correctEmail = addEmail(email);
            phoneBook.phone.push(phone);
            phoneBook.name.push(name);
            phoneBook.email.push(correctEmail);

            return true;
        }
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (check(phone, name)) {
        var index = phoneBook.phone.indexOf(phone);
        if (index !== -1) {
            phoneBook.name[index] = name;
            phoneBook.email[index] = addEmail(email);
        }

        return true;
    }

    return false;
};

function addIndexArray(resultIndex) {
    var arr = [];
    for (var n = 0; n < resultIndex.length; n++) {
        resultIndex[n].forEach(function (item) {
            arr.push(item);
        });
    }

    return arr;
}

function addNewBook(arr) {
    arr.forEach(function (item) {
        phoneBook.name.splice(phoneBook.name.indexOf(item), 1);
        phoneBook.email.splice(phoneBook.email.indexOf(item), 1);
        phoneBook.phone.splice(phoneBook.phone.indexOf(item), 1);
    });
    //return newBook;
}

exports.findAndRemove = function (query) {
    if (query === undefined || query === null || query === '') {

        return 0;
    }
    if (query === '*') {
        var len = phoneBook.name.length;
        phoneBook = { phone: [], name: [], email: [] };

        return len;
    }
    var resultIndex = [];
    resultIndex.push(findIndex(phoneBook.phone, query));
    resultIndex.push(findIndex(phoneBook.name, query));
    resultIndex.push(findIndex(phoneBook.email, query));
    if (resultIndex !== []) {
        var arr = addIndexArray(resultIndex);
        addNewBook(arr);

        return arr.length;
    }

    return 0;
};

function findIndex(arr, str) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().indexOf(str) !== -1) {
            result.push(i);
        }
    }

    return result;
}

function strPhone(phone) {
    var str = '+7 ';
    str += '(' + phone.substring(0, 3) + ') ';
    str += phone.substring(3, 6) + '-';
    str += phone.substring(6, 8) + '-';
    str += phone.substring(8);

    return str;
}

function addDataTwo(h, res, arr) {
    arr[h].forEach(function (item) {
        var strP = strPhone(phoneBook.phone[item]);
        if (phoneBook.email[item] === '') {
            res.push(phoneBook.name[item] + ', ' + strP);
        } else {
            res.push(phoneBook.name[item] + ', ' + strP + ', ' + phoneBook.email[item]);
        }
    });
}

function dictionary(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        addDataTwo (i, res, arr);
    }

    return res.sort();
}

function addData(i, res) {
    var strP = strPhone(phoneBook.phone[i]);
    if (phoneBook.email[i] === '') {
        res.push(phoneBook.name[i] + ', ' + strP);
    } else {
        res.push(phoneBook.name[i] + ', ' + strP + ', ' + phoneBook.email[i]);
    }
}

exports.find = function (query) {
    if (typeof query === undefined || query === '') {
        return [];
    }
    if (query === '*') {
        var len = phoneBook.name.length;
        var res = [];
        for (var i = 0; i < len; i++) {
            addData(i, res);
        }

        return res.sort();
    }
    var resultIndex = [];
    resultIndex.push(findIndex(phoneBook.phone, query));
    resultIndex.push(findIndex(phoneBook.name, query));
    resultIndex.push(findIndex(phoneBook.email, query));
    if (resultIndex !== []) {

        return dictionary(resultIndex).sort();
    }

    return [];
};

function helper(line) {
    var info = line.split(';');
    if (info.length > 3) {
        return false;
    }
    var isAdd = exports.add(info[1], info[0], info[2]);
    var isUpdate = exports.update(info[1], info[0], info[2]);

    return isUpdate || isAdd;
}

exports.importFromCsv = function (csv) {
    var count = 0;
    if (typeof csv === 'string') {
        var arrayLineCsv = csv.split('\n');
        arrayLineCsv.forEach(function (item) {
            if (helper(item)) {
                count += 1;
            }
        });

        return count;
    }

    return 0;
};
