import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {read as xlsx_read, utils as xlsx_utils, WorkBook, WorkSheet} from 'xlsx';
import {GameRow, header, readGameFromGameRow, readSession} from './spreadsheet-helpers';
import {Game, Session} from '../_interfaces/model';
import {Group} from '../_interfaces/group';


@Component({templateUrl: './upload-spreadsheet.component.html'})
export class UploadSpreadsheetComponent implements OnInit {

  group: Group;
  session: Session;
  readGames: Game[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroup(groupId)
        .subscribe((group) => this.group = group);
    });
  }

  readFile(fileList: FileList): void {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const wb: WorkBook = xlsx_read(fileReader.result, {type: 'binary', cellDates: true});

      const ws: WorkSheet = wb.Sheets[wb.SheetNames[0]];

      const firstPlayerAbbreviation: string = ws['F4'].v;
      const secondPlayerAbbreviation: string = ws['E5'].v;
      const thirdPlayerAbbreviation: string = ws['E6'].v;
      const fourthPlayerAbbreviation: string = ws['E7'].v;

      console.info(firstPlayerAbbreviation + ' :: ' + secondPlayerAbbreviation + ' :: ' + thirdPlayerAbbreviation + ' :: ' + fourthPlayerAbbreviation);

      this.session = readSession(this.group, ws);

      this.readGames = xlsx_utils.sheet_to_json<GameRow>(ws, {header, range: 11})
        .map((gr) => readGameFromGameRow(this.group.id, this.session.id, gr));
    };

    fileReader.readAsBinaryString(fileList.item(0));
  }

}
