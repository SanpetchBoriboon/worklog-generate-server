import { Test, TestingModule } from '@nestjs/testing';
import { WorklogFileService } from './worklog-file.service';

describe('WorklogFileService', () => {
  let service: WorklogFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorklogFileService],
    }).compile();

    service = module.get<WorklogFileService>(WorklogFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
