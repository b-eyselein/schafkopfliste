import {Component, OnInit} from '@angular/core';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;

  sessionForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private apiService: ApiService) {
    this.sessionForm = fb.group({
      ruleSetId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((g) => this.group = g);
    });
  }

  createSession(): void {
    console.warn('TODO: create session...');
  }

}
