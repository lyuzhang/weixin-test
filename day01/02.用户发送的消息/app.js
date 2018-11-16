/**
 * Created by DeLL on 2018/11/16.
 */
/**
 * Created by DeLL on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');
const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('./utils/tools');
const app = express();

const config = {
  appID : 'wxe368516e4e517445',
  appsecret :'9ca656b40ec0808dd8deff75bb194a93',
  token:'lyuzhangfirstweixingongzhonghao'

}
app.use(async(request,response,next)=>{
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
 //console.log(arr);
  const str = sha1(arr.join(''));
  //console.log(str);
  if(request.method === 'GET'){
    if(signature === str){
      response.end(echostr);
    }else {
      response.end('error');
    }
  }else if(request.method === 'POST'){
    if(signature !== str){
      response.end('error');
      return;
    }
    const xmlData = await getUserDataAsync(request);
    console.log(xmlData);
/*
* <xml><ToUserName><![CDATA[gh_f5b89e4920fb]]></ToUserName>
      <FromUserName><![CDATA[oJpuY1HE2IM4xSymBVLdqhvRSaIk]]></FromUserName>
      <CreateTime>1542372481</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[发发]]></Content>
      <MsgId>6624439364568037264</MsgId>
 </xml>
* */
     const jsData = await parseXMLDataAsync(xmlData);
     console.log(jsData);
     /*
     * { xml:
      { ToUserName: [ 'gh_f5b89e4920fb' ],
      FromUserName: [ 'oJpuY1HE2IM4xSymBVLdqhvRSaIk' ],
      CreateTime: [ '1542373165' ],
      MsgType: [ 'text' ],
      Content: [ '伟伟' ],
      MsgId: [ '6624442302325667732' ] } }

      * */
     const message = formatMessage(jsData);
     console.log(message);

    //初始化文本
    let content = '你在说什么，我听不懂~';
    if(message.Content === '1'){
      content = '哈哈哈test成功！！';
    }else if(message.Content === '2'){
      content = '鸡犬升天';
    }else if (message.Content.includes('宝宝')){
      content ='baby宝宝真可爱！！';
    }

    let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
      </xml>`;
    response.send(replyMessage);


  }else{
    response.end('error');
  }




})



app.listen(3000,err =>{
  if(!err) console.log('服务器已启动！');
  else console.log(err);
})
