'use strict';

/**
 * Телефонная книга
 */
const phoneBook = {}; // Здесь вы храните записи как хотите

const phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;
const emailRegex = new RegExp(['^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)|',
    '(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$'].join(''), 'i');

function isValidStrings(...strings) {
    return strings.every(s => typeof s === 'string');
}

function isCorrectPhone(phone) {
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isCorrectEmail(email) {
    return emailRegex.test(email);
}

function getFormattedPhone(phone) {
    const phonePattern = phone.match(phoneRegex);

    return `+7 (${phonePattern[1]}) ${phonePattern[2]}-${phonePattern[3]}-${phonePattern[4]}`;
}

function isCorrectInput(name, phone, email) {
    return isValidStrings(name, phone) &&
        isCorrectPhone(phone) &&
        (email === undefined || (isValidStrings(email) && isCorrectEmail(email)));
}

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.add = function (phone, name, email = undefined) {
    if (!isCorrectInput(name, phone, email) || exports.find(phone).length !== 0) {
        return false;
    }
    phoneBook[[name, phone, email].join('')] = { name, phone: getFormattedPhone(phone), email };

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.update = function (phone, name, email = undefined) {
    if (!isCorrectInput(name, phone, email)) {
        return false;
    }
    const keys = findKeys(phone);
    if (keys.length === 0) {
        return false;
    }
    keys.forEach(key => {
        phoneBook[key].name = name;
        if (email === undefined) {
            Reflect.deleteProperty(phoneBook[key], 'email');
        } else {
            phoneBook[key].email = email;
        }
    });

    return true;
};

function normalizeQuery(query) {
    return query === '*' ? '' : query;
}

function findKeys(query) {
    query = normalizeQuery(query);

    return Object.keys(phoneBook)
        .filter(key => key.indexOf(query) !== -1);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Integer} Count of removed entries
 */
exports.findAndRemove = function (query) {
    const keys = findKeys(query);
    keys.forEach(key => Reflect.deleteProperty(phoneBook, key));

    return keys.length;
};


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array<String>}
 */
exports.find = function (query) {
    return findKeys(query)
        .map(key => phoneBook[key])
        .sort((x, y) => {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            }

            return 0;
        })
        .map(entry => entry.hasOwnProperty('email') ?
            `${entry.name}, ${entry.phone}, ${entry.email}` :
            `${entry.name}, ${entry.phone}`);
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
    return csv.split('\n').map(line => {
        const parts = line.replace(/\r/, '').split(';');
        if (parts.length !== 3) {
            return false;
        }

        return module.exports.add(...parts);
    })
    .reduce((acc, value) => acc + (value ? 1 : 0), 0);
};
