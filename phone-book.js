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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

function findNodeByPhone(phone) {
    var existNodeIndex = phoneBook.findIndex(function(node, index, array) {
        if (node.phone === phone) {
            return true;
        } 
        
        return false;
    });

    return existNodeIndex;
};

exports.add = function (phone, name, email) {
    var regPhone = /^\d{10}$/;
    email = (!email)? '':email;
    if (!regPhone.test(phone) || !name) {
        return false;
    }
    
    if(findNodeByPhone(phone) !== -1) {
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
 */
exports.update = function (phone, name, email) {
    var indexInPhoneBook = findNodeByPhone(phone);
    email = (!email)? '':email;
    if(indexInPhoneBook === -1) {
        return false;
    }
    if(!name) {
        return false;
    }
    phoneBook[indexInPhoneBook].name = name;
    phoneBook[indexInPhoneBook].email = email ;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var lengthPhoneBook = phoneBook.length;
    if(query === '*') {
        phoneBook = [];
        return lengthPhoneBook;
    }
    phoneBook = phoneBook.filter(function(node) {
        var findField = ['phone', 'name', 'email'];
        for(var i = 0; i < findField.length; i++) {
            if (node[findField[i]].indexOf(query) !== -1) {
                return false;
            }
        }
        return true;
    });
    return lengthPhoneBook - phoneBook.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */

 function compareNode(nodeA, nodeB) {
    if(nodeA.name > nodeB.name) {
        return 1;
    }
    if(nodeA.name < nodeB.name) {
        return -1;
    }
    if(nodeA.name === nodeB.name) {
        return 0;
    }
 }

exports.find = function (query) {
    if(!query) {
        return [];
    }
    var findedPhones;
    if(query === '*') {
        findedPhones = phoneBook;
    }
    else {
        findedPhones = phoneBook.filter(function(node) {
            var findField = ['phone', 'name', 'email'];
            for(var i = 0; i < findField.length; i++) {
                if (node[findField[i]].indexOf(query) !== -1) {
                    return true;
                }
            }
            return false;
        });
    }
    findedPhones = findedPhones.sort(compareNode);
    var resultNode = [];
    findedPhones.forEach(function(node){
        var phone = node.phone.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        var formattedPhone = '+7 (' + phone[1] + ') ' + phone[2] + '-' + phone[3] + '-' + phone[4];
        resultNode.push(node.name);
        resultNode.push(formattedPhone);
        if(node.email){
           resultNode.push(node.email); 
        }
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
