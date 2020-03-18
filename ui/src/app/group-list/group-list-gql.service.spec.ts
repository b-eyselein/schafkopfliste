import { TestBed } from '@angular/core/testing';

import { GroupListGqlService } from './group-list-gql.service';

describe('GroupListGqlService', () => {
  let service: GroupListGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupListGqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
