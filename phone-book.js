'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

function checkQuery(query) {

    var typeQuery = typeof query !== 'string';
    var emptyQuery = query === '' || query === ' ';
    var undefQuery = typeof query === 'undefined';

    if (typeQuery || emptyQuery || undefQuery) {

        return false;
    }

    return true;
}

function isEmptyQuery(query) {

    return query === undefined;
}

function checkPhone(phone) {
    var reg = /^(\d{10})$/;

    return reg.test(phone);
}

function valEmail(email) {

    if (email === '') {

        return true;

    }

    return email;
}

function formatPhone(phone) {

    var result = '+7 ({1}) {2}-{3}-{4}'
    .replace('{1}', phone.slice(0, 3))
    .replace('{2}', phone.slice(3, 6))
    .replace('{3}', phone.slice(6, 8))
    .replace('{4}', phone.slice(8, 10));

    return result;

}

function concatString(name, phone, email) {
    var result;

    if (email !== '') {

        result = '{1}, {2}, {3}'
            .replace('{1}', name)
            .replace('{2}', phone)
            .replace('{3}', email);
    } else {

        result = '{1}, {2}'
            .replace('{1}', name)
            .replace('{2}', phone);
    }

    return result;

}

function findIndex(query, phone, name, email) {

    if (email === undefined) {

        return false;

    }

    if (phone.indexOf(query) !== -1 || name.indexOf(query) !== -1 || email.indexOf(query) !== -1) {

        return true;
    }

    return false;
}

/**
 * Телефонная книга
 */
var phoneBook = [];
var uName;

function checkEntry(phone) {

    var resultsEntry = true;

    phoneBook.forEach(function (object, index) {

        var entryPhone = phoneBook[index].number;

        if (phoneBook.length === 0) {

            return resultsEntry;

        } else if (entryPhone.indexOf(phone) !== -1) {

            resultsEntry = false;
        }

    });

    return resultsEntry;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - true или false от успеха операции
 */
exports.add = function (phone, name, email) {
    var bookObj = {};
    uName = isEmptyQuery(name) ? false : name;
    var checkEmail = isEmptyQuery(email) ? '' : email;

    if (checkPhone(phone) && checkQuery(uName) && valEmail(checkEmail) && checkEntry(phone)) {

        bookObj = {
            number: phone,
            username: uName,
            mail: checkEmail
        };

        phoneBook.push(bookObj);

        return true;
    }

    return false;
};


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - true или false от успеха операции
 */
exports.update = function (phone, name, email) {
    var upPhone = '';
    var checkEmail = isEmptyQuery(email) ? '' : email;
    var fixName = !checkQuery(name) ? false : name;

    if (checkPhone(phone) && valEmail(checkEmail)) {

        phoneBook.forEach(function (object, index) {

            upPhone = phoneBook[index].number;

            if (upPhone.indexOf(phone) !== -1) {

                phoneBook[index].username = fixName;
                phoneBook[index].mail = checkEmail;

            }

        });

        return true;
    }

    return false;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - Число удаленных записей
 */
exports.findAndRemove = function (query) {
    var removed = [];
    var counter = 0;

    if (checkQuery(query)) {

        if (query === '*') {

            var bookLength = phoneBook.slice().length;

            return bookLength;
        }

        phoneBook.forEach(function (element, index) {

            var findPhone = phoneBook[index].number;
            var findName = phoneBook[index].username;
            var findEmail = phoneBook[index].mail;

            if (findIndex(query, findPhone, findName, findEmail)) {

                removed.push(index);
                counter = removed.length;
            }

        });
    }

    return counter;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String} Результат поиска
 */
exports.find = function (query) {
    var searchResult = [];
    var convertedPhone = '';
    var concatResult = '';

    if (checkQuery(query)) {

        if (query === '*') {

            phoneBook.forEach(function (object, index) {
                var findName = phoneBook[index].username;
                var findEmail = phoneBook[index].mail;
                convertedPhone = formatPhone(phoneBook[index].number);
                concatResult = concatString(findName, convertedPhone, findEmail);

                searchResult.push(concatResult);

            });

            return searchResult.sort();

        }

        phoneBook.forEach(function (object, index) {
            var findPhone = phoneBook[index].number;
            var findName = phoneBook[index].username;
            var findEmail = phoneBook[index].mail;

            if (findIndex(query, findPhone, findName, findEmail)) {

                convertedPhone = formatPhone(findPhone);
                concatResult = concatString(findName, convertedPhone, findEmail);
                searchResult.push(concatResult);

            }

        });

        return searchResult.sort();
    }

    return [];
};

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

    return csv.split('\n').length;
};
