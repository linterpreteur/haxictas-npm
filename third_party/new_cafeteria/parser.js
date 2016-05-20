module.exports = {
    menus: (page, callback) => {
        // For the first argument (offset),
        // Please refer to ourhome/parser.
        callback(0, {
            cafteria: '새로운 식당',
            /*
            * 'date' should be injected
            * through the callback function
            */
            meals: [{
                /* NONE */
            }, {
                토스트: 2500,
                돈까스: 4000
            }, {
                카레라이스: 6000,
                콜라: '기타'
            }]
        });
    },
    cafeterias: (page, callback) => {
        callback({
            cafeteria: '새로운 식당',
            location: '사범대 어딘가',
            hours: [{
                conditions: {
                    day: ['monday', 'holidays'],
                    floor: '3층',
                    opens_at: '13:00',
                    closes_at: '18:00'
                }
            }]
        });
    }
};