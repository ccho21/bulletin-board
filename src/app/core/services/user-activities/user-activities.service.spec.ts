import { TestBed } from '@angular/core/testing';

import { UserActivitiesService } from './user-activities.service';

describe('UserActivitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserActivitiesService = TestBed.get(UserActivitiesService);
    expect(service).toBeTruthy();
  });
});
