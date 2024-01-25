import { Test, TestingModule } from '@nestjs/testing';
import { WorklogFileController } from './worklog-file.controller';
import { WorklogFileService } from './worklog-file.service';

describe('WorklogFileController', () => {
  let controller: WorklogFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorklogFileController],
      providers: [WorklogFileService],
    }).compile();

    controller = module.get<WorklogFileController>(WorklogFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
