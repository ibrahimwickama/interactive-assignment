import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tour-comp',
  templateUrl: './tour-comp.component.html',
  styleUrls: ['./tour-comp.component.css']
})
export class TourCompComponent implements OnInit {
  @Output() closePop = new EventEmitter();
  @Output() changeSection = new EventEmitter();
   sectionState:number = 1;
  lowerDown:any;
  lowerLeft:any;
  header:string = 'org-unit selection';
  loadInfo:string = 'Click OrgUnit button to display and choose Organization units';

  constructor() {

  }

  ngOnInit() {
    this.changeSection.emit(1);
    // document.getElementsByName('[data-toggle="popover"]').popover();
  }

  closePopOver(){
    this.sectionState = 0;
    this.lowerDown = '';
    this.lowerLeft = '';
    this.closePop.emit(true);
  }

  prevClick(){
    if(this.sectionState >= 1){
      this.sectionState -=1;
      if(this.sectionState == 4){
        this.lowerDown = '140px';
        this.lowerLeft = '30%';
        this.header = 'assignment table'
      }else if(this.sectionState == 3){
        this.lowerDown = '400px';
        this.lowerLeft = '20%';
        this.header = 'layout switching';
      }else if(this.sectionState == 2){
        this.lowerDown = '400px';
        this.lowerLeft = '15%';
        this.header = 'data selection'
      }else if(this.sectionState == 1){
        this.lowerDown = '400px';
        this.lowerLeft = '11%';
        this.header = 'org-unit selection';
      }

      this.changeSection.emit(this.sectionState);

      if(this.sectionState == 1){
        this.loadInfo = 'Click OrgUnit button to display and choose Organization units';
      }else if(this.sectionState == 2){
        this.loadInfo = 'Here DataSets, Programs, DataElements or Indicators can be selected so as to assign them';
      }else if(this.sectionState == 3){
        this.loadInfo = 'Change Layout based on option of view preference, what to be on top head and what to be in rows';
      }else if(this.sectionState == 4){
        this.loadInfo = 'Finaly assignment table is present to and read for assignment of data.';
      }
    }


  }

  nextClick(){
    if(this.sectionState <= 4){
      this.sectionState +=1;
      if(this.sectionState == 4){
        this.lowerDown = '140px';
        this.lowerLeft = '30%';
        this.header = 'assignment table'
      }else if(this.sectionState == 3){
        this.lowerDown = '400px';
        this.lowerLeft = '20%';
        this.header = 'layout switching';
      }else if(this.sectionState == 2){
        this.lowerDown = '400px';
        this.lowerLeft = '15%';
        this.header = 'data selection'
      }else if(this.sectionState == 1){
        this.lowerDown = '400px';
        this.lowerLeft = '11%';
        this.header = 'org-unit selection';
      }
      this.changeSection.emit(this.sectionState);

     if(this.sectionState == 1){
        this.loadInfo = 'Click OrgUnit button to display and choose Organization units';
      }else if(this.sectionState == 2){
        this.loadInfo = 'Here DataSets, Programs, DataElements or Indicators can be selected so as to assign them';
      }else if(this.sectionState == 3){
        this.loadInfo = 'Change Layout based on option of view preference, what to be on top head and what to be in rows';
      }else if(this.sectionState == 4){
        this.loadInfo = 'Finaly assignment table is present to and read for assignment of data.';
      }

    }

  }


}
