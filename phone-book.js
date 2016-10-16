'use strict';

exports.isStar = true;

var Contact = function (phone, name, email) {
    this.phone = Contact.formattedPhone(phone);
    this.phoneRaw = phone;
    this.name = name;
    this.email = email;
};

Contact.strFormat = ['name', 'phone', 'email'];

Contact.phoneFormat = new RegExp(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
Contact.formattedPhone = function (phone) {
    if (!Contact.phoneFormat.test(phone)) {
        throw new TypeError('Wrong phone format');
    }

    return phone.replace(Contact.phoneFormat, '+7 ($1) $2-$3-$4');
};

Contact.sortFunction = function (a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();

    return x > y;
};

Contact.prototype.toString = function () {
    var $this = this;

    return Contact.strFormat
        .filter(function (prop) {
            return $this[prop] !== undefined;
        })
        .map(function (prop) {
            return $this[prop].toString();
        })
        .join(', ');
};

var phoneBook = {};

var placeContact = function (phone, name, email) {
    if (!phone || !name) {
        return false;
    }

    try {
        phoneBook[phone] = new Contact(phone, name, email);
    } catch (e) {
        if (e instanceof TypeError) {
            return false;
        }

        throw e;
    }

    return true;
};

var add = function (phone, name, email) {
    if (!phone || !name) {
        return false;
    }

    if (phoneBook[phone] !== undefined) {
        return false;
    }

    return placeContact(phone, name, email);
};

var update = function (phone, name, email) {
    if (!phone || !name) {
        return false;
    }

    if (phoneBook[phone] === undefined) {
        return false;
    }

    return placeContact(phone, name, email);
};

var findContacts = function (query) {
    if (!query) {
        return [];
    }

    var allContacts = Object.keys(phoneBook)
        .filter(function (phoneNumber) {
            return phoneBook[phoneNumber] !== undefined;
        })
        .map(function (phoneNumber) {
            return phoneBook[phoneNumber];
        });

    var found = query === '*'
        ? allContacts
        : allContacts
            .filter(function (contact) {
                return Object.getOwnPropertyNames(contact)
                    .map(function (prop) {
                        return contact[prop];
                    })
                    .filter(function (propValue) {
                        return propValue !== undefined;
                    })
                    .some(function (propValue) {
                        return propValue.indexOf(query) !== -1;
                    });
            });

    return found.sort(Contact.sortFunction);
};

var find = function (query) {
    return findContacts(query)
        .map(function (contact) {
            return contact.toString();
        });
};

var findAndRemove = function (query) {
    return findContacts(query)
        .reduce(function (count, contact) {
            phoneBook[contact.phoneRaw] = undefined;

            return count + 1;
        }, 0);
};

var importFromCsv = function (csv) {
    return csv
        .split('\n')
        .reduce(function (count, contact) {
            var data = contact.split(';');

            return placeContact(data[1], data[0], data[2])
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
