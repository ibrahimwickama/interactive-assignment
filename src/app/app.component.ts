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
  totalRec:any;
  page: number = 1;

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
    this.tempOrgUnuits = [];
    this.tempOrgUnuits = this.httpProvider.organisationUnits;
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
    this.tempOrgUnuits = null;
    this.tempOrgUnuits = this.httpProvider.organisationUnits;
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
    //console.log("DataSet OrgUnits "+JSON.stringify(dataSetOrgUnit));
   //console.log("Temp OrgUnits "+JSON.stringify(this.tempOrgUnuits));


      this.tempOrgUnuits.forEach((tempOrg:any)=>{

          if (dataSetOrgUnit.filter(e => e.id === tempOrg.id).length > 0) {
            tempOrg.checked = true;

            if(!tempOrg.assigned){
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, assigned: true}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, assigned: true})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }

          }else {
            tempOrg.checked = false;
            if(!tempOrg.assigned){
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, assigned: false}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, assigned: false})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }
          }
    });

   // console.log("Total edited OrgUnits "+JSON.stringify(this.tempOrgUnuits));
    // this.temp.push(dataSet.organisationUnits)
    this.temp.push(this.tempOrgUnuits)
    this.totalRec = this.tempOrgUnuits.length
  }


  checkBoxChanged(orgUnit,dataOrgUnit,assignedState,event){
    let eventt = event.target.checked
    //console.log("changed state is: "+JSON.stringify(eventt))
    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      if(tempOrg.id == orgUnit.id){
        tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
          if(orgUnitAssigned.id == dataOrgUnit.id ){
            orgUnitAssigned.assigned = eventt;
          }
        })
      }
    });
    //console.log("tempOrgUnit state is: "+JSON.stringify(this.tempOrgUnuits))
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
