import { TestBed } from '@angular/core/testing';

import { NewdashboardService } from './newdashboard.service';

describe('NewdashboardService', () => {
  let service: NewdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
