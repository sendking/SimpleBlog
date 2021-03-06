/*
 * @Author: jinhaidi
 * @Date: 2019-10-16 23:06:32
 * @Description: 权限模块控制器
 * @LastEditTime: 2019-10-20 22:33:54
 */

import config from '@app/app.config'
import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
// import { IpService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/assite/email.service'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { AuthService } from './auth.service'
import { Auth, AuthLogin, ITokenResult } from './auth.model'

@Controller('auth')
export class AuthController {
  constructor(
    // private readonly ipService: IpService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) { }

  @Get('admin')
  @HttpProcessor.handle('获取管理员信息')
  getAdminInfo(): Promise<Auth> {
    return this.authService.getAdminInfo()
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改管理员信息')
  putAdminInfo(@Body() auth: Auth): Promise<Auth> {
    return this.authService.putAdminInfo(auth)
  }

  @Post('admin')
  addAdmin(@Body() auth: Auth): Promise<any> {
    return this.authService.addAdmin(auth)
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  createToken(@QueryParams() { visitors: { ip } }, @Body() body: AuthLogin): Promise<ITokenResult> {
    return this.authService
      .adminLogin(body.password)
      .then(token => {
        console.log(ip)
        // this.ipService
        //   .query(ip)
        //   .then(ipLocation => {
        //     const subject = '博客有新的登陆行为'
        //     const city = ipLocation && ipLocation.city || '未知城市'
        //     const country = ipLocation && ipLocation.country || '未知国家'
        //     const content = `来源 IP：${ip}，地理位置为：${country} - ${city}`
        //     this.emailService.sendMail({
        //       subject,
        //       to: config.EMAIL.admin,
        //       text: `${subject}，${content}`,
        //       html: `${subject}，${content}`,
        //     })
        //   })
        return token
      })
  }

  // 检测 Token 有效性
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok'
  }
}
