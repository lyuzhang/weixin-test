/**
 * Created by DeLL on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');
const app = express();

const config = {
  appID : 'wxe368516e4e517445',
  appsecret :'9ca656b40ec0808dd8deff75bb194a93',
  token:'lyuzhangfirstweixingongzhonghao'

}
app.use((request,response,next)=>{
  console.log(request.query);
  /*
   * { signature: 'e0645fc903bf6c1d8269b8c95269b5f1306611b2',
   echostr: '8119588353218625279',
   timestamp: '1542364927',
   nonce: '678033483' }
   * */

  const {signature,echostr,timestamp,nonce} = request.query;
  const {token} = config;
  const arr = [timestamp,nonce,token].sort();
  console.log(arr);
  const str = sha1(arr.join(''));
  console.log(str);
  if(signature === str){
    response.end(echostr);
  }else {
    response.end('error');
  }


})



app.listen(3000,err =>{
  if(!err) console.log('服务器已启动！');
  else console.log(err);
})
