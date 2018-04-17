import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tour-comp',
  templateUrl: './tour-comp.component.html',
  styleUrls: ['./tour-comp.component.css']
})
export class TourCompComponent implements OnInit {
  @Output() closePop = new EventEmitter();
  @Output() changeSection = new EventEmitter();
   sectionState:number = 0;

  constructor() {

  }

  ngOnInit() {
    // document.getElementsByName('[data-toggle="popover"]').popover();
  }

  closePopOver(){
    this.closePop.emit(true);
  }

  prevClick(){
    this.sectionState -=1;
    this.changeSection.emit(this.sectionState);
  }

  nextClick(){
    this.sectionState +=1;
    this.changeSection.emit(this.sectionState);
  }


}
