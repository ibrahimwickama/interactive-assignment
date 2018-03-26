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
    let eventt = event.target.checked;
    let orgUnitChanges = [];
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
    // console.log("tempOrgUnit state is: "+JSON.stringify(this.tempOrgUnuits))
    // console.log("dataOrgUnit is: "+JSON.stringify(dataOrgUnit))

    //prepare importation object

    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
        if(orgUnitAssigned.id === dataOrgUnit.id){
          // console.log("orgUnitAssigned.id is: "+JSON.stringify(orgUnitAssigned.id)+" and dataOrgUnit.id is: "+JSON.stringify(dataOrgUnit.id));
          // console.log("orgUnitAssigned.id is: "+JSON.stringify(orgUnitAssigned.assigned));
          if(orgUnitAssigned.assigned){
            orgUnitChanges.push({id: tempOrg.id})
          }
        }
      });
    });

    this.dataAssign.id = dataOrgUnit.id;
    this.dataAssign.dataSet = dataOrgUnit.displayName;
    this.dataAssign.orgUnits.organisationUnits = orgUnitChanges;
    console.log("OrgUnitChanges is: "+JSON.stringify(this.dataAssign));

    let dataSets = [];
    this.dataSetToUpdate = {dataSets:[]};
    dataSets = this.httpProvider.dataSetsFromServer;

    dataSets.forEach((dataSet:any)=>{
      if(dataSet.id == this.dataAssign.id){
        dataSet.organisationUnits = orgUnitChanges;
        delete dataSet.lastUpdated;
        delete dataSet.created;
        delete dataSet.href;

        this.dataSetToUpdate.dataSets.push(dataSet);
        console.log("DataSet To Import: "+JSON.stringify(this.dataSetToUpdate));
        this.httpProvider.initialImport(this.dataSetToUpdate).subscribe(response=>{
          console.log("did it work: "+JSON.stringify(response));
        })
      }
    })
    // this.httpProvider.uploadDataAssignmentChangesToServer(this.dataAssign).subscribe(response=>{
    //   console.log("did it work: "+JSON.stringify(response));
    // })

  }

  pageSizeChange(event){
    let pageSize = event.target.value;
    if(pageSize == 'All'){
      this.itemsOnPage = this.tempOrgUnuits.length;
      console.log("PageSize: "+JSON.stringify(pageSize))
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
