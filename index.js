const cheerio=require('cheerio');
const fetch =require('node-fetch');
const Promise=require('bluebird');
let  mongoose=require('mongoose');

Promise.promisifyAll(mongoose);
let Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/ipproxypool');
let IPpool=new Schema({
    ip:{type:String,unique:true}
})
let Ipproxy=mongoose.model('IP',IPpool);

function fetchUrl(url){
    fetch(url,{
        method:'get',
        headers:{
        }
    })
    .then(res=>res.text())
    .then(body=>{
       let $=cheerio.load(body);
       let length=$('#list table tbody').find('tr').length;
       for (let i=0;i<length;i++){
       let ipaddress= $('#list table tbody').find('tr').eq(i).find('td').eq(0).text() ;
       let port = $('#list table tbody').find('tr').eq(i).find('td').eq(1).text();
       console.log(`IP:${ipaddress}:${port}`);
       let ip=`${ipaddress}:${port}`
       let ippool=new Ipproxy({
           ip:ip
       })
       ippool.save();
       }
    })
    .then()
}
function fetchxici(url){
    fetch(url,{
        method:'get',
        headers:{
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Host':'www.xicidaili.com',
            'If-None-Match':'W/"95b8d28718854c9a86af2fe958125a5e"',
            'Referer':'http://www.xicidaili.com/nn/3',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.25 Safari/537.36'
        }
    })
    .then(res=>res.text())
    .then(body=>{
        //console.log(body);
       let $=cheerio.load(body);
       let length=$('#body').find('table').find('tr').length;
       // var s=$('#body').find('table').find('tr').eq(1);
      // console.log(length);
       for (let i=1;i<length;i++){
       let ipaddress= $('#body').find('table').find('tr').eq(i).find('td').eq(1).text() ;
       let port = $('#body').find('table').find('tr').eq(i).find('td').eq(2).text();
       console.log(`IP:${ipaddress}:${port}`);
       let ip=`${ipaddress}:${port}`
       let ippool=new Ipproxy({
           ip:ip
       })
       ippool.save();
       }
    })
    .then()
}
function fetchpremproxy(url){
    fetch(url,{
        method:'get',
        headers:{
        }
    })
    .then(res=>res.text())
    .then(body=>{
       let $=cheerio.load(body);
       let length=$('#proxylist').find('tr').length;
        console.log(length);
       for (let i=1;i<length;i++){
       let ip= $('#proxylist').find('tr').eq(i).find('td').eq(0).text() ;
       console.log(`IP:${ip}`);
       let ippool=new Ipproxy({
           ip:ip
       })
       ippool.save();
       }
    })
    .then()
}
var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('ok');
        }, time);
    })
};
const pageNumber=10;
var start = async function(){
    for(let j=1;j<pageNumber;j++){
         console.log(`当前是第${j}次等待..`);
        fetchUrl(`http://www.kuaidaili.com/free/inha/${j}/`);
        fetchxici(`http://www.xicidaili.com/nn/${j}`);
        /*let t=0; //
        if(j<10) {
        fetchpremproxy(`https://premproxy.com/proxy/proxy-0${j}.htm`);
        }else{
            fetchpremproxy(`https://premproxy.com/proxy/proxy-${j}.htm`);
        }*/
        await sleep(1500);
    }
}
start();