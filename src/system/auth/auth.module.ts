import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { AuthStrategy } from './auth.strategy';
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthService, CryptoUtil, AuthStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
