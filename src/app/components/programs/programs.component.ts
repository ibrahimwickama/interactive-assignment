import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpProviderService} from "../../services/http-provider.service";

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  initPrograms:any = [];
  initProgramsBackUp:any = [];

  @Output() exportedProgram = new EventEmitter();

  constructor(private httpProvider: HttpProviderService) { }

  ngOnInit() {
    this.callPrograms();
  }

  callPrograms(){
    if(this.httpProvider.programsFromServer.length <= 0) {
      this.httpProvider.programCaller().subscribe(response => {
        this.initPrograms = this.httpProvider.programsFromServer;
        this.initProgramsBackUp = this.httpProvider.programsFromServer;
      });
    }else {
      this.initPrograms = this.httpProvider.programsFromServer;
      this.initProgramsBackUp = this.httpProvider.programsFromServer;
    }
  }

  selectedProgram(selectedProgram){
    this.exportedProgram.emit(selectedProgram);
  }

  getFilteredList(ev) {
    let val = ev.target.value;
    // console.log("the value : "+val);
    this.initPrograms = this.initProgramsBackUp;
    if(val && val.trim() != ''){
      this.initPrograms = this.initPrograms.filter((file:any) => {
        return (file.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.initPrograms = this.initProgramsBackUp;
    }
  }

}
