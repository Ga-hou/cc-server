import { Injectable } from '@nestjs/common';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailUtil {
  async send(email: string, password: string) {
    const transporter: Transporter = createTransport({
      service: 'qq',
      port: 465,
      auth: {
        user: 'jiahaoliao@vip.qq.com',
        pass: 'adewcjjzfyexbbeg', //授权码,通过QQ获取
      },
    });
    const sendMailOptions: SendMailOptions = {
      from: 'jiahaoliao@vip.qq.com',
      to: email,
      subject: '客服系统密码',
      html: `您的登录密码为：${password}`,
    };

    return await transporter.sendMail(sendMailOptions);
  }
}
