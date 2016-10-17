'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];

function findNodeByPhone(phone) {
    return phoneBook.findIndex(function (node) {
        if (node.phone === phone) {
            return true;
        }

        return false;
    });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.add = function (phone, name, email) {
    if (!(typeof phone === 'string' && typeof name === 'string') {
        return false;
    }
    var regPhone = /^\d{10}$/;
    email = (!email) ? '' : email;
    if (!regPhone.test(phone) || !name) {
        return false;
    }
    if (findNodeByPhone(phone) !== -1) {
        return false;
    }
    var newNode = {
        phone: phone,
        name: name,
        email: email
    };
    phoneBook.push(newNode);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.update = function (phone, name, email) {
    var indexInPhoneBook = findNodeByPhone(phone);
    email = (!email) ? '' : email;
    if (indexInPhoneBook === -1) {
        return false;
    }
    if (!name) {
        return false;
    }
    phoneBook[indexInPhoneBook].name = name;
    phoneBook[indexInPhoneBook].email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Boolean} success
 */
exports.findAndRemove = function (query) {
    var lengthPhoneBook = phoneBook.length;
    if (query === '*') {
        phoneBook = [];

        return lengthPhoneBook;
    }
    phoneBook = phoneBook.filter(function (node) {
        var findField = ['phone', 'name', 'email'];
        for (var i = 0; i < findField.length; i++) {
            if (node[findField[i]].indexOf(query) !== -1) {
                return false;
            }
        }

        return true;
    });

    return lengthPhoneBook - phoneBook.length;
};

function compareNode(nodeA, nodeB) {
    if (nodeA.name > nodeB.name) {
        return 1;
    }
    if (nodeA.name < nodeB.name) {
        return -1;
    }
    if (nodeA.name === nodeB.name) {
        return 0;
    }
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result search
 */
exports.find = function (query) {
    if (!query) {
        return [];
    }
    var findedPhones;
    if (query === '*') {
        findedPhones = phoneBook;
    } else {
        findedPhones = phoneBook.filter(function (node) {
            var findField = ['phone', 'name', 'email'];
            for (var i = 0; i < findField.length; i++) {
                if (node[findField[i]].indexOf(query) !== -1) {
                    return true;
                }
            }

            return false;
        });
    }
    findedPhones = findedPhones.sort(compareNode);
    var resultNode = findedPhones.map(function (node) {
        var strNode = '';
        var phone = node.phone.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        var formattedPhone = '+7 (' + phone[1] + ') ' + phone[2] + '-' + phone[3] + '-' + phone[4];
        strNode += node.name + ', ';
        strNode += formattedPhone;
        if (node.email) {
            strNode += ', ' + node.email;
        }

        return strNode;
    });

    return resultNode;
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
