import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CountLaufende, NewRuleSetGQL, RuleSetInput} from '../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './create-rule-set.component.html'})
export class CreateRuleSetComponent implements OnInit {

  allLaufendeCounts = [CountLaufende.Always, CountLaufende.OnlyLosers, CountLaufende.Never];

  ruleSetForm: FormGroup;

  loading = false;

  createdRulesetName: string;
  queryError: GraphQLError;

  constructor(private fb: FormBuilder, private newRuleSetGQL: NewRuleSetGQL) {
  }

  ngOnInit(): void {
    this.ruleSetForm = this.fb.group({
      name: ['', Validators.required],
      basePrice: [5, [Validators.required, Validators.min(1)]],
      soloPrice: [15, [Validators.required, Validators.min(1)]],
      countLaufende: [CountLaufende.Always, Validators.required],
      minLaufendeIncl: [3, Validators.required],
      maxLaufendeIncl: [8, Validators.required],
      laufendePrice: [5, Validators.required],
      geierAllowed: [false, Validators.required],
      bettelAllowed: [false, Validators.required],
      hochzeitAllowed: [false, Validators.required],
      ramschAllowed: [false, Validators.required],
      farbWenzAllowed: [false, Validators.required],
      farbGeierAllowed: [false, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.ruleSetForm.invalid) {
      console.error('Form is not valid!');
      return;
    }

    const ruleSetInput: RuleSetInput = {
      name: this.ruleSetForm.controls.name.value,
      basePrice: this.ruleSetForm.controls.basePrice.value,
      soloPrice: this.ruleSetForm.controls.soloPrice.value,
      countLaufende: this.ruleSetForm.controls.countLaufende.value,
      laufendePrice: this.ruleSetForm.controls.laufendePrice.value,
      minLaufendeIncl: this.ruleSetForm.controls.minLaufendeIncl.value,
      maxLaufendeIncl: this.ruleSetForm.controls.maxLaufendeIncl.value,
      geierAllowed: this.ruleSetForm.controls.geierAllowed.value,
      bettelAllowed: this.ruleSetForm.controls.bettelAllowed.value,
      hochzeitAllowed: this.ruleSetForm.controls.hochzeitAllowed.value,
      ramschAllowed: this.ruleSetForm.controls.ramschAllowed.value,
      farbWenzAllowed: this.ruleSetForm.controls.farbWenzAllowed.value,
      farbGeierAllowed: this.ruleSetForm.controls.farbGeierAllowed.value,
    };

    this.loading = true;

    this.newRuleSetGQL.mutate({ruleSetInput})
      .subscribe(
        ({data}) => {
          this.loading = false;
          this.createdRulesetName = data.createRuleSet;
        },
        (queryError) => {
          this.loading = false;
          this.queryError = queryError;
        }
      );
  }

}
