import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-display',
  templateUrl: './options-display.component.html',
  styleUrls: ['./options-display.component.css']
})
export class OptionsDisplayComponent implements OnInit {

  instantSave: boolean = true;

  constructor() { }

  ngOnInit() {
  }


  toggleSavingMode(){
    if(this.instantSave){
      this.instantSave = false;
    }else{
      this.instantSave = true;
    }
  }

}
