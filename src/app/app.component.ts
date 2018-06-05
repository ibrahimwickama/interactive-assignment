import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  showChangesApplied:string = '';
  currentOrgUnit:any = 'Org-unit';
  showTour:boolean = false;
  tourSection1:any = 3;
  tourSection2:any;
  tourSection3:any;
  tourSection4:any;
  tableDefault:boolean = true;
  tableHeadData = [];
  table2HeadData = [];
  dataOnTopBackUp = [];
  tableRowData = [];
  table2RowData = [];
  orgUnitOnRowsBackUp = [];
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
  backUpDataListWhenWasTop:any = [];
  backUpDataListWhenReserved:any;
  backUpOrgUnits:any = [];
  backedUpOrgUnits:any = [];
  backedUpDataList:any = [];
  backedUpDataListReversed:any = [];
  backedUpOrgUnitsReversed:any = [];
  loaderMessage:string = 'Loading';
  showLoader:boolean = true;
  tableMode:string = 'default';
  detailCount:any = {data1:'Datasets',data2:''};
  // orgUnit: any = {};
  organisationunits: any[] = [];
  selected_orgunits: any[] = [];
  doReloadTable:boolean = false;
  loderbBar = {width: '0%'};

  @Output() tellOrgUnitFilter = new EventEmitter();


  // the object that will carry the output value you can send one from outside to config start values
   orgunit_model: any =  {
    selection_mode: 'Usr_orgUnit',
    selected_levels: [],
    show_update_button: true,
    selected_groups: [],
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type: 'report', // can be 'data_entry'
    selected_user_orgunit: []
  };





  constructor(private httpProvider: HttpProviderService, private orgUnitService: OrgUnitService){
    // chRef.detectChanges();
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
    this.loderbBar.width = '13%';
    Observable.interval(10000).take(1).subscribe(() => {
      this.showFilters = true;
      // this.loderbBar.width = '13%';
      this.loaderMessage = 'Getting Organisation Units...';
      // this.chRef.detectChanges();
      this.getInitialDataToDisplay();
    });

  }

  // initial Loader for Data
  getInitialDataToDisplay(){

    this.showFilters = true;
    this.loadOrgUnits();
    // this.loderbBar.width = '46%';
    this.loaderMessage = 'Fetching data for assignment...';
    Observable.interval(30000).take(1).subscribe(() => {
    let initialDataHolder = [];
      this.loderbBar.width = '60%';
    this.dataSetsFromServer.forEach((datasets)=>{
      if(initialDataHolder.length <= 6){
        initialDataHolder.push(datasets);
      }
    });
      this.loaderMessage = 'Finalizing...';
      this.backedUpDataList = initialDataHolder;
      this.loderbBar.width = '100%';
      if(this.tableDefault){
        this.receiveData(initialDataHolder);
      }else{
        this.receiveLayoutChangesOnData(initialDataHolder);
      }
      this.loderbBar.width = '100%';
    this.showLoader = false;
    });

  }

  loadOrgUnits(){

    this.orgUnitService.getOrgunitLevelsInformation()
      .subscribe(
        (data: any) => {

          this.loderbBar.width = '20%';
    // identify currently logged in usser
    this.orgUnitService.getUserInformation(this.orgunit_model.type).subscribe(
      userOrgunit => {

        this.loderbBar.width = '24%';
        const level = this.orgUnitService.getUserHighestOrgUnitlevel( userOrgunit );
        this.orgunit_model.user_orgunits = this.orgUnitService.getUserOrgUnits( userOrgunit );
        this.orgUnitService.user_orgunits = this.orgUnitService.getUserOrgUnits( userOrgunit );

        if (this.orgunit_model.selection_mode === 'Usr_orgUnit') {
          this.orgunit_model.selected_orgunits = this.orgunit_model.user_orgunits;
        }
        const all_levels = data.pager.total;
        const orgunits = this.orgUnitService.getuserOrganisationUnitsWithHighestlevel( level, userOrgunit );
        const use_level = parseInt(all_levels) - (parseInt(level) - 1);
        // load inital orgiunits to speed up loading speed
        this.orgUnitService.getInitialOrgunitsForTree(orgunits).subscribe(
          (initial_data) => {
            this.loderbBar.width = '31%';
            this.organisationunits = initial_data;

            // this.orgunit_tree_config.loading = false;
            // a hack to make sure the user orgunit is not triggered on the first time
            //this.initial_usr_orgunit = [{id: 'USER_ORGUNIT', name: 'User org unit'}];
            // after done loading initial organisation units now load all organisation units
            const fields = this.orgUnitService.generateUrlBasedOnLevels(use_level);
            this.orgUnitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(
              items => {
                // items[0].expanded = true;
                this.organisationunits = items;
                // console.log("Fetched OrgUnits :" +JSON.stringify(items))
                this.loderbBar.width = '38%';
                this.initOrgUnits(this.organisationunits[0]);
                // console.log("checking initially :"+JSON.stringify(this.organisationunits))
                // // activate organisation units
                // for (const active_orgunit of this.orgunit_model.selected_orgunits) {
                //   this.activateNode(active_orgunit.id, this.orgtree, true);
                // }
                // // backup to make sure that always there is default organisation unit
                // if (this.orgunit_model.selected_orgunits.length === 0) {
                //   for (const active_orgunit of this.orgunit_model.user_orgunits) {
                //     this.activateNode(active_orgunit.id, this.orgtree, true);
                //   }
                // }
                // this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
              },
              error => {
                console.log('something went wrong while fetching Organisation units');
                // this.orgunit_tree_config.loading = false;
              }
            );
          },
          error => {
            console.log('something went wrong while fetching Organisation units');
            // this.orgunit_tree_config.loading = false;
          }
        );

      }
    );
        })
  }



  showChangesSaved(){
    this.showChangesApplied = 'show';
    Observable.interval(2000).take(1).subscribe(() => {
      this.showChangesApplied = '';
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
      // this.deleteCheckBoxes();
      this.tableDefault = false;
    }else if(changes.columns[0].name == 'Data'){
      // this.deleteCheckBoxes();
     // console.log("make Data to Top")
      this.tableDefault = true;
    }
    if(this.tableDefault){
      // this.removeHeadings();
      // this.removeCheckBoxes();
      this.tableRowData = []
      this.tableHeadData = []

      if(this.backedUpOrgUnits.length <1){
        this.backedUpOrgUnits = [this.organisationunits[0]];
        this.getNewOrgUnit(this.backedUpOrgUnits);
      }else {
        this.getNewOrgUnit(this.backedUpOrgUnits);
      }


      // this.receiveData(this.backUpDataListWhenWasTop)
    }else{
      //console.log("BackUp OrgUnits  "+JSON.stringify(this.backedUpOrgUnits))
      // this.removeHeadings();
      // this.removeCheckBoxes();
      this.table2RowData = []
      this.table2HeadData = []
      this.receiveLayoutChangesOnData(this.backUpDataListWhenReserved);

      if(this.backedUpOrgUnits.length <1){
        this.backedUpOrgUnits = [this.organisationunits[0]];
        this.getLayoutChangesOnOrgUnit(this.backedUpOrgUnits);
      }else {
        this.getLayoutChangesOnOrgUnit(this.backedUpOrgUnits);
      }
    }


  }

  orgUnitBackUp(orgUnits){
    this.backedUpOrgUnits = [orgUnits];
  }

 initOrgUnits(newOrgUnit){
    // this.currentOrgUnit = this.orgUnit.data.orgunit_settings.selected_orgunits[0].name;
     this.backUpOrgUnits = newOrgUnit;
    // if(this.tableRowData.length == 0 && this.tableHeadData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          // sort orgUnits alphabetically
          tempOrg.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          this.tableRowData = this.removeDuplicates(tempOrg,'id');
          // this.orgUnitOnRowsBackUp = this.tableRowData
        });
        this.loderbBar.width = '40%';
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
        // this.orgUnitOnRowsBackUp = this.tableRowData
      }
   this.loderbBar.width = '44%';
      this.receiveData(this.backUpDataListWhenWasTop);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    // }

   this.orgUnitOnRowsBackUp = this.tableRowData

 }


  getNewOrgUnit(receivedOrgUnits){
   let allFacilityHolder = [];
    this.removeCheckBoxes();

    if(this.orgUnit.data.orgunit_settings.selected_levels[0]){
      this.showLoader = true;
      this.loaderMessage = 'Getting Organisation Units...';
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
            // tempOrg.push(newOrgUnit);
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
                    }else{
                      allFacilityHolder = allFacilityHolder.concat(subChildOrgnit.children);
                      this.tableRowData = this.removeDuplicates(allFacilityHolder,'id');
                    }
                  });
                }
              }else if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){
                tempOrg.push(childOrgUnit);
                this.tableRowData = this.removeDuplicates(tempOrg,'id');
              }

              if(childOrgUnit.level == this.orgUnit.data.orgunit_settings.selected_levels[0].level ){

              }
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

      if(this.orgUnit.data.orgunit_settings.selected_levels[0].level == 4 && receivedOrgUnits[0].level == 1){
        this.tableRowData = allFacilityHolder
      }


      this.showLoader = false;
      this.receiveData(this.backUpDataListWhenWasTop);
      this.selectedFilter == 'ORG_UNIT';
      //console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0].level));
    }else{
      this.showTable = false;
      let tempOrg = [];
      receivedOrgUnits.forEach((newOrgUnit:any)=>{
        if(newOrgUnit.children){
          newOrgUnit.children.forEach((childOrgUnit:any)=>{
            tempOrg.push(childOrgUnit);
            this.tableRowData = this.removeDuplicates(tempOrg,'id');
          });
          // if(newOrgUnit.level !== 1){
            this.selectedOrgUnitWithChildren.push(newOrgUnit);
            this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
          // }
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
      this.receiveData(this.backUpDataListWhenWasTop);
      this.selectedFilter == 'ORG_UNIT';
      //console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(this.orgUnit.data.orgunit_settings.selected_levels[0]));
    }

    this.orgUnitOnRowsBackUp = this.tableRowData

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
  //     this.receiveData(this.backUpDataListWhenWasTop);
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
  //   // this.receiveData(this.backUpDataListWhenWasTop);
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
    this.backUpDataListWhenWasTop = dataList;
    this.selectedFilter = '';
    this.removeCheckBoxes();
    this.tableHeadData = [];
    this.loderbBar.width = '46%';
    this.tableRowData.forEach((tempOrg:any)=>{
      tempOrg.assigned=[];
    });
    this.loderbBar.width = '51%';
    dataList.forEach((dataSet)=>{
    let dataSetOrgUnit = [];

    if(dataSet.formType == 'dataSet'){
      this.detailCount.data1 = 'Datasets';
    }else if(dataSet.formType == 'program'){
      this.detailCount.data1 = 'programs';
    }

    this.tableHeadData.push(dataSet);
    this.tableHeadData = this.removeDuplicates(this.tableHeadData, 'id');
   this.dataOnTopBackUp =  this.tableHeadData;
     // make complex functions
    dataSetOrgUnit = dataSet.organisationUnits;


      this.tableRowData.forEach((tempOrg:any)=>{
        // delete tempOrg.assigned;
          if (dataSetOrgUnit.filter(e => e.id === tempOrg.id).length > 0) {
            tempOrg.checked = true;

            if(!tempOrg.assigned){
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true, onprocess: false}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: true,onprocess: false})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }

          }else {
            tempOrg.checked = false;
            if(!tempOrg.assigned){
              tempOrg.assigned = [{id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false,onprocess: false}]
            }else {
              tempOrg.assigned.push({id:dataSet.id, displayName:dataSet.displayName, formType:dataSet.formType, assigned: false,onprocess: false})
              tempOrg.assigned = this.removeDuplicates(tempOrg.assigned,'id');
            }
          }
    });

    });
    this.loderbBar.width = '69%';
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
              // orgUnitAssigned.assigned = false;
              orgUnitAssigned.onprocess = true;
            }else{
              // orgUnitAssigned.assigned = true;
              orgUnitAssigned.onprocess = true;
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

    this.orgUnitOnRowsBackUp = this.tableRowData

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

          this.httpProvider.addFacilityToForm(this.dataSetToUpdate).subscribe(response=>{
            this.showChangesSaved();
              //to change the icon later when complete
            this.tableRowData.forEach((tempOrg:any)=>{
              if(tempOrg.id == orgUnit.id){
                tempOrg.assigned.forEach((orgUnitAssigned:any)=>{
                  if(orgUnitAssigned.id == dataOrgUnit.id ){

                    if(orgUnitAssigned.assigned){
                      orgUnitAssigned.assigned = false;
                      orgUnitAssigned.onprocess = false;
                    }else{
                      orgUnitAssigned.assigned = true;
                      orgUnitAssigned.onprocess = false;
                    }
                  }
                })
              }
            });
            //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          })
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
            this.showChangesSaved();
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
          // console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          this.httpProvider.addFacilityToForm(this.dataSetToUpdate).subscribe(response=>{
            this.showChangesSaved();
           //console.log("did it work dataSet: "+JSON.stringify(this.dataSetToUpdate));
          })
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
            this.showChangesSaved();
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
    if(this.table2RowData.length == 0 && this.table2HeadData.length == 0){
      this.showTable = false;
      let tempOrg = [];
      // this.removeCheckBoxes();
      // console.log("Listening to from Live-App: "+JSON.stringify(newOrgUnit));

      if(newOrgUnit.children){
        newOrgUnit.children.forEach((childOrgUnit:any)=>{
          tempOrg.push(childOrgUnit);
          this.table2HeadData = this.removeDuplicates(tempOrg,'id');
        });
        if(newOrgUnit.level !== 1){
          this.selectedOrgUnitWithChildren.push(newOrgUnit);
          this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
        }

        if(this.selectedOrgUnitWithChildren.length >1){
          this.table2HeadData = this.selectedOrgUnitWithChildren;
        }

      }else {
        tempOrg = [];
        this.selectedOrgUnitWithChildren = this.table2HeadData;
        this.table2HeadData.push(newOrgUnit);
        this.table2HeadData = this.removeDuplicates(this.table2HeadData,'id');
      }

      //console.log("Listening to from Live-App: "+JSON.stringify(this.tableHeadData));

      // this.receiveData(this.backUpDataListWhenWasTop);
      this.receiveLayoutChangesOnData(this.backUpDataListWhenWasTop);
      this.selectedFilter == 'ORG_UNIT';
      // console.log("initOrgUnits was fired");

    }

    this.backedUpOrgUnitsReversed = this.table2HeadData

  }


  getLayoutChangesOnOrgUnit(receivedOrgUnits){
    // console.log("changind orgUnits "+JSON.stringify(receivedOrgUnits))
      this.showTable = false;
      this.backUpOrgUnits = receivedOrgUnits;
      let tempOrg = [];
      receivedOrgUnits.forEach((newOrgUnit:any)=>{
        if(newOrgUnit.children){
          newOrgUnit.children.forEach((childOrgUnit:any)=>{
            tempOrg.push(childOrgUnit);
            this.table2HeadData = this.removeDuplicates(tempOrg,'id');
          });
          if(newOrgUnit.level !== 1){
            this.selectedOrgUnitWithChildren.push(newOrgUnit);
            this.selectedOrgUnitWithChildren = this.removeDuplicates(this.selectedOrgUnitWithChildren, 'id');
          }
          if(this.selectedOrgUnitWithChildren.length >1){
            this.table2HeadData = this.selectedOrgUnitWithChildren;
          }
        }else {
          tempOrg = [];
          this.selectedOrgUnitWithChildren = this.tableHeadData;
          this.table2HeadData.push(newOrgUnit);
          this.table2HeadData = this.removeDuplicates(this.table2HeadData,'id');
        }
      });
      if(this.backUpDataListWhenReserved){
        this.receiveLayoutChangesOnData(this.backUpDataListWhenWasTop);
      }else{
        this.receiveLayoutChangesOnData(this.backUpDataListWhenWasTop);
    }

      this.selectedFilter == 'ORG_UNIT';
      // console.log("getNewOrgUnit was fired with new OrgUnits: "+JSON.stringify(newOrgUnit));

    this.backedUpOrgUnitsReversed = this.table2HeadData

  }


  receiveLayoutChangesOnData(dataList){
    // this.backUpDataListWhenWasTop =  dataList;
    this.backUpDataListWhenReserved = dataList;
    this.selectedFilter = '';
    // this.removeHeadings();
    // this.removeCheckBoxes();
    this.table2RowData.forEach((tempOrg:any)=>{
      tempOrg.assigned=[]
    });
    this.table2RowData = [];
    this.table2RowData = this.removeDuplicates(dataList, 'id');
    this.backedUpDataListReversed =  this.table2RowData;

    this.table2HeadData.forEach((tempDataSet:any)=>{

    this.table2RowData.forEach((dataSet)=>{
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
    this.temp.push(this.table2RowData);
    this.totalRec = this.table2RowData.length;
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
            // document.getElementById(td_id).style.visibility= 'hidden';
            // document.getElementById(td_id).remove()

            if(this.detailCount.data1 == 'dataSet'){
              document.getElementById("Datasets").hidden = true;
            }else if(this.detailCount.data2 = 'program'){
              document.getElementById("programs").hidden = true;
            }
            document.getElementById(td_dst).hidden = true;
            // document.getElementById(td_dst).remove()
            document.getElementById(td_prg).hidden = true;
            // document.getElementById(td_prg).remove()
            document.getElementById(head.id).hidden = true;
            // document.getElementById(head.id).remove()



            // document.getElementById(td_prg+'lyLU2wR22tC').remove();
            // document.getElementById(td_prg+'vc6nF5yZsPR').remove();
            // document.getElementById(td_prg+'nqKkegk1y8U').remove();
            // document.getElementById(td_prg+'BfMAe6Itzgt').remove();
            // document.getElementById(td_prg+'Nyh6laLdBEJ').remove();
            // document.getElementById(td_prg+'RixTh0Xs0A7').remove();
            // document.getElementById(td_prg+'TuL8IOPzpHh').remove();
            // document.getElementById(td_prg+'fiDtcNUzKI6').remove();

            // document.getElementById(td_prg+'lyLU2wR22tC').hidden = true;
            // document.getElementById(td_prg+'vc6nF5yZsPR').hidden = true;
            // document.getElementById(td_prg+'nqKkegk1y8U').hidden = true;
            // document.getElementById(td_prg+'BfMAe6Itzgt').hidden = true;
            // document.getElementById(td_prg+'Nyh6laLdBEJ').hidden = true;
            // document.getElementById(td_prg+'RixTh0Xs0A7').hidden = true;
            // document.getElementById(td_prg+'TuL8IOPzpHh').hidden = true;
            // document.getElementById(td_prg+'fiDtcNUzKI6').hidden = true;

          } catch (e){
            //console.log('Error: '+e);
          }
        });
      }
    });
  }





  // removeHeadings(){
  //   this.tableHeadData.forEach((head:any)=>{
  //       let th = head.id;
  //       try{
  //         document.getElementById(th).hidden = true;
  //       } catch (e){
  //         //console.log('Error: '+e);
  //       }
  //     })
  // }

  deleteCheckBoxes(){
    this.tableRowData.forEach((row:any)=>{
      if(row.assigned) {
        row.assigned.forEach((head: any) => {
          let td_id = row.id + '-' + head.id;
          let td_dst = row.id + '--';
          let td_prg = row.id + '-';
          try{
            // document.getElementById(td_id).hidden = true;
            document.getElementById(td_id).remove()
            document.getElementById("assignment-table1").remove()

            if(this.detailCount.data1 == 'dataSet'){
              document.getElementById("Datasets").hidden = true;
            }else if(this.detailCount.data2 = 'program'){
              document.getElementById("programs").hidden = true;
            }
            // document.getElementById(td_dst).hidden = true;
            document.getElementById(td_dst).remove()
            // document.getElementById(td_prg).hidden = true;
            document.getElementById(td_prg).remove()
            // document.getElementById(head.id).hidden = true;
            document.getElementById(head.id).remove()
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
      this.doReloadTable = false;
    this.tableRowData = this.orgUnitOnRowsBackUp;
    this.tableHeadData = this.dataOnTopBackUp;
    if(val && val.trim() != ''){
      this.tableRowData = this.tableRowData.filter((data:any) => {
        return (data.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else {

      this.doReloadTable = true;
      // this.tableRowData = []
      // this.tableHeadData = []

      // this.removeCheckBoxes();
      this.tableRowData = this.orgUnitOnRowsBackUp;
      this.tableHeadData = this.dataOnTopBackUp;
      // new reFreshTable();
      // this.initOrgUnits(this.backUpOrgUnits)
      // this.receiveData(this.backUpDataListWhenWasTop);
      // this.receiveData(this.backUpDataListWhenWasTop);
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
      this.doReloadTable = false;
      this.table2RowData = this.dataOnTopBackUp;
      if(val && val.trim() != ''){
        this.table2RowData = this.table2RowData.filter((data:any) => {
          return (data.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }else {
        this.doReloadTable = true;
        this.table2RowData = []
        this.table2HeadData = []
        this.removeCheckBoxes();
        // new reFreshTable();
        this.table2RowData = this.dataOnTopBackUp;
        this.table2HeadData = this.backedUpOrgUnitsReversed;
        // this.receiveData(this.backUpDataListWhenWasTop);
        // this.receiveData(this.backUpDataListWhenWasTop);
      }

      }

    }







}
