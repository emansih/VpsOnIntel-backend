import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LighshipService } from './lightship.service';
import { HttpModule } from '@nestjs/axios';
import { LightshipAuthService } from './lightshipauth.service';
import { ConfigModule } from '@nestjs/config';
import { LightshipAuthRepository } from './lightshipauthrepository.service';
import { AuthStoreService } from './authstore.service';
import { TrustMasterRepo } from './trustmasterrepo.service';
import { TrustMaster } from './trustmaster.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [LighshipService, LightshipAuthService, LightshipAuthRepository, AuthStoreService, TrustMasterRepo, TrustMaster],
  exports: [LighshipService, LightshipAuthService, LightshipAuthRepository, AuthStoreService, TrustMasterRepo, TrustMaster]
})
export class AppModule {}
