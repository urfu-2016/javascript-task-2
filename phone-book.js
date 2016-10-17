'use strict';

exports.isStar = true;

var Contact = function (phone, name, email) {
    this.phone = phone;
    this.name = name;
    this.email = email;
};

Contact.phoneFormat = new RegExp(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
Contact.emailFormat = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.\.[a-zA-Z]{2,}$/);

Contact.formattedPhone = function (phone) {
    return phone.replace(Contact.phoneFormat, '+7 ($1) $2-$3-$4');
};

Contact.sortFunction = function (a, b) {
    return a.name > b.name;
};

Contact.prototype.toString = function () {
    return this.name + ', ' +
        Contact.formattedPhone(this.phone) +
        (!this.email ? '' : ', ' + this.email);
};

var phoneBook = {};

var checkPhone = function (phone) {
    if (!phone || !Contact.phoneFormat.test(phone)) {
        return false;
    }

    return true;
};

var checkName = function (name) {
    if (!name) {
        return false;
    }

    return true;
};

var checkEmail = function (email) {
    if (!email && (email !== '' && email !== undefined)) {
        return false;
    }

    if (email && !Contact.emailFormat.test(email)) {
        return false;
    }

    return true;
};

var add = function (phone, name, email) {
    if (!(checkPhone(phone) && checkName(name) && checkEmail(email))) {
        return false;
    }

    if (phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = new Contact(phone, name, email);

    return true;
};

var update = function (phone, name, email) {
    if (!(checkPhone(phone) && checkName(name) && checkEmail(email))) {
        return false;
    }

    if (!phoneBook[phone]) {
        return false;
    }

    phoneBook[phone].name = name;
    phoneBook[phone].email = email;

    return true;
};

var findContacts = function (query) {
    if (!query) {
        return [];
    }

    var allContacts = Object.keys(phoneBook)
        .map(function (phone) {
            return phoneBook[phone];
        });

    return query === '*'
        ? allContacts
        : allContacts
            .filter(function (contact) {
                return contact.name.indexOf(query) !== -1 ||
                    contact.phone.indexOf(query) !== -1 ||
                    (contact.email && contact.email.indexOf(query) !== -1);
            });
};

var find = function (query) {
    return findContacts(query)
        .sort(Contact.sortFunction)
        .map(function (contact) {
            return contact.toString();
        });
};

var findAndRemove = function (query) {
    return findContacts(query)
        .reduce(function (count, contact) {
            delete phoneBook[contact.phone];

            return count + 1;
        }, 0);
};

var importFromCsv = function (csv) {
    return csv
        .split('\n')
        .reduce(function (count, contact) {
            var data = contact.split(';');

            var phone = data[1];
            var name = data[0];
            var email = data[2];

            return add(phone, name, email) || update(phone, name, email)
                ? count + 1
                : count;
        }, 0);
};

Object.assign(exports, {
    add: add,
    update: update,
    find: find,
    findAndRemove: findAndRemove,
    importFromCsv: importFromCsv
});
