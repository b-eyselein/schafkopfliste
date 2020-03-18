import { TestBed } from '@angular/core/testing';

import { RuleSetListGqlService } from './rule-set-list-gql.service';

describe('RuleSetListGqlService', () => {
  let service: RuleSetListGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuleSetListGqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
