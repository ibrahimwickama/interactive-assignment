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
  tempOrgUnuits = [];
  checkedTrue:string = 'true';
  checkedTFalse:string = 'false';

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

    this.tempOrgUnuits = this.httpProvider.organisationUnits;
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
    let dataSetOrgUnit = [];
    this.selectedData.push(dataSet);
    this.selectedData = this.removeDuplicates(this.selectedData, 'id');

    // make complex functions
    dataSetOrgUnit = dataSet.organisationUnits;
    console.log("DataSet OrgUnits "+JSON.stringify(dataSetOrgUnit));
    console.log("Temp OrgUnits "+JSON.stringify(this.tempOrgUnuits));


    // if (vendors.filter(e => e.name === 'Magenic').length > 0) {
    //   /* vendors contains the element we're looking for */
    // }



      this.tempOrgUnuits.forEach((tempOrg:any)=>{
        dataSetOrgUnit.forEach((dataSetOrgnit:any)=>{

          if (dataSetOrgUnit.filter(e => e.id === tempOrg.id).length > 0) {
            /* vendors contains the element we're looking for */
            tempOrg.checked = 'checked';
          }else {
            tempOrg.checked = '';
          }


        // if(dataSetOrgnit['id'] == tempOrg['id'] ){
        //   tempOrg.checked = 'checked';
        //   ///console.log("was checked true "+JSON.stringify(tempOrg.checked));
        // }else {
        //   tempOrg.checked = '';
        //   //console.log("was checked false "+JSON.stringify(tempOrg.checked));
        // }
      });
    });

    console.log("Total edited OrgUnits "+JSON.stringify(this.tempOrgUnuits));
    this.temp.push(dataSet.organisationUnits)
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
