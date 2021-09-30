import { TestBed } from '@angular/core/testing';

import { UserprofileimageService } from './userprofileimage.service';

describe('UserprofileimageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserprofileimageService = TestBed.get(UserprofileimageService);
    expect(service).toBeTruthy();
  });
});
