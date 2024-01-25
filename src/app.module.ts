import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorklogFileModule } from './worklog-file/worklog-file.module';

@Module({
  imports: [WorklogFileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
