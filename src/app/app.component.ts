import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  currentOrgUnit:any = 'Org-unit';
  showTour:boolean = false;
  tourSection1:any = 3;
  tourSection2:any;
  tourSection3:any;
  tourSection4:any;
  tableDefault:boolean = true;
  tableHeadData = [];
  tableHeadDataBackUp = [];
  tableRowData = [];
  tableRowDataBackUp = [];
  temp = [];
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
  backedUpOrgUnits:any = [];
  backedUpDataList:any = [];
  loaderMessage:string = 'Loading';
  showLoader:boolean = true;
  tableMode:string = 'default';
  detailCount:any = {data1:'',data2:''};

  // @Input() orgUnitcomp: OrgUnitFilterComponent;
  @Output() tellOrgUnitFilter = new EventEmitter();

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
      // dataSets sample dataSets from hispTz,Moh --- nqKkegk1y8U(BRN Disp), RixTh0Xs0A7(BRN Hc), fiDtcNUzKI6(BRN Hsp)
      // if(datasets.id == 'zeEp4Xu2GOm' || datasets.id == 'v6wdME3ouXu' || datasets.id == 'QntdhuQfgvT' || datasets.id == 'qpcwPcj8D6u' || datasets.id ==  'GzvLb3XVZbR'){
      if(datasets.id == 'lyLU2wR22tC' || datasets.id == 'BfMAe6Itzgt' || datasets.id == 'TuL8IOPzpHh' ||
        datasets.id == 'vc6nF5yZsPR' || datasets.id ==  'Nyh6laLdBEJ'
        || datasets.id == 'nqKkegk1y8U' || datasets.id == 'RixTh0Xs0A7' || datasets.id == 'fiDtcNUzKI6'){
        initialDataHolder.push(datasets);
      }
    });
      this.loaderMessage = 'Finalizing...';
      this.backedUpDataList = initialDataHolder;
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
    if(changes.columns[0].name == 'OrgUnits'){
      this.tableDefault = false;
    }else if(changes.columns[0].name == 'Data'){
     // console.log("make Data to Top")
      this.tableDefault = true;
    }
    if(this.tableDefault){
      this.removeHeadings();
      this.tableRowData = []
      this.tableHeadData = []
      this.getNewOrgUnit(this.backedUpOrgUnits);
      this.receiveData(this.tableHeadData)
    }else{
      //console.log("BackUp OrgUnits "+JSON.stringify(this.backedUpOrgUnits))
      this.tableRowData = []
      this.tableHeadData = []
      this.receiveLayoutChangesOnData(this.backedUpDataList);
      this.getLayoutChangesOnOrgUnit(this.backedUpOrgUnits);
    }


  }

  orgUnitBackUp(orgUnits){
    this.backedUpOrgUnits = [orgUnits];
  }

 initOrgUnits(newOrgUnit){
    this.currentOrgUnit = this.orgUnit.data.orgunit_settings.selected_orgunits[0].name;
     this.backUpOrgUnits = newOrgUnit;
    if(this.tableRowData.length == 0 && this.tableHeadData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          // childOrgUnit.dataSetCount = childOrgUnit.dataSets.length;
          // childOrgUnit.programsCount = childOrgUnit.programs.length;
          // console.log("dataSets assigned are : "+JSON.stringify(childOrgUnit))
          tempOrg.push(childOrgUnit);
          this.tableRowData = this.removeDuplicates(tempOrg,'id');
          this.tableRowDataBackUp = this.tableRowData
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.tableRowData = this.selectedOrgUnitWithChildren;
          this.tableRowDataBackUp = this.tableRowData

        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.tableRowData;
        this.tableRowData.push(newOrgUnit);
        this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
        this.tableRowDataBackUp = this.tableRowData
      }

      this.receiveData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

 }


  getNewOrgUnit(receivedOrgUnits){
    //this.backUpOrgUnits = receivedOrgUnits;
    //console.log("dataSets assigned are : "+JSON.stringify(receivedOrgUnits))
    // orgunit_model.selected_orgunits[0].name
    this.currentOrgUnit = this.orgUnit.data.orgunit_settings.selected_orgunits[0].name;
    if(this.orgUnit.data.orgunit_settings.selected_levels[0]){
      this.showTable = false;
      let tempOrg = [];
        // assume level 1
      receivedOrgUnits.forEach((newOrgUnit:any)=>{

          // carries level 2
        if(newOrgUnit.children){

          if(newOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level){
            tempOrg.push(newOrgUnit);
            this.tableRowData = this.removeDuplicates(tempOrg,'id');
          }else{
            // goes to level 3
            newOrgUnit.children.forEach((childOrgUnit:any)=>{
              // checks level 3 if has level 4
              if(childOrgUnit.children){
                if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level){
                  tempOrg.push(childOrgUnit);
                  this.tableRowData = this.removeDuplicates(tempOrg,'id');
                }else{
                  childOrgUnit.children.forEach((subChildOrgnit:any)=>{
                    if(subChildOrgnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){
                      tempOrg.push(subChildOrgnit);
                      this.tableRowData = this.removeDuplicates(tempOrg,'id');
                    }
                  });
                }
              }else if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){
                  tempOrg.push(childOrgUnit);
                  this.tableRowData = this.removeDuplicates(tempOrg,'id');
                }

              if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){

              }
              // childOrgUnit.dataSetCount = childOrgUnit.dataSets.length;
              // childOrgUnit.programsCount = childOrgUnit.programs.length;
              // console.log("dataSets assigned are : "+JSON.stringify(childOrgUnit.dataSets))
              tempOrg.push(childOrgUnit);
              this.tableRowData = this.removeDuplicates(tempOrg,'id');
            });
          }

          if(newOrgUnit.level !== 1){
            this.selectedOrgUnitWithChildren.push(newOrgUnit);
            this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
          }
          if(this.selectedOrgUnitWithChildren.length >1){
            this.tableRowData = this.selectedOrgUnitWithChildren;
          }
        }else if(newOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level){
          tempOrg = [];
          this.selectedOrgUnitWithChildren = this.tableRowData;
          this.tableRowData.push(newOrgUnit);
          this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
        }
      });
      this.receiveData(this.backUpDataList);
      this.selectedFilter == 'ORG_UNIT';
      //console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0].level));
    }else{
      this.showTable = false;
      let tempOrg = [];
      receivedOrgUnits.forEach((newOrgUnit:any)=>{
      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          // childOrgUnit.dataSetCount = childOrgUnit.dataSets.length;
          // childOrgUnit.programsCount = childOrgUnit.programs.length;
          // console.log("dataSets assigned are : "+JSON.stringify(childOrgUnit.dataSets))
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
       //console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0]));
    }

  }



  // getNewOrgUnit(receivedOrgUnits){
  //  //this.backUpOrgUnits = receivedOrgUnits;
  //   console.log("dataSets assigned are : "+JSON.stringify(receivedOrgUnits))
  //   if(this.orgUnit.data.orgunit_settings.selected_levels[0]){
  //     this.showTable = false;
  //     let tempOrg = [];
  //     receivedOrgUnits.forEach((newOrgUnit:any)=>{
  //       if(newOrgUnit.children){
  //
  //         newOrgUnit.children.forEach((childOrgUnit:any)=>{
  //
  //           if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){
  //
  //           }
  //           // childOrgUnit.dataSetCount = childOrgUnit.dataSets.length;
  //           // childOrgUnit.programsCount = childOrgUnit.programs.length;
  //           // console.log("dataSets assigned are : "+JSON.stringify(childOrgUnit.dataSets))
  //           tempOrg.push(childOrgUnit);
  //           this.tableRowData = this.removeDuplicates(tempOrg,'id');
  //         });
  //         if(newOrgUnit.level !== 1){
  //           this.selectedOrgUnitWithChildren.push(newOrgUnit);
  //           this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
  //         }
  //         if(this.selectedOrgUnitWithChildren.length >1){
  //           this.tableRowData = this.selectedOrgUnitWithChildren;
  //         }
  //       }else {
  //         tempOrg = [];
  //         this.selectedOrgUnitWithChildren = this.tableRowData;
  //         this.tableRowData.push(newOrgUnit);
  //         this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
  //       }
  //     });
  //     this.receiveData(this.backUpDataList);
  //     this.selectedFilter == 'ORG_UNIT';
  //     console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0].level));
  //   }
  //   // this.showTable = false;
  //   // let tempOrg = [];
  //   // receivedOrgUnits.forEach((newOrgUnit:any)=>{
  //   // if(newOrgUnit.children){
  //   //   newOrgUnit.children.forEach((childOrgUnit:any)=>{
  //   //     // childOrgUnit.dataSetCount = childOrgUnit.dataSets.length;
  //   //     // childOrgUnit.programsCount = childOrgUnit.programs.length;
  //   //     // console.log("dataSets assigned are : "+JSON.stringify(childOrgUnit.dataSets))
  //   //     tempOrg.push(childOrgUnit);
  //   //     this.tableRowData = this.removeDuplicates(tempOrg,'id');
  //   //   });
  //   //   if(newOrgUnit.level !== 1){
  //   //     this.selectedOrgUnitWithChildren.push(newOrgUnit);
  //   //     this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
  //   //   }
  //   //   if(this.selectedOrgUnitWithChildren.length >1){
  //   //     this.tableRowData = this.selectedOrgUnitWithChildren;
  //   //   }
  //   // }else {
  //   //   tempOrg = [];
  //   //   this.selectedOrgUnitWithChildren = this.tableRowData;
  //   //   this.tableRowData.push(newOrgUnit);
  //   //   this.tableRowData = this.removeDuplicates(this.tableRowData,'id');
  //   // }
  //   // });
  //   // this.receiveData(this.backUpDataList);
  //   // this.selectedFilter == 'ORG_UNIT';
  //   //  console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0]));
  // }


  removeDeselectedOrgUnit(orgUnitDeselected){
    // this.removeCheckBoxes()
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

  removeDeselectedOrgUnitOnLayOutchange(orgUnitDeselected){
    if(orgUnitDeselected.children){
      orgUnitDeselected.children.forEach((childOrgUnit:any)=>{
        this.tableHeadData.forEach((tempOrg, index)=>{
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
      this.tableHeadData.forEach((tempOrg, index)=>{
        if(tempOrg.id == orgUnitDeselected.id){
          this.tableHeadData.splice(index,1);
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

    if(dataSet.formType == 'dataSet'){
      this.detailCount.data1 = 'dataSets';
    }else if(dataSet.formType == 'program'){
      this.detailCount.data1 = 'programs';
    }

    this.tableHeadData.push(dataSet);
    this.tableHeadData = this.removeDuplicates(this.tableHeadData, 'id');
   this.tableHeadDataBackUp =  this.tableHeadData;
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
    // this.removeHeadings();
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

  getDataSetToOrgUnitCount(orgUnitId){
    let dataSetCount = 0;
    this.dataSetsFromServer.forEach((dataSet:any)=>{
      dataSet.organisationUnits.forEach((orgUnitInDataSet:any)=>{
        if(orgUnitInDataSet.id == orgUnitId){
          dataSetCount +=1;
        }
      })
    });
    return dataSetCount;

  }

  getProgramsToOrgUnitCount(orgUnitId){
    let programCount = 0;
    this.programsFromServer.forEach((program:any)=>{
      program.organisationUnits.forEach((orgUnitInDataSet:any)=>{
        if(orgUnitInDataSet.id == orgUnitId){
          programCount +=1;
        }
      })
    });
    return programCount;
  }

  getOrgUnitCount(data){
    let orgUnitCount = 0;
    data.organisationUnits.forEach((orgUnit)=>{
      orgUnitCount +=1
    })
    return orgUnitCount;
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
          let td_dst = row.id + '--';
          let td_prg = row.id + '-';
          try{
            document.getElementById(td_id).hidden = true;
            // document.getElementById(td_id).remove()

            if(this.detailCount.data1 == 'dataSet'){
              document.getElementById("dataSets").hidden = true;
            }else if(this.detailCount.data2 = 'program'){
              document.getElementById("programs").hidden = true;
            }
            document.getElementById(td_dst).hidden = true;
            // document.getElementById(td_dst).remove()
            document.getElementById(td_prg).hidden = true;
            // document.getElementById(td_prg).remove()
            document.getElementById(head.id).hidden = true;
            // document.getElementById(head.id).remove()
          } catch (e){
            //console.log('Error: '+e);
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

  removeHeadings(){
    this.tableHeadData.forEach((head:any)=>{
        let th = head.id;
        try{
          document.getElementById(th).hidden = true;
        } catch (e){
          //console.log('Error: '+e);
        }
      })
  }




  startTour() {
    // this.hintService.initialize();
    this.showTour = true;
  }

  highLightDiv(section){
    // console.log("sectioned "+sectioned);
    // let section = sectioned.target.value;
    if(section == 1){
      this.tourSection1 = 3;
      this.tourSection2 = this.tourSection3 = this.tourSection4 = 1;
    }else if(section == 2){
      this.tourSection2 = 3;
      this.tourSection1 = this.tourSection3 = this.tourSection4 = 1;
    }else if(section == 3){
      this.tourSection3 = 3;
      this.tourSection1 = this.tourSection2 = this.tourSection4 = 1;
    }else if(section == 4){
      this.tourSection4 = 3;
      this.tourSection1 = this.tourSection2 = this.tourSection3 = 1;
    }
  }

  endTour(event){
    this.tourSection1 = this.tourSection2 = this.tourSection3 = this.tourSection4 = 1;
    this.showTour = false;
  }



  getFilteredList(ev) {
    let val = ev.target.value;
      // filter first headers
    if(this.tableDefault){
    this.tableRowData = this.tableRowDataBackUp;
    this.tableHeadData = this.tableHeadDataBackUp;
    if(val && val.trim() != ''){
      this.tableRowData = this.tableRowData.filter((data:any) => {
        return (data.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else {
      this.tableRowData = []
      this.tableHeadData = []
      this.removeCheckBoxes();
      this.tableRowData = this.tableRowDataBackUp;
      this.tableHeadData = this.tableHeadDataBackUp;
      // this.receiveData(this.backUpDataList);
      // this.receiveData(this.backUpDataList);
    }

        // this.removeHeadings();
        // this.tableRowData = []
        // // this.tableHeadData = []
        // this.getNewOrgUnit(this.backedUpOrgUnits);
        // this.receiveData(this.tableHeadData)
      }else{
        //console.log("BackUp OrgUnits "+JSON.stringify(this.backedUpOrgUnits))
        // this.tableRowData = []
        // // this.tableHeadData = []
        // this.receiveLayoutChangesOnData(this.backedUpDataList);
        // this.getLayoutChangesOnOrgUnit(this.backedUpOrgUnits);

      this.tableHeadData = this.tableHeadDataBackUp;
      if(val && val.trim() != ''){
        this.tableHeadData = this.tableHeadData.filter((data:any) => {
          return (data.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }else {
        this.tableRowData = []
        this.tableHeadData = []
        this.removeCheckBoxes();
        this.tableRowData = this.tableRowDataBackUp;
        this.tableHeadData = this.tableHeadDataBackUp;
        // this.receiveData(this.backUpDataList);
        // this.receiveData(this.backUpDataList);
      }

      }

    }

    // if(val && val.trim() != ''){
    //   this.tableHeadData = this.tableHeadData.filter((data:any) => {
    //     return (data.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }else{
    //   this.tableHeadData = this.tableHeadData;
    // }





}
