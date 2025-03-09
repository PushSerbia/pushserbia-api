import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpService } from './mailchimp.service';

describe('MailchimpService', () => {
  let service: MailchimpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailchimpService],
    }).compile();

    service = module.get<MailchimpService>(MailchimpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
