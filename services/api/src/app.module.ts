import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { WsModule } from './ws/ws.module';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { DevicesModule } from './devices/devices.module';
import { AssetsModule } from './assets/assets.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { PlayerModule } from './player/player.module';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // Serve /uploads from local disk
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads'),
      serveRoot: '/uploads',
    }),
    WsModule,
    AuthModule,
    StoresModule,
    DevicesModule,
    AssetsModule,
    PlaylistsModule,
    DeploymentsModule,
    PlayerModule,
    CallsModule,
  ],
})
export class AppModule {}
