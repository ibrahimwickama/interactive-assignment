import {Component, OnInit} from '@angular/core';
import {HttpProviderService} from "./services/http-provider.service";
import {Observable} from "rxjs/Observable";
import {OrgUnitService} from "./modules/orgUnitModel/orgUnitSettings/services/org-unit.service";
import {OrgUnitData} from "./modules/orgUnitModel/orgUnitSettings/models/orgUnits";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  sheetHeight:any;
  sheetWidth:any;
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
  orgUnit: OrgUnitData;
  selectedOrgUnitWithChildren = [];
  showFilters:boolean = false;
  selectedFilter:string;


  constructor(private httpProvider: HttpProviderService, private orgUnitService: OrgUnitService){
    this.orgUnit = this.orgUnitService.getAallOrgUnitStructure();
  }

  ngOnInit(){

  }

       // orgUnit issues
  updateOrgUnitModel(ouModel) {
    this.orgUnit.data.orgunit_settings = ouModel;
    // console.log("Listening to: "+JSON.stringify(ouModel))
  }

  // orgUnit issues

  showOrgunit(){

    if(this.orgUintActive == 'active'){
      this.sheetHeight = '0px';
      this.sheetWidth = '400px';
      this.orgUintActive = '';
    }else {
    this.sheetHeight = '0px';
    // delays aa function for a period of timee
    Observable.interval(500).take(4).subscribe(() => {
    this.showOrgUnits = true;
    this.orgUintActive = 'active';
    this.showDataSets = false;
    this.showPrograms = false;
    this.sheetHeight = '400px';
    this.sheetWidth = '500px';
    //this.tempOrgUnuits = this.httpProvider.organisationUnits;
  });

    }
  }

  showDataSet(){
    if(this.dataSetActive == 'active'){
      this.sheetHeight = '0px';
      this.sheetWidth = '400px';
      this.dataSetActive = '';
    }else{
      //this.tempOrgUnuits = null;
      //this.tempOrgUnuits = this.httpProvider.organisationUnits;
      //this.selectedData = [];
      //this.temp = [];
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
        this.sheetWidth = '100%';
      });
    }

  }

  showProgram(){
    if(this.programActive == 'active'){
      this.sheetHeight = '0px';
      this.sheetWidth = '400px';
      this.programActive = '';
    } else{
      //this.tempOrgUnuits = null;
      //this.tempOrgUnuits = this.httpProvider.organisationUnits;
      //this.selectedData = [];
      //this.temp = [];
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
        this.sheetWidth = '100%';
      });
    }
  }

  getNewOrgUnit(newOrgUnit){
    console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

    if(newOrgUnit.children){
      newOrgUnit.children.forEach((childOrgUnit:any)=>{
        this.tempOrgUnuits.push(childOrgUnit);
        this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits,'id');
      });
      this.selectedOrgUnitWithChildren.push(newOrgUnit);
      this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');

    }else {
      this.tempOrgUnuits.push(newOrgUnit);
      this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits,'id');
    }
  }

  removeDeselectedOrgUnit(orgUnitDeselected){
    if(orgUnitDeselected.children){
      orgUnitDeselected.children.forEach((childOrgUnit:any)=>{
        this.tempOrgUnuits.forEach((tempOrg,index)=>{
          if(tempOrg.id == childOrgUnit.id){
            this.tempOrgUnuits.splice(index,1);
          }
        });
      });
      this.selectedOrgUnitWithChildren.forEach((orgUnit,index)=>{
        if(orgUnit.id == orgUnitDeselected.id){
          this.selectedOrgUnitWithChildren.splice(index,1);
        }
      })

    }else {
      this.tempOrgUnuits.forEach((tempOrg,index)=>{
        if(tempOrg.id == orgUnitDeselected.id){
          this.tempOrgUnuits.splice(index,1);
        }
      });
    }
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    // this.selectedFilter = selectedFilter;
    if(this.selectedFilter == ''){
      this.selectedFilter = selectedFilter;
    }else{
      this.selectedFilter = '';
    }


  }

  receiveData(dataSet){
    let dataSetOrgUnit = [];
    this.selectedData.push(dataSet);
    this.selectedData = this.removeDuplicates(this.selectedData, 'id');

    // make complex functions
    dataSetOrgUnit = dataSet.organisationUnits;

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


  closeSession(){
     location.reload();
    // let tableData = document.querySelector( '#data-table-row' ).remove();
    // this.tempOrgUnuits = [];
    // this.selectedData = [];
  }

  toggleFilters(e){
    if(this.showFilters){
      this.showFilters = false;
    }else{
      this.showFilters = true;
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
