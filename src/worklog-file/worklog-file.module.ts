import { Module } from '@nestjs/common';
import { WorklogFileService } from './worklog-file.service';
import { WorklogFileController } from './worklog-file.controller';

@Module({
  controllers: [WorklogFileController],
  providers: [WorklogFileService]
})
export class WorklogFileModule {}
