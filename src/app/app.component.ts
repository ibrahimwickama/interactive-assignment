import {Component, OnInit} from '@angular/core';
import {HttpProviderService} from "./services/http-provider.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  sheetHeight:any;
  orgUintActive:string;
  dataSetActive:string;
  programActive:string;
  showOrgUnits:boolean = false;
  showDataSets:boolean = false;
  showPrograms:boolean = false;
  selectedData = [];
  temp = [];


  constructor(private httpProvider: HttpProviderService){

  }

  ngOnInit(){

  }

  showOrgunit(){
    this.sheetHeight = '0px';

    // delays a function for a period of time
    Observable.interval(500).take(4).subscribe(() => {
    this.showOrgUnits = true;
    this.orgUintActive = 'active';
    this.showDataSets = false;
    this.showPrograms = false;
    this.sheetHeight = '400px';
  });
  }

  showDataSet(){
    this.selectedData = [];
    this.temp = [];
    this.sheetHeight = '0px';
    // delays a function for a period of time
    Observable.interval(500).take(4).subscribe(() => {
      this.showDataSets = true;
      this.dataSetActive = 'active';
      this.orgUintActive = '';
      this.programActive = '';
      this.showOrgUnits = false;
      this.showPrograms = false;
      this.sheetHeight = '400px';
    });

  }

  showProgram(){
    this.selectedData = [];
    this.temp = [];
    this.sheetHeight = '0px';
    // delays a function for a period of time
    Observable.interval(500).take(4).subscribe(() => {
    this.showPrograms = true;
    this.programActive = 'active';
    this.dataSetActive = '';
    this.orgUintActive = '';
    this.showOrgUnits = false;
    this.showDataSets = false;
    this.sheetHeight = '400px';
    });
  }

  receiveData(dataSet){
    this.selectedData.push(dataSet);
    this.selectedData = this.removeDuplicates(this.selectedData, 'id');
    this.temp.push(this.selectedData.length)
  }


  removeDuplicates(originalArray, key) {
    let newArray = [];
    let lookupObject  = {};

    for(var i in originalArray) {
      lookupObject[originalArray[i][key]] = originalArray[i];
    }
    for(i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }




}
