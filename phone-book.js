'use strict';
function validPhone(phone) {
    if (phone === undefined) {

        return false;
    }
    var validPhoneRegExp = /[0-9]{10}/;

    return phone.toString().match(validPhoneRegExp) !== null;
}

function phoneToString(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

exports.isStar = true;

var phoneBook = [];

exports.add = function (phone, name, email) {
    function nameNotCorrect() {
        return name === undefined || name === '';
    }

    if (!validPhone(phone) || nameNotCorrect() || email === '') {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return false;
        }
    }
    phoneBook.push({ 'phone': phone.toString(), 'name': name.toString(), 'email': email });

    return true;
};

exports.update = function (phone, name, email) {
    if (name === undefined) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = { 'phone': phone, 'name': name, 'email': email };

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    var countDeletedPhones = 0;

    function findAndDeletePhoneFromPhoneBook(phoneStr) {
        for (var j = 0; j < phoneBook.length; j++) {
            if (phoneStr.split(', ')[1] === phoneToString(phoneBook[j].phone)) {
                phoneBook.splice(j, 1);
                countDeletedPhones++;
                break;
            }
        }
    }

    this.find(query).forEach(findAndDeletePhoneFromPhoneBook);

    return countDeletedPhones;
};

exports.find = function (query) {
    var phones = [];

    if (!query || typeof query !== 'string') {
        return phones;
    }

    function filterThePhone(phone) {
        function matchIsFound(property) {
            return (property !== undefined && property.indexOf(query) !== -1);
        }

        return (query === '*' || matchIsFound(phone.name) ||
        matchIsFound(phone.email) || matchIsFound(phone.phone));
    }

    phones = phoneBook.filter(filterThePhone).sort(function (phoneToSort) {

        return phoneToSort.name;
    });

    for (var i = 0; i < phones.length; i++) {

        var newPhone = phones[i].name + ', ' + phoneToString(phones[i].phone);
        if (phones[i].email !== undefined) {
            newPhone += ', ' + phones[i].email;
        }
        phones[i] = newPhone;
    }

    return phones.sort();
};

exports.importFromCsv = function (csv) {

    var countAddedPhones = 0;
    var lines = csv.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var splitLines = lines[i].split(';');
        var name = splitLines[0];
        var phone = splitLines[1];
        var email = splitLines[2];
        if (!this.add(phone, name, email) && !this.update(phone, name, email)) {
            countAddedPhones--;
        }
        countAddedPhones++;
    }

    return countAddedPhones;
};
