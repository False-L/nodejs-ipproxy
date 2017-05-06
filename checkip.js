const Promise=require('bluebird');
let  mongoose=require('mongoose');
const koa=require('koa');
const app=new koa();
var router = require('koa-router')();
//const router = require('./routes');
var http = require('http')
const fetch =require('node-fetch');
const async=require('async')

Promise.promisifyAll(mongoose);
let Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/ipproxypool');
let IPpool=new Schema({
    ip:{type:String,unique:true}
})
let Ipproxy=mongoose.model('IP',IPpool);

/*检测成功的ip放入IPpoolList表中
let IPList=new Schema({
    ip:{type:String,unique:true}
})
let IpproxyList=mongoose.model('IP',IPList);

/****************************/
function  checkip(ip){
    let host=ip.split(':');
   var opt = {
          host:`${host[0]}`,
          port:`${host[1]}`,
          method:'POST',//这里是发送的方法
          path:'http://www.baidu.com', 
          header:{
              
          }
      }
//以下是接受数据的代码
var body = '';
var req = http.request(opt, function(res) {
  console.log("Got response: " + res.statusCode);
  res.on('data',function(d){
  body += d;
 }).on('end', function(){
  console.log(res.headers)
  console.log(body)
 });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
  var conditions = { ip: ip };
  Ipproxy.remove(conditions,function(err){
    if(err){console.log(err)}
    else{
      console.log("delete success!")
    }
  })
})
req.end();
}
////////////////
let start=async function(){
  var data=await Ipproxy.find({},function(err,ips){
    var ipmap=[];
     ips.forEach(function(ip){
         ipmap[ip._id]=ip;
     })
  })
   //console.log(data);
   var map=data.map(ip=>ip.ip);
 //  let ipstr=map[0]
   map.map((ip)=>{
       checkip(ip)
   })

}
start()
