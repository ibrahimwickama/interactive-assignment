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
  totalRec:any;
  page: number = 1;
  itemsOnPage: number = 10;
  dataAssign:any = {id:'',dataSet:'', orgUnits:{organisationUnits:[]}};
  dataSetToUpdate:any ={dataSets:[]};
  programToUpdate:any ={programs:[]};

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
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }

          }else {
            tempOrg.checked = false;
            if(!tempOrg.assigned){
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }
          }
    });

   // console.log("Total edited OrgUnits "+JSON.stringify(this.tempOrgUnuits));
    // this.temp.push(dataSet.organisationUnits)
    this.temp.push(this.tempOrgUnuits);
    this.totalRec = this.tempOrgUnuits.length
  }


  checkBoxChanged(orgUnit,dataOrgUnit,assignedState,event){
    let eventt = event.target.checked;
    let orgUnitChanges = [];
    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      if(tempOrg.id == orgUnit.id){
        tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
          if(orgUnitAssigned.id == dataOrgUnit.id ){
            orgUnitAssigned.assigned = eventt;
          }
        })
      }
    });

    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
        if(orgUnitAssigned.id === dataOrgUnit.id){
          if(orgUnitAssigned.assigned){
            orgUnitChanges.push({id: tempOrg.id})
          }
        }
      });
    });

    this.dataAssign.id = dataOrgUnit.id;
    this.dataAssign.dataSet = dataOrgUnit.displayName;
    this.dataAssign.orgUnits.organisationUnits = orgUnitChanges;
    //console.log("OrgUnitChanges is: "+JSON.stringify(this.dataAssign));


    if(dataOrgUnit.formType == 'dataSet'){
      let dataSets = [];
      this.dataSetToUpdate = {dataSets:[]};
      dataSets = this.httpProvider.dataSetsFromServer;

      dataSets.forEach((dataSet:any)=>{
        if(dataSet.id == this.dataAssign.id){
          dataSet.organisationUnits = orgUnitChanges;
          delete dataSet.lastUpdated;
          delete dataSet.created;
          delete dataSet.href;
          delete dataSet.formType;
          this.dataSetToUpdate.dataSets.push(dataSet);
          //console.log("DataSet To Import: "+JSON.stringify(this.dataSetToUpdate));
          this.httpProvider.initialImport(this.dataSetToUpdate).subscribe(response=>{
            //console.log("did it work: "+JSON.stringify(response));
          })
        }
      });
    }else if(dataOrgUnit.formType == 'program'){
      let programs = [];
      this.programToUpdate = {programs:[]};
      programs = this.httpProvider.programsFromServer;

      programs.forEach((program:any)=>{
        if(program.id == this.dataAssign.id){
          program.organisationUnits = orgUnitChanges;
          delete program.lastUpdated;
          delete program.created;
          delete program.href;
          delete program.formType;
          this.programToUpdate.programs.push(program);
          //console.log("DataSet To Import: "+JSON.stringify(this.dataSetToUpdate));
          this.httpProvider.initialImport(this.programToUpdate).subscribe(response=>{
            //console.log("did it work: "+JSON.stringify(response));
          })
        }
      });
    }


  }

  pageSizeChange(event){
    let pageSize = event.target.value;
    if(pageSize == 'All'){
      this.itemsOnPage = this.tempOrgUnuits.length;
      //console.log("PageSize: "+JSON.stringify(pageSize))
    }else{
      this.itemsOnPage = pageSize;
    }

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
