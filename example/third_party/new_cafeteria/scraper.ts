import {Scraper} from "../../../src/scraper";

module.exports = <Scraper>{
    menus: (date, callback) => {
        callback({
            date: date,
            data: `
            <div>
                <h1>새로운 식당</h1>
                <p id="breakfast"></p>
                <p id="lunch">토스트 2500원, 돈까스 4000원</p>
                <p id="dinner">카레라이스 6000원, 콜라 0.5</p>
            </div>`
        });
    },
    cafeterias: (callback) => {
        callback(
            `<div>
                <h1>새로운 식당</h1>
                <div class="address">사범대 어딘가</div>
                <h3>3층</h3>
                <div>
                    <span class="highlight">월요일</span>
                    13:00 ~ 18:00
                </div>
                <div>
                    <span class="highlight">일요일/공휴일</span>
                    13:00 ~ 18:00
                </div>
            </div>`
        );
    }
};
