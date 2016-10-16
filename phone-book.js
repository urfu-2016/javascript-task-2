'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

function checkQuery(query) {

    return typeof query === 'string';
}

function isEmptyQuery(query) {

    return query === undefined;
}

function checkPhone(phone) {

    var regExpPhone = /^([5]\d{2})([1-5]\d{2})([0]\d{1})([1-5]\d{1})$/;

    return phone.match(regExpPhone);
}

function valEmail(email) {

    var regExpEmail = /^([a-z]+)@([a-z]+\.com)$/;

    if (email === '') {

        return true;
    }

    return email.match(regExpEmail);

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

    var result = '{1}, {2}, {3}'
            .replace('{1}', name)
            .replace('{2}', phone)
            .replace('{3}', email);

    return result;

}

function findIndex(query, phone, name, email) {

    if (phone.indexOf(query) !== -1 || name.indexOf(query) !== -1 || email.indexOf(query) !== -1) {

        return true;
    }

    return false;
}

/**
 * Телефонная книга
 */
var phoneBook = [];

var uPhone;
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
    uPhone = phone;
    uName = name;

    var checkEmail = isEmptyQuery(email) ? '' : email;

    if (isEmptyQuery(uName)) {

        return false;
    }

    if (checkPhone(uPhone) && checkQuery(uName) && valEmail(checkEmail) && checkEntry(uPhone)) {

        bookObj = {
            number: uPhone,
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

    if (isEmptyQuery(name)) {

        return false;

    } else if (checkPhone(phone) && valEmail(checkEmail)) {

        phoneBook.forEach(function (object, index) {

            upPhone = phoneBook[index].number;

            if (upPhone.indexOf(phone) !== -1) {

                phoneBook[index].username = name;
                phoneBook[index].mail = checkEmail;

                return true;
            }


        });

    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - Число удаленных записей
 */
exports.findAndRemove = function (query) {
    var counter = 0;

    if (checkQuery(query)) {

        phoneBook.forEach(function (object, index) {

            var findPhone = phoneBook[index].number;
            var findName = phoneBook[index].username;
            var findEmail = phoneBook[index].mail;

            if (findIndex(query, findPhone, findName, findEmail)) {

                phoneBook.splice(index, 1, '');

                counter++;
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
    var findPhone;
    var findName;
    var findEmail;

    if (checkQuery(query) && query !== '*' && query !== '') {

        phoneBook.forEach(function (object, index) {
            findPhone = phoneBook[index].number;
            findName = phoneBook[index].username;
            findEmail = phoneBook[index].mail;

            if (findIndex(query, findPhone, findName, findEmail)) {
                convertedPhone = formatPhone(findPhone);
                concatResult = concatString(findName, convertedPhone, findEmail);

                searchResult.push(concatResult);
            }

        });

        searchResult.sort();

        return searchResult;

    }

    if (query === '*') {

        phoneBook.forEach(function (object, index) {
            findName = phoneBook[index].username;
            findEmail = phoneBook[index].mail;
            convertedPhone = formatPhone(phoneBook[index].number);
            concatResult = concatString(findName, convertedPhone, findEmail);

            searchResult.push(concatResult);
        });

        searchResult.sort();

        return searchResult;

    } else if (query === '') {

        return [];
    }

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
