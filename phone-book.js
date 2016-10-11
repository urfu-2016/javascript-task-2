'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Добавление записи в телефонную книгу
 * @returns {Boolean}
 */
exports.add = function () {
    return true;
};

/**
 * Обновление записи в телефонной книге
 * @returns {Boolean}
 */
exports.update = function () {
    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @returns {Array}
 */
exports.findAndRemove = function () {
    return [];
};

/**
 * Поиск записей по запросу в телефонной книге
 * @returns {Array}
 */
exports.find = function () {
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
