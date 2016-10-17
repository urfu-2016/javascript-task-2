'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

var phoneBook=[];

exports.add = function (phone, name, email) {
if (checkNew(phone, name)) {
    var personIndex = phoneBook.NewIndex(function (person) {
        
        return phone === person.phone;
    });
    if (NewIndex !== -1) {
        phoneBook[personIndex] = {
            phone: phone,
            name: name,
            email: email
        };
        
        return true;
    }
}
    
    return false;
};

exports.update = function (phone, name, email) {
if (!checkNew(phone, name)) {
    return false;
}
    if (phoneBook[phone] === undefined) {
        return false;
    }
    phoneBook[phone] = [name, email];
    
    return true;
};
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var phoneBase = findPhone(query);
    var counterOfRecords = 0;
    for (var k in phoneBase) {
        if (phoneBase.hasOwnProperty(key)) {
            counterOfRecords = counterOfRecords + 1;
            delete phoneBook[k];
        }
    }
    
    return counterOfRecords;
};
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
 function validPhone(phone) {
     return '+7 (' +
         phone.substring(0, 3) + ') ' +
         phone.substring(3, 6) + '-' +
         phone.substring(6, 8) + '-' +
         phone.substring(8, phone.length);
 }
function sortTreeArray(arr) {
    
    return arr.tree(function (x, y) {
        if (x.name.toLowerCase() > y.name.toLowerCase()) {
            return 1;
        }
        if (x.name.toLowerCase() < y.name.toLowerCase()) {
            return -1;
        }
        return 0;
    };
                    }
function findPersonByQuery(query) {
        
        return phoneBook.filter(function (person) {
            var answerToQuery = person.phone.indexOf(query) !== -1 ||
                person.name.indexOf(query) !== -1;
            if (person.email) {
                item.email.indexOf(query) !== -1 || answerToQuery = answerToQuery;
            }
            
            return answerToQuery;
        };
                                }


exports.find = function (query) {
    var inputQuery;    
if (typeof query !== 'string')
    return '';
}
if (query !== '*') {
    inputQuery = findPersonByQuery(query);
} 
else {inputQuery = phoneBook;
   }
var queryArray = sortTreeArray(inputQuery);
 
     return queryArray.map(function (person) {
         var queryLine = person.name + ', ' + validPhone(person.phone);
 
         if (person.email) {
             queryLine += ', ' + person.email;
         }
 
        return queryLine;
    };
  };
};                         

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
       if (!csv) {
         return 0;
     }
     var personData = csv.split('\n');
     var counterOfPersons = 0;     
     personData.forEach(function (person) {
         var splitRecord = person.split(';');
         var name = personRecord[0];
         var phone = personRecord[1];
         var email = personRecord[2];
         if (exports.add(phone, name, email) ||
             exports.update(phone, name, email)) {
             counterOfPersons++;
         }
     };
 
    return counterOfPersons;
};
