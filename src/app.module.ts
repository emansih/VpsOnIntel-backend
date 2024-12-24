import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LighshipService } from './lightship.service';
import { HttpModule } from '@nestjs/axios';
import { LightshipAuthService } from './lightshipauth.service';
import { ConfigModule } from '@nestjs/config';
import { LightshipAuthRepository } from './lightshipauthrepository.service';
import { AuthStoreService } from './authstore.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [LighshipService, LightshipAuthService, LightshipAuthRepository, AuthStoreService],
  exports: [LighshipService, LightshipAuthService, LightshipAuthRepository, AuthStoreService]
})
export class AppModule {}
