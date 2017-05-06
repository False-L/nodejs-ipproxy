const Promise=require('bluebird');
let  mongoose=require('mongoose');
const koa=require('koa');
const app=new koa();
var router = require('koa-router')();
//const router = require('./routes');

Promise.promisifyAll(mongoose);
let Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/ipproxypool');
let IPpool=new Schema({
    ip:{type:String,unique:true}
})
let Ipproxy=mongoose.model('IP',IPpool);

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  var data=await Ipproxy.find({},function(err,ips){
    var ipmap=[];
     ips.forEach(function(ip){
         ipmap[ip._id]=ip;
         //console.log(ip)
     });
  })
  var map=data.map(ip=>ip.ip);
  ctx.response.type = 'text/json';
  ctx.response.body = map;
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.listen(3000);
console.log('server listen:3000')


