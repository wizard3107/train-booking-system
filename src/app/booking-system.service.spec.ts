import { TestBed } from '@angular/core/testing';

import { BookingSystemService } from './booking-system.service';

describe('BookingSystemService', () => {
  let service: BookingSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
