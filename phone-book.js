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
    if (!validateInput(phone, name, email) || isDuplicate(phone) !== -1) {
        return false;
    }

    phoneBook.push({ phone: phone, name: name, email: email });

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
    if (!validateInput(phone, name, email)) {
        return false;
    }

    var index = isDuplicate(phone);
    if (index === -1) {
        return false;
    }

    phoneBook[index].name = name;
    phoneBook[index].email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} result
 */
exports.findAndRemove = function (query) {
    var result = 0;

    if (!query) {
        return result;
    }

    if (query === '*') {
        result = phoneBook.length;
        phoneBook = [];

        return result;
    }

    phoneBook = phoneBook.filter(function (person) {
        if (hasSubstring(person, query)) {
            result++;

            return false;
        }

        return true;
    });

    return result;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String} results
 */
exports.find = function (query) {
    var result = [];

    if (!query) {
        return result;
    }
    if (query === '*') {
        query = '';
    }

    phoneBook.forEach(function (item) {
        if (hasSubstring(item, query)) {
            result.push(toString(item));
        }
    }, this);

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
    var result = 0;
    if (!csv) {
        return result;
    }
    csv = csv.split('\n');

    csv.forEach(function (item) {
        item = item.split(';');
        if (exports.add(item[1], item[0], item[2]) || exports.update(item[1], item[0], item[2])) {
            result++;
        }
    }, this);

    return result;
};

/**
 * Проверка валидности полученных аргументов
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} result
 */
function validateInput(phone, name, email) {
    function validatePhone() {
        return typeof(phone) === 'string' && phone.length === 10 && /^\d{10}$/g.test(phone);
    }

    function validateName() {
        return typeof(name) === 'string' && name !== '';
    }

    function validateEmail() {
        return email === undefined || (typeof(email) === 'string' && name !== '');
    }

    return (validatePhone() && validateName() && validateEmail());
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
    if (substring === '') {
        return true;
    }
    var keys = Object.keys(item);
    substring = new RegExp(substring, 'ig');

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
