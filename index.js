const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const moment = require('moment');
const schedule = require('node-schedule');

console.log(`
 ██████╗ ███████╗███╗   ██╗███████╗██╗  ██╗██╗███╗   ██╗    ████████╗ ██████╗  ██████╗ ██╗     
██╔════╝ ██╔════╝████╗  ██║██╔════╝██║  ██║██║████╗  ██║    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     
██║  ███╗█████╗  ██╔██╗ ██║███████╗███████║██║██╔██╗ ██║       ██║   ██║   ██║██║   ██║██║     
██║   ██║██╔══╝  ██║╚██╗██║╚════██║██╔══██║██║██║╚██╗██║       ██║   ██║   ██║██║   ██║██║     
╚██████╔╝███████╗██║ ╚████║███████║██║  ██║██║██║ ╚████║       ██║   ╚██████╔╝╚██████╔╝███████╗
 ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
                           Auto Daily Login Hoyolab v.1.0
   `);

/*

NOTE : THIS TOOL AUTO CHECKIN AT 03:00 AM UTC+7

*/

var mhyuuids = readlineSync.question('_MHYUUID : ');
var cookietokens = readlineSync.question('cookie_token : ');
var accIds = readlineSync.question('Account_Id : ');

console.log('');

var cookie = `mi18nLang=en-us; _MHYUUID=${mhyuuids}; cookie_token=${cookietokens}; account_id=${accIds}`

const getUid = () => new Promise((resolve, reject) => {

    fetch('https://api-os-takumi.mihoyo.com/community/user/wapi/getUserFullInfo', {
        headers: {
            'authority': 'api-os-takumi.mihoyo.com',
            'sec-ch-ua': '^\^Google',
            'accept': 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            'sec-ch-ua-platform': '^\^Windows^\^',
            'origin': 'https://webstatic-sea.mihoyo.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://webstatic-sea.mihoyo.com/',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookie
        }
    })
    .then(async res => {
        const newResult = {
            cookie: res.headers.raw()['set-cookie'],
            body: await res.json()
        }
        resolve(newResult)
    })
    .catch(err => {
        reject(err)
    })
});

const accountInfo = (cookieToken, accountId, ltoken, ltuid) => new Promise((resolve, reject) => {

    fetch('https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global&region=os_asia', {
        headers: {
            'authority': 'api-os-takumi.mihoyo.com',
            'sec-ch-ua': '^\^Google',
            'ds': '1631545415,AdfxYp,85fbc75f24148481ad7f6c91e911ac1c',
            'x-rpc-language': 'en-us',
            'x-rpc-app_version': '1.5.0',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            'accept': 'application/json, text/plain, */*',
            'x-rpc-client_type': '5',
            'sec-ch-ua-platform': '^\^Windows^\^',
            'origin': 'https://webstatic-sea.hoyolab.com',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://webstatic-sea.hoyolab.com/',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': `${cookieToken}; ${accountId}; ${ltoken}; ${ltuid}`
        }
    })
    .then(res => res.json())
    .then(res => {
        resolve(res)
    })
    .catch(err => {
        reject(err)
    })
});

const dailycheckIn = (actid) => new Promise((resolve, reject) => {

    fetch('https://hk4e-api-os.mihoyo.com/event/sol/sign?lang=en-us', {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '^\^Google',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            'sec-ch-ua-platform': '^\^Windows^\^',
            'Origin': 'https://webstatic-sea.mihoyo.com',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://webstatic-sea.mihoyo.com/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': cookie
        },
        body: JSON.stringify({"act_id":actid})
    })
    .then(res => res.json())
    .then(res => {
        resolve(res)
    })
    .catch(err => {
        reject(err)
    })
});

const infoCheckIn = (actid) => new Promise((resolve, reject) => {

    fetch(`https://hk4e-api-os.mihoyo.com/event/sol/info?lang=en-us&act_id=${actid}`, {
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '^\^Google',
            'Accept': 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            'sec-ch-ua-platform': '^\^Windows^\^',
            'Origin': 'https://webstatic-sea.mihoyo.com',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://webstatic-sea.mihoyo.com/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': cookie
        }
    })
    .then(res => res.json())
    .then(res => {
        resolve(res)
    })
    .catch(err => {
        reject(err)
    })
});

const awardRecord = (actid) => new Promise((resolve, reject) => {

    fetch(`https://hk4e-api-os.mihoyo.com/event/sol/award?current_page=1&lang=en-us&page_size=10&act_id=${actid}`, {
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '^\^Google',
            'Accept': 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
            'sec-ch-ua-platform': '^\^Windows^\^',
            'Origin': 'https://webstatic-sea.mihoyo.com',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://webstatic-sea.mihoyo.com/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': cookie
        }
    })
    .then(res => res.json())
    .then(res => {
        resolve(res)
    })
    .catch(err => {
        reject(err)
    })
});

(async () => {



    if (!cookie) {
        console.log('No cookie detected ! Please input your cookie first ! ^_^');
    } else {

        const resultGetUid = await getUid();
    
        // Required for accountInfo cookies 
        const ltoken = resultGetUid.cookie[0].split(';')[0];
        const ltuid = resultGetUid.cookie[1].split(';')[0];
        const cookieToken = cookie.split(';')[2].trim()
        const accountId = cookie.split(';')[3].trim()
        
        const resultAccountInfo = await accountInfo(ltoken, ltuid, cookieToken, accountId);
    
        // In game data
        const ingameUid = resultAccountInfo.data.list[0].game_uid;
        const region = resultAccountInfo.data.list[0].region_name;
        const nickname = resultAccountInfo.data.list[0].nickname;
        const level = resultAccountInfo.data.list[0].level;
        const actid = 'e202102251931481';

        // Here is your account info from cookie
        console.log(chalk.yellowBright(`[+] UID     : ${ingameUid}`));
        console.log(chalk.yellowBright(`[+] Server  : ${region}`));
        console.log(chalk.yellowBright(`[+] IGN     : ${nickname}`));
        console.log(chalk.yellowBright(`[+] Level   : ${level}`));
        console.log('\n');
    
        const resultCheckIn = await dailycheckIn(actid);
    
        // Status daily check in
        const retcode = resultCheckIn.retcode;
    
        // I forgot what it is haha 
        const getInfoCheckIn = await infoCheckIn(actid);
        const loginTotal = getInfoCheckIn.data.total_sign_day; 
        const alreadySign = getInfoCheckIn.data.is_sign;
        const today = getInfoCheckIn.data.today;

        // Award record
        const getAwardRecord = await awardRecord(actid);
        const rewardToday = getAwardRecord.data.list[0].name;
        const receivedInfo = getAwardRecord.data.list[0].created_at;
        const receivedDay = receivedInfo.split(' ')[0];
        const receivedTime = receivedInfo.split(' ')[1];
        const count = getAwardRecord.data.list[0].cnt;
    
        
        schedule.scheduleJob('0 3 * * *', () => {
            if (retcode == '-5003') {
                console.log(chalk.redBright(`[ ${moment().format('DD:MM:YYYY hh:mm:ss')} ] Already Sign In at ${receivedDay} ${receivedTime} | Reward : ${rewardToday} x${count}`));
            } else if (retcode == '0') {
                 console.log(chalk.greenBright(`[ ${moment().format('DD:MM:YYYY hh:mm:ss')} ] Success Sign In at ${receivedDay} ${receivedTime} | Reward : ${rewardToday} x${count}`));
            }
        })


    }
})();


