import { TestBed } from '@angular/core/testing';

import { FireCartService } from './fire-cart.service';

describe('FireCartService', () => {
  let service: FireCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
