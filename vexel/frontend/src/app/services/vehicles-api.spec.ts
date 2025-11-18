import { TestBed } from '@angular/core/testing';

import { VehiclesApi } from './vehicles-api';

describe('VehiclesApi', () => {
  let service: VehiclesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
