import {Component, Input, OnInit} from '@angular/core';
import {HttpProviderService} from "./services/http-provider.service";
import {Observable} from "rxjs/Observable";
import {OrgUnitService} from "./modules/orgUnitModel/orgUnitSettings/services/org-unit.service";
import {OrgUnitData} from "./modules/orgUnitModel/orgUnitSettings/models/orgUnits";
import {OrgUnitFilterComponent} from "./modules/orgUnitModel/orgUnitSettings/components/org-unit-filter/org-unit-filter.component";

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
  itemsOnPage: number = 20;
  // itemsOnPage: number = this.tempOrgUnuits.length;
  dataAssign:any = {id:'',dataSet:'', orgUnits:{organisationUnits:[]}};
  dataSetToUpdate:any ={dataSets:[]};
  programToUpdate:any ={programs:[]};
  orgUnit: OrgUnitData;
  selectedOrgUnitWithChildren = [];
  showFilters:boolean = false;
  selectedFilter:string;
  dataSetsFromServer:any = [];
  programsFromServer:any = [];
  dataSetHolder:any = [];
  pulseEffect:string = 'pulse';
  showTable:boolean = true;
  backUpDataList:any = [];
  loaderMessage:string = 'Loading';
  showLoader:boolean = true;
  temporarlyChecking:any = [];

  // @Input() orgUnitcomp: OrgUnitFilterComponent;

  constructor(private httpProvider: HttpProviderService, private orgUnitService: OrgUnitService){
    this.orgUnit = this.orgUnitService.getAallOrgUnitStructure();
    this.httpProvider.dataSetCaller().subscribe((response)=>{
      this.dataSetsFromServer = this.httpProvider.dataSetsFromServer;
      //console.log("DataSets from provider: "+JSON.stringify(this.httpProvider.dataSetsFromServer))
    });
    this.httpProvider.programCaller().subscribe((response)=>{
      this.programsFromServer = this.httpProvider.programsFromServer;
    });
  }

  ngOnInit(){
    this.loaderMessage = 'Initializing data...';
    Observable.interval(10000).take(1).subscribe(() => {
      this.showFilters = true;
      this.loaderMessage = 'Looking for Organisation Units...';
      this.getInitialDataToDisplay();
    });

  }

  // initial Loader for Data
  getInitialDataToDisplay(){
    this.showFilters = true;
     this.selectedFilter = 'ORG_UNIT';
    this.loaderMessage = 'Fetching data for assignment...';
    Observable.interval(30000).take(1).subscribe(() => {
    let initialDataHolder = [];
    this.dataSetsFromServer.forEach((datasets)=>{
      // dataSets sample dataSets from hispTz,Moh --- zeEp4Xu2GOm(ANC), v6wdME3ouXu(OPD), QntdhuQfgvT(DTC), qpcwPcj8D6u(IPD), GzvLb3XVZbR(L&D)
      // if(datasets.id == 'zeEp4Xu2GOm' || datasets.id == 'v6wdME3ouXu' || datasets.id == 'QntdhuQfgvT' || datasets.id == 'qpcwPcj8D6u' || datasets.id ==  'GzvLb3XVZbR'){
      if(datasets.id == 'lyLU2wR22tC' || datasets.id == 'BfMAe6Itzgt' || datasets.id == 'TuL8IOPzpHh' ||
        datasets.id == 'vc6nF5yZsPR' || datasets.id ==  'Nyh6laLdBEJ'
        || datasets.id == 'zeEp4Xu2GOm' || datasets.id == 'v6wdME3ouXu' || datasets.id == 'QntdhuQfgvT' ||
        datasets.id == 'qpcwPcj8D6u' || datasets.id ==  'GzvLb3XVZbR'){
        initialDataHolder.push(datasets);
      }
    });
      this.loaderMessage = 'Finalizing...';
      // this.receiveData(initialDataHolder);
      this.dataSetHolder = initialDataHolder
      this.receiveLayoutChangesOnData(initialDataHolder);
    this.showLoader = false;
    });

  }





       // orgUnit issues
  updateOrgUnitModel(ouModel) {
    this.orgUnit.data.orgunit_settings = ouModel;
    // console.log("Listening to: "+JSON.stringify(ouModel))
  }

  closeSelection(event){
    this.selectedFilter = '';
  }

  layoutChanges(changes){
    this.selectedFilter = '';
    console.log("changes on table are : "+JSON.stringify(changes))
  }

 initOrgUnits(newOrgUnit){
    if(this.tempOrgUnuits.length == 0 && this.selectedData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.tempOrgUnuits = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.tempOrgUnuits = this.selectedOrgUnitWithChildren;
        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.tempOrgUnuits;
        this.tempOrgUnuits.push(newOrgUnit);
        this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits,'id');
      }

      this.receiveData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

 }

  getNewOrgUnit(receivedOrgUnits){
    this.showTable = false;
    let tempOrg = [];
    receivedOrgUnits.forEach((newOrgUnit:any)=>{
    if(newOrgUnit.children){
      newOrgUnit.children.forEach((childOrgUnit:any)=>{
        tempOrg.push(childOrgUnit);
        this.tempOrgUnuits = this.removeDuplicates(tempOrg,'id');
      });
      if(newOrgUnit.level !== 1){
        this.selectedOrgUnitWithChildren.push(newOrgUnit);
        this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
      }
      if(this.selectedOrgUnitWithChildren.length >1){
        this.tempOrgUnuits = this.selectedOrgUnitWithChildren;
      }
    }else {
      tempOrg = [];
      this.selectedOrgUnitWithChildren = this.tempOrgUnuits;
      this.tempOrgUnuits.push(newOrgUnit);
      this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits,'id');
    }
    });
    this.receiveData(this.backUpDataList);
    this.selectedFilter == 'ORG_UNIT';
    // console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(newOrgUnit));
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
      });
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
    if(this.selectedFilter == ''){
      this.selectedFilter = selectedFilter;
    }else{
      this.selectedFilter = '';
    }
  }

  receiveData(dataList){
    this.backUpDataList = dataList;
    this.selectedFilter = '';
    this.removeCheckBoxes();
    this.selectedData = [];
    dataList.forEach((dataSet)=>{
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

    });

    this.temp.push(this.tempOrgUnuits);
    this.totalRec = this.tempOrgUnuits.length;
    this.pulseEffect = '';
    this.showTable = true;
  }


  checkBoxChanged(orgUnit,dataOrgUnit,assignedState,event){
    let eventt = event.target.checked;
    let orgUnitChanges = [];
    let orgUnitChangesFalse = [];
    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      if(tempOrg.id == orgUnit.id){
        tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
          if(orgUnitAssigned.id == dataOrgUnit.id ){
            if(orgUnitAssigned.assigned){
              orgUnitAssigned.assigned = false
            }else{
              orgUnitAssigned.assigned = true;
            }
          }
        })
      }
    });

    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
        if(orgUnitAssigned.id === dataOrgUnit.id){
          if(orgUnitAssigned.assigned){
            orgUnitChanges.push({id: tempOrg.id})
          }else{
            orgUnitChangesFalse.push({id: tempOrg.id})
          }
        }
      });
    });

    this.dataAssign.id = dataOrgUnit.id;
    this.dataAssign.dataSet = dataOrgUnit.displayName;
    this.dataAssign.orgUnits.organisationUnits = orgUnitChanges;
    // console.log("orgUnuitChanges to dataSet: "+JSON.stringify(orgUnitChanges));

    if(dataOrgUnit.formType == 'dataSet'){
      let dataSets = [];
      this.dataSetToUpdate = {dataSets:[]};
      dataSets = this.httpProvider.dataSetsFromServer;

      dataSets.forEach((dataSet:any)=>{
        if(dataSet.id == this.dataAssign.id){
          orgUnitChanges.forEach((addNewOrgUnit)=>{
            dataSet.organisationUnits.push(addNewOrgUnit)
          });
          orgUnitChangesFalse.forEach((removeorgUnit)=>{
            dataSet.organisationUnits.forEach((orgUnit,index)=>{
              if(removeorgUnit.id == orgUnit.id){
                dataSet.organisationUnits.splice(index,1);
              }
            })
          });

          delete dataSet.lastUpdated;
          delete dataSet.created;
          delete dataSet.href;
          delete dataSet.formType;
          this.dataSetToUpdate.dataSets.push(dataSet);
          this.httpProvider.initialImport(this.dataSetToUpdate).subscribe(response=>{
            //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          })
        }
      });
    }else if(dataOrgUnit.formType == 'program'){
      let programs = [];
      this.programToUpdate = {programs:[]};
      programs = this.httpProvider.programsFromServer;

      programs.forEach((program:any)=>{
        if(program.id == this.dataAssign.id){
          orgUnitChanges.forEach((addNewOrgUnit)=>{
            program.organisationUnits.push(addNewOrgUnit)
          });
          orgUnitChangesFalse.forEach((removeorgUnit)=>{
            program.organisationUnits.forEach((orgUnit,index)=>{
              if(removeorgUnit.id == orgUnit.id){
                program.organisationUnits.splice(index,1);
              }
            })
          });
          delete program.lastUpdated;
          delete program.created;
          delete program.href;
          delete program.formType;
          this.programToUpdate.programs.push(program);
          this.httpProvider.initialImport(this.programToUpdate).subscribe(response=>{
            //console.log("did it work program: "+JSON.stringify(this.programToUpdate));
          })
        }
      });
    }


  }

  pageSizeChange(pageSize){
    if(pageSize == 'All'){
      this.itemsOnPage = this.tempOrgUnuits.length;
    }else{
      this.itemsOnPage = pageSize;
    }

  }


  toggleFilters(e){
    if(this.showFilters){
      this.showFilters = false;
    }else{
      this.showFilters = true;
    }
  }


  getLAyOutChangedInitOrgUnit(newOrgUnit){
    if(this.selectedData.length == 0 && this.selectedData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.selectedData = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.selectedData = this.selectedOrgUnitWithChildren;
        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.selectedData;
        this.selectedData.push(newOrgUnit);
        this.selectedData = this.removeDuplicates(this.selectedData,'id');
      }

      console.log("Listening to from Live-App: "+JSON.stringify(this.selectedData));

      // this.receiveData(this.backUpDataList);
      this.receiveLayoutChangesOnData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

  }


  getLayoutChangesOnOrgUnit(receivedOrgUnits){
    this.showTable = false;
    let tempOrg = [];
    receivedOrgUnits.forEach((newOrgUnit:any)=>{
      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.selectedData = this.removeDuplicates(tempOrg,'id');


          this.temporarlyChecking.push(childOrgUnit);


        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }
        if(this.selectedOrgUnitWithChildren.length >1){
          this.selectedData = this.selectedOrgUnitWithChildren;
        }
      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.selectedData;
        this.selectedData.push(newOrgUnit);
        this.selectedData = this.removeDuplicates(this.selectedData,'id');
      }
    });
    this.receiveLayoutChangesOnData(this.backUpDataList);
    this.selectedFilter == 'ORG_UNIT';
    // console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(newOrgUnit));
  }


  receiveLayoutChangesOnData(dataList){
    this.backUpDataList = dataList;
    this.selectedFilter = '';
    //this.removeCheckBoxes();
    this.tempOrgUnuits = [];





    dataList.forEach((dataSet)=>{
      let dataSetOrgUnit = [];
      this.tempOrgUnuits.push(dataSet);
      this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits, 'id');
      // make complex functions
      dataSetOrgUnit = dataSet.organisationUnits;

      this.selectedData.forEach((tempOrg:any)=>{

        if (dataSetOrgUnit.filter(e => e.id === tempOrg.id).length > 0) {
          tempOrg.checked = true;

          if(!tempOrg.assigned){
            tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true}]
          }else {
            tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true});
            tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
          }

        }else {
          tempOrg.checked = false;
          if(!tempOrg.assigned){
            tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false}]
          }else {
            tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false});
            tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
          }
        }
      });

    });

    this.dataSetHolder.forEach((dataSet)=>{
      this.tempOrgUnuits.push(dataSet);
      this.tempOrgUnuits = this.removeDuplicates(this.tempOrgUnuits, 'id');
    });






    this.temp.push(this.selectedData);
    this.totalRec = this.selectedData.length;
    this.pulseEffect = '';
    this.showTable = true;
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

  removeCheckBoxes(){
    this.tempOrgUnuits.forEach((tempOrg:any)=>{
      if(tempOrg.assigned) {
        tempOrg.assigned.forEach((dataSet: any) => {
          let td_id = tempOrg.id + '-' + dataSet.id;

          try{
            document.getElementById(td_id).hidden = true;
          } catch (e){
            console.log('Error: '+e);
          }
        });
      }
      });
  }

}
