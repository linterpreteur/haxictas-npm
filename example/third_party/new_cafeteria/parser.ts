import {Parser} from "../../../src/parser";

const parser: Parser = {
    menus: function* ({date}) {
        yield ({
            date: date,
            data: {
                cafeteria: '새로운 식당',
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
            }
        });
    },
    cafeterias: function* () {
        yield ({
            cafeteria: '새로운 식당',
            location: '사범대 어딘가',
            hours: [{
                conditions: {
                    day: ['monday', 'holidays'],
                    floor: '3층',
                    'opens_at': ['13:00'],
                    'closes_at': ['18:00']
                }
            }]
        });
    }
};
export default parser;
