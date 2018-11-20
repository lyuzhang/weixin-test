/**
 * Created by DeLL on 2018/11/20.
 */
//获取access_token
const rp = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID,appsecret} = require('../config/config');
class Wechat {
  async getAccessToken(){
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET';
    const result = await rp({method:'GET',url,json:true});
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }

  saveAccessToken(filePath,accessToken){
    return new Promise((resolve,reject) => {
      writeFile(filePath,JSON.stringify(accessToken),err =>{
        if(!err){
          resolve();
        }else {
          reject('saveAccessToken方法出问题了' + err);
        }
      })
    })
  }

  readAccessToken(filePath){
    return new Promise((resolve,reject) => {
      readFile(filePath, (err, data) => {
        //读取的data数据  二进制数据，buffer
        if (!err) {
          //先调用toString转化为json字符串
          //在调用JSON.parse将json字符串解析为js对象
          resolve(JSON.parse(data.toString()));
        } else {
          reject('readAccessToken方法出了问题:' + err);
        }
      })
    })
  }

  isValidAccessToken({expire_in}){
    return Date.now() < expire_in;
  }

  fetchAccessToken () {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)){
      return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in})
    }

    return this.readAccessToken('./accessToken.txt')
      .then(async res => {
        if (this.isValidAccessToken(res)){
          return res;
        }else{
          const accessToken = await this.getAccessToken();
          await this.saveAccessToken('./accessToken.txt',accessToken);
          return accessToken;
        }
      })
      .catch(async err => {
        const accessToken = await this.getAccessToken();
        await this.saveAccessToken('./accessToken.txt',accessToken);
        return accessToken;
      })
      .then(res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      })

  }

}



(async () => {
  const w = new Wechat();
  let result = await w.fetchAccessToken();
  console.log(result);
})()