import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {read as xlsx_read, utils as xlsx_utils, WorkBook, WorkSheet} from 'xlsx';
import {GameRow, header, readGameFromGameRow, readSessionDateAndPlayers} from './spreadsheet-helpers';
import {Game, Player} from '../_interfaces/interfaces';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';


@Component({templateUrl: './upload-spreadsheet.component.html'})
export class UploadSpreadsheetComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;
  sessionDate: Date;
  sessionPlayers: Player[];
  readGames: Game[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((group) => this.group = group);
    });
  }

  readFile(fileList: FileList): void {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const wb: WorkBook = xlsx_read(fileReader.result, {type: 'binary', cellDates: true});

      const ws: WorkSheet = wb.Sheets[wb.SheetNames[0]];

      const {date, players} = readSessionDateAndPlayers(this.group.players, ws);
      this.sessionDate = date;
      this.sessionPlayers = players;

      this.readGames = xlsx_utils.sheet_to_json<GameRow>(ws, {header, range: 11})
        .map((gr) => readGameFromGameRow(this.group.id, -1, gr));
    };

    fileReader.readAsBinaryString(fileList.item(0));
  }

}
