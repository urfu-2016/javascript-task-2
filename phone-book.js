'use strict';

exports.isStar = true;
var phoneBook = [];

exports.add = function (phone, name, email) {
    if (!validPhoneAndName(phone, name) || isNaN(Number(phone))) {
        return false;
    }
    if (checkExistPhone(phone) === false) {
        if (typeof(email) !== 'string') {
            email = '';
        }
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

        return true;
    }

    return false;
};

function validPhoneAndName(phone, name) {
    if (typeof(phone) !== 'string' || phone.length !== 10 || /[^[0-9]/.test(phone)) {
        return false;
    }
    if (typeof(name) !== 'string' || name.length === 0) {
        return false;
    }

    return true;
}

function checkExistPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i].phone;
        if (note === phone) {
            return i;
        }
    }

    return false;
}

exports.update = function (phone, name, email) {
    if (!validPhoneAndName(phone, name)) {

        return false;
    }
    if (checkExistPhone(phone) !== false) {
        phoneBook[checkExistPhone(phone)].phone = phone;
        phoneBook[checkExistPhone(phone)].name = name;
        if (typeof(email) !== 'string') {
            email = '';
        }
        phoneBook[checkExistPhone(phone)].email = email;
    } else {

        return false;
    }

    return true;
};

exports.findAndRemove = function (query) {
    if (typeof(query) !== 'string' || query === '') {

        return 0;
    }
    var count = 0;
    if (query === '*') {
        count = phoneBook.length;
        phoneBook = [];

        return count;
    }
    var indexSearchRes = findSome(query);
    for (var i = indexSearchRes.length - 1; i > -1; i--) {
        phoneBook.splice(indexSearchRes[i], 1);
        count ++;
    }

    return count;
};

exports.find = function (query) {
    var output = [];
    if (query === '*') {
        phoneBook.sort(sortObj).forEach(function (item) {
            output.push(outResult(item));
        });

        return output;
    }
    if (query === '' || typeof(query) !== 'string') {

        return [];
    }
    var indexSearchRes = findSome(query);
    var searchRes = [];
    for (var i = 0; i < indexSearchRes.length; i++) {
        searchRes.push(phoneBook[indexSearchRes[i]]);
    }
    searchRes.sort(sortObj).forEach(function (item) {
        output.push(outResult(item));
    });

    return output;
};

function outResult(item) {
    var output = '';
    output += item.name + ', ';
    output += '+7 (' + item.phone.slice(0, 3) + ') ';
    output += item.phone.slice(3, 6) + '-' + item.phone.slice(6, 8);
    output += '-' + item.phone.slice(8, 10);
    if (item.email !== '') {
        output += ', ' + item.email;
    }

    return output;
}

function findSome(word) {
    var noteNumbers = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var check1 = phoneBook[i].phone.indexOf(word);
        var check2 = phoneBook[i].name.indexOf(word);
        var check3 = phoneBook[i].email.indexOf(word);
        if (check1 !== -1 || check2 !== -1 || check3 !== -1) {
            noteNumbers.push(i);
        }
    }

    return noteNumbers;
}

function sortObj(objA, objB) {
    if (objA.name > objB.name) {
        return 1;
    }
    if (objA.name < objB.name) {
        return -1;
    }
}

exports.importFromCsv = function (csv) {
    if (typeof(csv) !== 'string') {

        return 0;
    }
    var newNote = csv.split('\n');
    var countImport = 0;
    var notes = [];
    for (var i = 0; i < newNote.length; i++) {
        notes = newNote[i].split(';');
        if (notes.length < 4 && exports.update(notes[1], notes[0], notes[2])) {
            countImport++;
        }
        if (notes.length < 4 && exports.add(notes[1], notes[0], notes[2])) {
            countImport++;
        }
    }

    return countImport;
};
