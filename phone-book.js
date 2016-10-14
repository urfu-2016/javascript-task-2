'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} result
 */
exports.add = function (phone, name, email) {
    if (!validatePhone(phone) || !validateName(name) || isDuplicate(phone) !== -1) {
        return false;
    }

    var person = { phone: phone, name: name, email: email };
    phoneBook.push(person);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} result
 */
exports.update = function (phone, name, email) {
    if (!validatePhone(phone) || !validateName(name)) {
        return false;
    }

    var index = isDuplicate(phone);
    if (index === -1) {
        return false;
    }

    var person = { phone: phone, name: name, email: email };
    phoneBook.splice(index, 1, person);

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} result
 */
exports.findAndRemove = function (query) {
    var result = 0;

    for (var i = 0; i < phoneBook.length; i++) {
        var person = phoneBook[i];
        if (hasSubstring(person, query)) {
            result++;
            phoneBook.splice(i, 1);
            i--;
        }
    }

    return result;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String} results
 */
exports.find = function (query) {
    var result = [];

    if (query === '*') {
        query = '';
    }

    for (var i = 0; i < phoneBook.length; i++) {
        var person = phoneBook[i];
        if (hasSubstring(person, query)) {
            result.push(toString(person));
        }
    }

    return result.sort();
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
    csv = csv.split('\n');
    var result = 0;

    csv.forEach(function (item) {
        item = item.split(';');
        if (item.length > 3) {
            return undefined;
        }
        var name = item[0];
        var phone = item[1];
        var email = item[2];

        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            result++;
        }
    }, this);

    return result;
};

/**
 * Проверка валидности номера телефона
 * @param {String} phone
 * @returns {Bool} result
 */
function validatePhone(phone) {
    return phone && typeof(phone) === 'string' && phone.search(/^\d{10}$/) !== -1;
}

/**
 * Проверка валидности имени
 * @param {String} name
 * @returns {Bool} result
 */
function validateName(name) {
    return name && typeof(name) === 'string' && name.length !== 0;
}

/**
 * Проверяет, есть ли уже в телефонной книге указаный номер телефона
 * Возвращает индекс первой найденной записи или -1, если такой номер еще не был заведен
 * @param {String} phone
 * @returns {Number} index
 */
function isDuplicate(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var item = phoneBook[i];
        if (item.phone === phone) {
            return i;
        }
    }

    return -1;
}

/**
 * Проверяет, содержит ли какое-либо из значений свойств объекта указанную подстроку
 * @param {Object} item
 * @param {String} substring
 * @returns {Bool} result
 */
function hasSubstring(item, substring) {
    var keys = Object.keys(item);
    substring = new RegExp(substring, 'i');

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (item[key] && item[key].search(substring) !== -1) {
            return true;
        }
    }

    return false;
}

/**
 * Конвертирует запись из телефонной книги в строку
 * @param {Object} person
 * @returns {String} result
 */
function toString(person) {
    function formatPhone(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
    }

    var result = [];
    result.push(person.name);
    result.push(formatPhone(person.phone));
    if (person.email !== undefined) {
        result.push(person.email);
    }

    return result.join(', ');
}
