import { TestBed } from '@angular/core/testing';

import { GroupGqlService } from './group-gql.service';

describe('GroupGqlService', () => {
  let service: GroupGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupGqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
