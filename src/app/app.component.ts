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
  tableDefault:boolean = true;
  tableHeadData = [];
  temp = [];
  tableRowData = [];
  totalRec:any;
  page: number = 1;
  itemsOnPage: number = 20;
  // itemsOnPage: number = this.tableRowData.length;
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
  backUpOrgUnits:any = [];
  loaderMessage:string = 'Loading';
  showLoader:boolean = true;
  tableMode:string = 'default';

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

  layOutRouter(){
    if(this.tableMode == 'default'){
      this.tableDefault = true;
    }else if(this.tableMode == 'transposed'){
      this.tableDefault = false;
    }
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
      if(this.tableDefault){
        this.receiveData(initialDataHolder);
      }else{
        this.receiveLayoutChangesOnData(initialDataHolder);
      }
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
    if(changes.columns[0].name == 'OrgUnits'){
      console.log("make OrgUnits to Top")
      this.tableDefault = false;
      this.tableRowData = []
      this.tableHeadData = []
      this.receiveLayoutChangesOnData(this.backUpDataList)
      this.getLayoutChangesOnOrgUnit(this.backUpOrgUnits);
    }else if(changes.columns[0].name == 'Data'){
      console.log("make Data to Top")
      this.tableDefault = true;
      this.tableRowData = []
      this.tableHeadData = []
      this.getNewOrgUnit(this.backUpOrgUnits);
      this.receiveData(this.backUpDataList)
    }
  }

 initOrgUnits(newOrgUnit){
    if(this.tableRowData.length == 0 && this.tableHeadData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.tableRowData = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.tableRowData = this.selectedOrgUnitWithChildren;
        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.tableRowData;
        this.tableRowData.push(newOrgUnit);
        this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
      }

      this.receiveData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

 }

  getNewOrgUnit(receivedOrgUnits){
   this.backUpOrgUnits = receivedOrgUnits;
    this.showTable = false;
    let tempOrg = [];
    receivedOrgUnits.forEach((newOrgUnit:any)=>{
    if(newOrgUnit.children){
      newOrgUnit.children.forEach((childOrgUnit:any)=>{
        tempOrg.push(childOrgUnit);
        this.tableRowData = this.removeDuplicates(tempOrg,'id');
      });
      if(newOrgUnit.level !== 1){
        this.selectedOrgUnitWithChildren.push(newOrgUnit);
        this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
      }
      if(this.selectedOrgUnitWithChildren.length >1){
        this.tableRowData = this.selectedOrgUnitWithChildren;
      }
    }else {
      tempOrg = [];
      this.selectedOrgUnitWithChildren = this.tableRowData;
      this.tableRowData.push(newOrgUnit);
      this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
    }
    });
    this.receiveData(this.backUpDataList);
    this.selectedFilter == 'ORG_UNIT';
    // console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(newOrgUnit));
  }


  removeDeselectedOrgUnit(orgUnitDeselected){
    if(orgUnitDeselected.children){
      orgUnitDeselected.children.forEach((childOrgUnit:any)=>{
        this.tableRowData.forEach((tempOrg, index)=>{
          if(tempOrg.id == childOrgUnit.id){
            this.tableRowData.splice(index,1);
          }
        });
      });
      this.selectedOrgUnitWithChildren.forEach((orgUnit,index)=>{
        if(orgUnit.id == orgUnitDeselected.id){
          this.selectedOrgUnitWithChildren.splice(index,1);
        }
      });
    }else {
      this.tableRowData.forEach((tempOrg, index)=>{
        if(tempOrg.id == orgUnitDeselected.id){
          this.tableRowData.splice(index,1);
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
    this.tableHeadData = [];
    dataList.forEach((dataSet)=>{
    let dataSetOrgUnit = [];
    this.tableHeadData.push(dataSet);
    this.tableHeadData = this.removeDuplicates(this.tableHeadData, 'id');
    // make complex functions
    dataSetOrgUnit = dataSet.organisationUnits;

      this.tableRowData.forEach((tempOrg:any)=>{

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

    this.temp.push(this.tableRowData);
    this.totalRec = this.tableRowData.length;
    this.pulseEffect = '';
    this.showTable = true;
  }


  checkBoxChanged(orgUnit,dataOrgUnit,assignedState,event){
    let eventt = event.target.checked;
    let orgUnitChanges = [];
    let orgUnitChangesFalse = [];
    this.tableRowData.forEach((tempOrg:any)=>{
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

    this.tableRowData.forEach((tempOrg:any)=>{
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
     //console.log("orgUnuitChanges to dataSet: "+JSON.stringify(orgUnitChanges));

    if(dataOrgUnit.formType == 'dataSet'){
      let dataSets = [];
      this.dataSetToUpdate = {dataSets:[]};
      // dataSets = this.httpProvider.dataSetsFromServer;
      this.dataSetsFromServer.forEach((dataSet:any)=>{
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
          this.dataSetToUpdate.dataSets.push(dataSet);
          //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));

          // this.httpProvider.addFacilityToForm(this.dataSetToUpdate).subscribe(response=>{
          //   //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          // })
        }
      });
    }else if(dataOrgUnit.formType == 'program'){
      let programs = [];
      this.programToUpdate = {programs:[]};
      // programs = this.httpProvider.programsFromServer;
      this.programsFromServer.forEach((program:any)=>{
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
          this.programToUpdate.programs.push(program);
          this.httpProvider.addFacilityToForm(this.programToUpdate).subscribe(response=>{
            //console.log("did it work program: "+JSON.stringify(this.programToUpdate));
          })
        }
      });
    }

  }

  checkBoxChangedOnLayOutChanged(selectedDataSet,dataOrgUnit,assignedState,event){
    let eventt = event.target.checked;
    let orgUnitChanges = [];
    let orgUnitChangesFalse = [];
    this.tableRowData.forEach((rowDataSet:any)=>{
      if(rowDataSet.id == selectedDataSet.id){
        rowDataSet.assigned.forEach((orgUnitAssigned:any)=>{
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

    // this.

    this.tableRowData.forEach((tableRow:any)=>{
      if(tableRow.id == selectedDataSet.id){
        tableRow.assigned.forEach((orgUnitAssigned:any)=>{
          if(orgUnitAssigned.id === dataOrgUnit.id){
            if(orgUnitAssigned.assigned){
              orgUnitChanges.push({id: dataOrgUnit.id});
              //orgUnitChanges = this.removeDuplicates(orgUnitChanges,'id');
            }else{
              orgUnitChangesFalse.push({id: dataOrgUnit.id});
            }
          }
        });
      }

    });

    this.dataAssign.id = dataOrgUnit.id;
    this.dataAssign.dataSet = dataOrgUnit.displayName;
    this.dataAssign.orgUnits.organisationUnits = orgUnitChanges;
    console.log("orgUnuitChanges to dataSet: "+JSON.stringify(orgUnitChanges));
     console.log("dataSet: "+JSON.stringify(selectedDataSet.formType));

    if(selectedDataSet.formType === 'dataSet'){
      // console.log("dataSet: "+JSON.stringify(selectedDataSet.formType));
      let dataSets = [];
      this.dataSetToUpdate = {dataSets:[]};
      // dataSets = this.httpProvider.dataSetsFromServer;

      this.dataSetsFromServer.forEach((dataSet:any)=>{
        if(dataSet.id == selectedDataSet.id){
          orgUnitChanges.forEach((addNewOrgUnit)=>{
            dataSet.organisationUnits.push(addNewOrgUnit)
            // console.log("did it add: ");
          });
          orgUnitChangesFalse.forEach((removeorgUnit)=>{
            dataSet.organisationUnits.forEach((orgUnit,index)=>{
              if(removeorgUnit.id == orgUnit.id){
                dataSet.organisationUnits.splice(index,1);
              }
            })
          });
          this.dataSetToUpdate.dataSets.push(dataSet);
          console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          // this.httpProvider.addFacilityToForm(this.dataSetToUpdate).subscribe(response=>{
          //  //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          // })
        }
      });
    }else if(selectedDataSet.formType == 'program'){
      let programs = [];
      this.programToUpdate = {programs:[]};
      // programs = this.httpProvider.programsFromServer;

      this.programsFromServer.forEach((program:any)=>{
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
          this.programToUpdate.programs.push(program);
          this.httpProvider.addFacilityToForm(this.programToUpdate).subscribe(response=>{
            //console.log("did it work program: "+JSON.stringify(this.programToUpdate));
          })
        }
      });
    }


  }




  pageSizeChange(pageSize){
    if(pageSize == 'All'){
      this.itemsOnPage = this.tableRowData.length;
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
    if(this.tableRowData.length == 0 && this.tableHeadData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.tableHeadData = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.tableHeadData = this.selectedOrgUnitWithChildren;
        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.tableHeadData;
        this.tableHeadData.push(newOrgUnit);
        this.tableHeadData = this.removeDuplicates(this.tableHeadData,'id');
      }

      //console.log("Listening to from Live-App: "+JSON.stringify(this.tableHeadData));

      // this.receiveData(this.backUpDataList);
      this.receiveLayoutChangesOnData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

  }


  getLayoutChangesOnOrgUnit(receivedOrgUnits){
    this.showTable = false;
    this.backUpOrgUnits = receivedOrgUnits;
    let tempOrg = [];
    receivedOrgUnits.forEach((newOrgUnit:any)=>{
      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.tableHeadData = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }
        if(this.selectedOrgUnitWithChildren.length >1){
          this.tableHeadData = this.selectedOrgUnitWithChildren;
        }
      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.tableHeadData;
        this.tableHeadData.push(newOrgUnit);
        this.tableHeadData = this.removeDuplicates(this.tableHeadData,'id');
      }
    });
    this.receiveLayoutChangesOnData(this.backUpDataList);
    this.selectedFilter == 'ORG_UNIT';
    // console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(newOrgUnit));
  }


  receiveLayoutChangesOnData(dataList){
    this.backUpDataList = dataList;
    this.selectedFilter = '';
    this.removeCheckBoxes();
    this.tableRowData = [];
    this.tableRowData = this.removeDuplicates(dataList, 'id');

    this.tableHeadData.forEach((tempDataSet:any)=>{

    this.tableRowData.forEach((dataSet)=>{
      let dataSetOrgUnit = [];
      dataSetOrgUnit = dataSet.organisationUnits;

        if (dataSetOrgUnit.filter(e => e.id === tempDataSet.id).length > 0) {
          dataSet.checked = true;

          if(!dataSet.assigned){
            dataSet.assigned = [{id:tempDataSet.id, displayName:tempDataSet.name, formType:dataSet.formType, assigned: true}]
          }else {
            dataSet.assigned.push({id:tempDataSet.id, displayName:tempDataSet.name, formType:dataSet.formType, assigned: true});
            dataSet.assigned = this.removeDuplicates(dataSet.assigned,'id');
          }
        }else {
          dataSet.checked = false;
          if(!dataSet.assigned){
            dataSet.assigned = [{id:tempDataSet.id, displayName:tempDataSet.name, formType:dataSet.formType, assigned: false}]
          }else {
            dataSet.assigned.push({id:tempDataSet.id, displayName:tempDataSet.name, formType:dataSet.formType, assigned: false});
            dataSet.assigned = this.removeDuplicates(dataSet.assigned,'id');
          }
        }
      });

    });
    this.temp.push(this.tableRowData);
    this.totalRec = this.tableRowData.length;
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
    this.tableRowData.forEach((row:any)=>{
      if(row.assigned) {
        row.assigned.forEach((head: any) => {
          let td_id = row.id + '-' + head.id;
          try{
            document.getElementById(td_id).hidden = true;
          } catch (e){
            console.log('Error: '+e);
          }
        });
      }
    });

    // this.tableRowData.forEach((tempOrg:any)=>{
    //   if(tempOrg.assigned) {
    //     tempOrg.assigned.forEach((dataSet: any) => {
    //       let td_id = tempOrg.id + '-' + dataSet.id;
    //
    //       try{
    //         document.getElementById(td_id).hidden = true;
    //       } catch (e){
    //         console.log('Error: '+e);
    //       }
    //     });
    //   }
    //   });
  }


}
