'use strict';

exports.isStar = true;

var Contact = function (phone, name, email) {
    this.phone = phone;
    this.phoneRaw = phone;
    this.name = name;
    this.email = email;
};

Contact.strFormat = ['name', 'phone', 'email'];

Contact.phoneFormat = new RegExp(/^\d{10}$/);
Contact.formattedPhone = function (phone) {
    if (!Contact.phoneFormat.test(phone)) {
        throw new TypeError('Wrong phone format');
    }

    return '+7 ({0}) {1}-{2}-{3}'
        .replace('{0}', phone.slice(0, 3))
        .replace('{1}', phone.slice(3, 6))
        .replace('{2}', phone.slice(6, 8))
        .replace('{3}', phone.slice(8, 10));
};

Contact.sortFunction = function (a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();

    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    }

    return 1;
};

Object.defineProperty(Contact.prototype, 'phone', {
    get: function () {
        return this._phone;
    },
    set: function (phone) {
        this._phone = Contact.formattedPhone(phone);
    }
});

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
            var success = placeContact(data[1], data[0], data[2]);

            return success ? count + 1 : count;
        }, 0);
};

Object.assign(exports, {
    add: add,
    update: update,
    find: find,
    findAndRemove: findAndRemove,
    importFromCsv: importFromCsv
});
