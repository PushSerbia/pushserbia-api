import { Test, TestingModule } from '@nestjs/testing';
import { LinkedinAuthService } from './linkedin-auth.service';

describe('LinkedinAuthService', () => {
  let service: LinkedinAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkedinAuthService],
    }).compile();

    service = module.get<LinkedinAuthService>(LinkedinAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
