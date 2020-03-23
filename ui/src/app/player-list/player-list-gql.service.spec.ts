import { TestBed } from '@angular/core/testing';

import { PlayerListGqlService } from './player-list-gql.service';

describe('PlayerListService', () => {
  let service: PlayerListGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerListGqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
