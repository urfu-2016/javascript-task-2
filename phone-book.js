    'use strict';

    /**
     * Сделано задание на звездочку
     * Реализован метод importFromCsv
     */
    exports.isStar = true;

    /**
     * Телефонная книга
     */
    var phoneBook = {};
    exports.add = function (phone, name, email) {
        if (!checkForExistence(phone, name, email) && checkAddArguments(name, phone)) {
            if (typeof(email) === 'undefined') {
                email = '';
            }
            phoneBook[phone] = { 'name': name, 'phone': phone, 'email': email };

            return true;
        }

        return false;
    };
    function checkForExistence(phone) {
        return (phone in phoneBook);
    }
    function checkAddArguments(name, phone) {
        return name !== '' && typeof(name) !== 'undefined' &&
        typeof(name) !== 'undefined' && name !== null &&
        /^\d{10}$/.test(phone) && typeof(phone) !== 'undefined';
    }
    exports.update = function (phone, name, email) {
        if (typeof(name) !== 'undefined' && name !== '' && checkForExistence(phone)) {
            if (typeof(email) === 'undefined') {
                email = '';
            }
            phoneBook[phone] = { 'name': name, 'phone': phone, 'email': email };

            return true;
        }

        return false;
    };
    exports.findAndRemove = function (query) {
        var deletedItems = exports.find(query, true);

        return deletedItems.length;
    };
    exports.find = function (query, needToDelete) {
        if (typeof(needToDelete) === 'undefined') {
            needToDelete = false;
        }
        if (query.length === 0) {
            return [];
        }
        if (query === '*') {
            query = '';
        }
        var foundItems = [];
        Object.keys(phoneBook).forEach(function (item) {
            var record = phoneBook[item];
            if (!recordContains(record, query)) {
                return;
            }
            if (needToDelete) {
                delete phoneBook[item];
            }
            foundItems.push(record);
        });
        foundItems.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        var resultStrings = [];
        foundItems.forEach(function (record) {
            var result = [record.name,
                convertPhoneNumberToUnified(record.phone),
                record.email]
                    .filter(function (value) {
                        return value;
                    })
                    .join(', ');
            resultStrings.push(result);
        });

        return resultStrings;
    };
    function recordContains(record, query) {
        return record.phone.includes(query) ||
            (typeof(record.email) !== 'undefined' &&
            record.email.includes(query)) ||
            record.name.includes(query);
    }
    function convertPhoneNumberToUnified(number) {
        return '+7 (' + number.substr(0, 3) + ') ' +
        [number.substr(3, 3), number.substr(6, 2), number.substr(8, 2)].join('-');
    }
    exports.importFromCsv = function (csv) {
        var lines = csv.split('\n');
        var successesCount = 0;
        lines.forEach(function (line) {
            var splitted = line.split(';');
            var record = { 'name': splitted[0], 'phone': splitted[1], 'email': splitted[2] };
            var isResultSuccessfull = false;
            if (checkForExistence(record.phone)) {
                isResultSuccessfull = exports.update(record.phone, record.name, record.email);
            } else {
                isResultSuccessfull = exports.add(record.phone, record.name, record.email);
            }
            if (isResultSuccessfull) {
                successesCount += 1;
            }
        });

        return successesCount;
    };
