import * as cheerio from 'cheerio';
import prices from './prices';
import {MenuParams, MenuCallback, CafeteriaParams, CafeteriaCallback, CafeteriaData} from '../../parser';

export function menus({data: page, date: startDate}: MenuParams, callback: MenuCallback) {
    const cached = this.cached = this.cached || {};
    const $ = cheerio.load(page);

    const parsePrice = (board: Cheerio) => {
        const price = {};
        const lis = board.find('li');
        if (lis.contents().length) return false;
        lis.each(li => {
            const tag = $(li).attr('class');
            let value = $(li).text();
            if (value.match(/[0-9]원/)) {
                value = value.replace(/[^0-9]/, '');
            }
            price[tag] = value;
        });
        return price;
    };
    
    cached.price = parsePrice($('.board')) || cached.price || prices;
    
    const cafeterias = {};
    $('td[scope=rowgroup]').each((i, td) => {
        cafeterias[$(td).text().trim()] = i;
    });
    
    const dates: {cafeteria: string, meals: {[item: string]: number}[]}[][] = [];
    for (let i = 0; i < 7; i++) {
        const date = [];
        for (let j = 0; j < Object.keys(cafeterias).length; j++) {
            date.push({});
        }
        dates.push(date);
    }
    
    let day = 0; // 0 = SUN, 1 = MON, ..., 6 = SAT
    let meal = 0; // 0 = BFST, 1 = LNCH, 2 = DNNR
    let cafeteria = null;
    
    const meals = ['아침', '점심', '저녁'];
    let onRemarksCell: boolean;
            
    const isCafeteriaNameCell = (td) => $(td).attr('scope') === 'rowgroup';
    
    $('.t_col td').each((_, td) => {
        const lis = $(td).find('li');
        const cellText = $(td).text().trim();
        
        const cellEmpty = !cellText;
        const cellHasItems = !!lis.contents().length;
        const onTagCell = !cellEmpty && !cellHasItems;
        const onMenuItemCell = cellHasItems || (!onRemarksCell && cellEmpty);
        
        if (onTagCell) {
            onRemarksCell = (cellText === '비고');
            if (isCafeteriaNameCell(td)) cafeteria = cellText.trim();
            if (meals.indexOf(cellText) > -1) meal = meals.indexOf(cellText);
        } else if (onMenuItemCell) {
            const result = dates[day][cafeterias[cafeteria]];
            
            result['cafeteria'] = result['cafeteria'] || cafeteria;
            result['meals'] = result['meals'] || [{}, {}, {}];
            
            lis.each((_, li) => {
                const item = $(li).text().trim();
                const symbol = $(li).attr('class');
                const price = cached.price[symbol] || prices.none;
                
                result['meals'][meal][item] = price;
            });
            
            day = (day + 1) % 7;
        }
    });
    
    dates.forEach((date, day) => {
        date.forEach(cafeteria => {
            const menuDate = new Date(startDate);
            menuDate.setDate(startDate.getDate() + (day - startDate.getDay()) % 7);
            callback({date: menuDate, data: cafeteria});
        });
    });
};

export function cafeterias(page: CafeteriaParams, callback: CafeteriaCallback) {
    const $ = cheerio.load(page);
    const tables = $('.basic_tbl').filter(i => i < 2);
    
    const onBreakPattern = /\(방학중 ([0-9]{2}:[0-9]{2})\)/;
    
    tables.each((i, table) => {
        const result: CafeteriaData = {
            cafeteria: i === 0 ? '919동' : '아워홈',
            hours: [],
            location: undefined
        };
        
        $(table).find('tr').each((i, tr) => {
            const tds = $(tr).find('td');
            if (i > 3) {
                result.location = tds.first().text().trim();
            } else {
                const search = function(days: string[]) {
                    for (let i = 0; i < result.hours.length; i++) {
                        const target = result.hours[i];
                        if (target.conditions.day.every(x => days.indexOf(x) != -1) &&
                            days.every(x => target.conditions.day.indexOf(x) != -1)) {
                            return target;
                        }
                    }
                    return null;
                };
                
                const update = function(days: string[], hours: string[]) {
                    let found = search(days);
                    if (!found) {
                        found = {
                            conditions: {
                                day: days,
                                opens_at: [],
                                closes_at: []
                            },
                        };
                        result.hours.push(found);
                    }
                    found.conditions.opens_at.push(hours[0].trim());
                    found.conditions.closes_at.push(hours[1].trim());
                };
                
                tds.each((i, td) => {
                    let text = $(td).text().trim();
                    const tokens = () => text.split('~');
                    let days = [i === 0 ? 'weekdays' : 'weekends'];
                    
                    if (parseInt($(td).attr('colspan'), 10) === 2) {
                        days = ['weekdays', 'weekends'];
                    }
                    
                    if (text.indexOf('방학중') != -1) {
                        const onBreakTokens = tokens().map(token => {
                            const match = token.match(onBreakPattern);
                            return (match && match[1]) || token;
                        });
                        
                        update(days.concat('break'), onBreakTokens);
                        
                        text = text.replace(onBreakPattern, '');
                    }
                    update(days, tokens());
                });
            }
        });
        callback(result);
    });
};
