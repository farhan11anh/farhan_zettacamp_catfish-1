import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {

  @Input() transaction:any

  constructor() { }

  ngOnInit(): void {
    console.log(this.transaction);
    
  }

}
