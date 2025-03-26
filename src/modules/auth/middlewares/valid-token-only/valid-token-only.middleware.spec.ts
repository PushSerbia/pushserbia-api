import { ValidTokenOnlyMiddleware } from './valid-token-only.middleware';

describe('ValidTokenOnlyMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidTokenOnlyMiddleware()).toBeDefined();
  });
});
