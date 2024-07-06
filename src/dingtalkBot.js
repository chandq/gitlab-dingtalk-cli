/*
 * @Description: Gitlab CI 往Dingtalk推送消息的Class
 * @Date: 2024-07-06 17:05:56
 * @LastEditors: chendq
 * @LastEditTime: 2024-07-06 19:58:45
 * @Author      : chendq
 */
const crypto = require('crypto');
const axios = require('axios');
const encryptSign = (secret, content) => {
  const str = crypto.createHmac('sha256', secret).update(content).digest().toString('base64');
  return encodeURIComponent(str);
};

/**
 * 钉钉机器人 WebHook：用于支持钉钉机器人消息发送
 *
 * 官方文档：https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
 */
class DingtalkBot {
  /**
   * 机器人工厂，所有的消息推送项目都会调用 this.webhook 接口进行发送
   *
   * @param {String} options.webhook 完整的接口地址
   * @param {String} options.baseUrl 接口地址
   * @param {String} options.accessToken accessToken
   * @param {String} options.secret secret
   */
  constructor(options) {
    options = options || {};
    if (!options.webhook && !(options.accessToken && options.baseUrl)) {
      throw new Error('Lack for arguments!');
    }
    // 优先使用 options.webhook
    // 次之将由 options.baseUrl 和 options.accessToken 组合成一个 webhook 地址
    this.webhook = options.webhook || `${options.baseUrl}?access_token=${options.accessToken}`;
    this.secret = options.secret;
  }

  /**
   * 发送钉钉消息
   *
   * @param {Object} content 发动的消息对象
   * @return {Promise}
   */
  send(content) {
    let singStr = '';
    if (this.secret) {
      const timestamp = Date.now();
      singStr = '&timestamp=' + timestamp + '&sign=' + encryptSign(this.secret, timestamp + '\n' + this.secret);
    }
    return axios.request(this.webhook + singStr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(content)
    });
  }

  /**
   * 发送纯文本消息，支持@群内成员
   *
   * @param {String} content 消息内容
   * @param {Object} at 群内@成员的手机号
   * @return {Promise}
   */
  text(content, at) {
    at = at || {};
    return this.send({
      msgtype: 'text',
      text: {
        content
      },
      at
    });
  }

  /**
   * 发送actionCard(动作卡片)
   * Ps: 支持多个按钮，支持Markdown
   *
   * @param {String} card.title 标题
   * @param {String} card.text 消息内容
   * @param {String} card.btnOrientation 按钮排列的方向(0竖直，1横向，默认为0)
   * @param {String} card.btn.title 某个按钮标题
   * @param {String} card.btn.actionURL 某个按钮链接
   * @return {Promise}
   */
  actionCard(card) {
    return this.send({
      msgtype: 'actionCard',
      actionCard: {
        title: card.title,
        text: card.text,
        btnOrientation: card.btnOrientation || 0,
        btns: card.btns || []
      }
    });
  }
}

module.exports = DingtalkBot;
