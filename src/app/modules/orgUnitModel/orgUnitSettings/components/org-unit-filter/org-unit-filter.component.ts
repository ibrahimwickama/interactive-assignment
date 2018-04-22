import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { TreeComponent, TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { OrgUnitService } from '../../services/org-unit.service';

@Component({
  selector: 'app-org-unit-filter',
  templateUrl: './org-unit-filter.component.html',
  styleUrls: ['./org-unit-filter.component.css']
})
export class OrgUnitFilterComponent implements OnInit {
  // thisrow:boolean = false;
  showOrgUnitTypes:string = 'none';
  yesWasFirstEmitted:boolean = false;

  // the object that will carry the output value you can send one from outside to config start values
  @Input() orgunit_model: any =  {
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
  initial_usr_orgunit = [];

  // The organisation unit configuration object This will have to come from outside.
  @Input() orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    multiple_key: 'none', // can be control or shift
    placeholder: 'Select Organisation Unit'
  };

  @Input() showUpdate: boolean = true;
  @Input() pickChildren: boolean = true;
  // @Input() tableListen: any= this.listenerToTableChange()

  @Output() onOrgUnitUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitModelUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedOrgUnit = new EventEmitter();
  @Output() wasFirstEmitted = new EventEmitter();
  @Output() deSelectedOrgUnit = new EventEmitter();
   @Output() hideOrgUnitSelection = new EventEmitter();
   @Output() restoreOrgUnits = new EventEmitter();

  orgUnit: any = {};
  root_url = '../../../';
  nodes: any[] = null;
  orgunit_levels: any[] = [];
  @ViewChild('orgtree')
  orgtree: TreeComponent;

  @ViewChild('period_selector')
  period_selector: MultiselectComponent;

  organisationunits: any[] = [];
  selected_orgunits: any[] = [];
  multiOrgUnits: any[] = [];

  // this variable controls the visibility of of the treee
  showOrgTree: boolean = true;

  customTemplateStringOrgunitOptions: any;

  user_orgunits_types: Array<any> = [
    {id: 'USER_ORGUNIT', name: 'User Admin Unit', shown: true},
    {id: 'USER_ORGUNIT_CHILDREN', name: 'User sub-units', shown: true},
    {id: 'USER_ORGUNIT_GRANDCHILDREN', name: 'User sub-x2-units', shown: true}
  ];
  constructor(
    private orgunitService: OrgUnitService
  ) {
     if (!this.orgunit_tree_config.hasOwnProperty('multiple_key')) {
       this.orgunit_tree_config.multiple_key = 'none';
     }
  }

  updateModelOnSelect(data) {
    if (!this.orgunit_model.show_update_button) {
      this.onOrgUnitUpdate.emit({name: 'ou', value: data.id});
      this.displayOrgTree();
    }
  }
  ngOnInit() {
    this.displayOrgTree();
    if (this.orgunit_tree_config.multiple) {
      if (this.orgunit_tree_config.multiple_key === 'none') {
        const actionMapping: IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            // click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_ACTIVE(node, tree, $event)
              click: TREE_ACTIONS.TOGGLE_ACTIVE_MULTI
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};

      }else if (this.orgunit_tree_config.multiple_key === 'control') { // multselect using control key
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }else if (this.orgunit_tree_config.multiple_key === 'shift') { // multselect using shift key
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(node, tree, $event)
                // ? TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }

    }else {
      const actionMapping: IActionMapping = {
        mouse: {
          // dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          dblClick: TREE_ACTIONS.TOGGLE_ACTIVE,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        },
        // mouse: {
        //   click: TREE_ACTIONS.TOGGLE_SELECTED
        // },
      };
      this.customTemplateStringOrgunitOptions = {actionMapping};
    }


    // if (this.orgunitService.nodes === null) {
      this.orgunitService.getOrgunitLevelsInformation()
        .subscribe(
          (data: any) => {
            // assign urgunit levels and groups to variables
            //console.log("Org unit level: "+JSON.stringify(data.organisationUnitLevels));
            // console.log("Org unit level: "+JSON.stringify(this.orgunit_model.user_orgunits));
            this.orgunit_model.orgunit_levels = data.organisationUnitLevels;

            // setting organisation groups
            this.orgunitService.getOrgunitGroups().subscribe( groups => {//noinspection TypeScriptUnresolvedVariable
              this.orgunit_model.orgunit_groups = groups;
            });

            // identify currently logged in usser
            this.orgunitService.getUserInformation(this.orgunit_model.type).subscribe(
              userOrgunit => {
                const level = this.orgunitService.getUserHighestOrgUnitlevel( userOrgunit );
                this.orgunit_model.user_orgunits = this.orgunitService.getUserOrgUnits( userOrgunit );
                this.orgunitService.user_orgunits = this.orgunitService.getUserOrgUnits( userOrgunit );
                if (this.orgunit_model.selection_mode === 'Usr_orgUnit') {
                  this.orgunit_model.selected_orgunits = this.orgunit_model.user_orgunits;
                }
                const all_levels = data.pager.total;
                const orgunits = this.orgunitService.getuserOrganisationUnitsWithHighestlevel( level, userOrgunit );
                const use_level = parseInt(all_levels) - (parseInt(level) - 1);
                // load inital orgiunits to speed up loading speed
                this.orgunitService.getInitialOrgunitsForTree(orgunits).subscribe(
                  (initial_data) => {
                    this.organisationunits = initial_data;
                    this.orgunit_tree_config.loading = false;
                    // a hack to make sure the user orgunit is not triggered on the first time
                    this.initial_usr_orgunit = [{id: 'USER_ORGUNIT', name: 'User org unit'}];
                    // after done loading initial organisation units now load all organisation units
                    const fields = this.orgunitService.generateUrlBasedOnLevels(use_level);
                    this.orgunitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                      items => {
                        items[0].expanded = true;
                        this.organisationunits = items;

                        // activate organisation units
                        for (const active_orgunit of this.orgunit_model.selected_orgunits) {
                          this.activateNode(active_orgunit.id, this.orgtree, true);
                        }
                        // backup to make sure that always there is default organisation unit
                        if (this.orgunit_model.selected_orgunits.length === 0) {
                          for (const active_orgunit of this.orgunit_model.user_orgunits) {
                            this.activateNode(active_orgunit.id, this.orgtree, true);
                          }
                        }
                        this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
                      },
                      error => {
                        console.log('something went wrong while fetching Organisation units');
                        this.orgunit_tree_config.loading = false;
                      }
                    );
                  },
                  error => {
                    console.log('something went wrong while fetching Organisation units');
                    this.orgunit_tree_config.loading = false;
                  }
                );

              }
            );
          }
        );
  }


  updateOrgunits() {
    this.displayOrgTree();
    this.emit(true);
    this.hideOrgUnitSelection.emit(true);
     this.selectedOrgUnit.emit(this.multiOrgUnits);
     // this.selectedOrgUnit.emit(this.selected_orgunits[0]);
    // console.log("From update clicked: "+JSON.stringify(this.multiOrgUnits));
    this.multiOrgUnits = [];
  }

  closeOrgunits(){
    this.emit(true);
    this.hideOrgUnitSelection.emit(true);
  }


  showOrgUnitTypesList(){
    if(this.showOrgUnitTypes == 'block'){
      this.showOrgUnitTypes = 'none';
    }else if(this.showOrgUnitTypes == 'none'){
      this.showOrgUnitTypes = 'block';
    }
  }

  clearAll() {
    for (const active_orgunit of this.orgunit_model.selected_orgunits) {
      this.deActivateNode(active_orgunit.id, this.orgtree, null,active_orgunit);
    }
  }

  setType(type: string) {

    // this.showOrgUnitTypes = false;
    this.orgunit_model.selection_mode = type;

    if ( type !== 'orgUnit' ) {
      this.orgunit_model.selected_user_orgunit = [];
    }
    if ( type !== 'Level' ) {
      this.orgunit_model.selected_levels = [];
    }
    if ( type !== 'Group' ) {
      this.orgunit_model.selected_groups = [];
    }
     this.showOrgUnitTypesList();

  }
  // display Orgunit Tree
  displayOrgTree() {
    this.showOrgTree = !this.showOrgTree;
    // this.hideOrgUnitSelection.emit(true)
  }
  filterNodes(value, tree) {
    tree.treeModel.filterNodes((node) => {
      return !node.data.name.startsWith(value);
    });
  }

  activateNode(nodeId: any, nodes, first) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(true, true);
      }
      if (first) {
        node.toggleExpanded();
      }
    }, 0);

  }

  // a method to activate the model
  deActivateNode(nodeId: any, nodes, event,orgUnit) {
    // console.log("deactivated : "+JSON.stringify(orgUnit));
    this.deSelectedOrgUnit.emit(orgUnit);
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(false, true);
      }


    }, 0);
    if ( event !== null) {
      event.stopPropagation();
    }
  }

  // check if orgunit already exist in the orgunit display list
  checkOrgunitAvailabilty(orgunit, array): boolean {
    let checker = false;
    array.forEach((value) => {
      if ( value.id === orgunit.id ) {
        checker = true;
      }
    });
    return checker;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivateOrg ( $event ) {
    this.period_selector.reset();
    if (this.orgunit_model.selection_mode === 'Usr_orgUnit') {
      this.orgunit_model.selection_mode = 'orgUnit';
      this.period_selector.reset();
    }
    this.orgunit_model.selected_orgunits.forEach((item, index) => {
      if ( $event.node.data.id === item.id ) {
          // fires an event to remove this OrgUnit to the list
        this.deSelectedOrgUnit.emit(item);
        this.orgunit_model.selected_orgunits.splice(index, 1);
      }
    });

    this.multiOrgUnits.forEach((orgUnit,index)=>{
      if(orgUnit.id == $event.node.data.id ){
        this.multiOrgUnits.splice(index,1);
      }
    })
    this.emit(false);
  }

  // add item to array of selected items when item is selected
  activateOrg = ($event) => {
    this.period_selector.reset();
    if (this.orgunit_model.selection_mode === 'Usr_orgUnit') {
      this.orgunit_model.selection_mode = 'orgUnit';
      this.period_selector.reset();
    }
    this.selected_orgunits = [$event.node.data];

      // here its were selected orgUnit is captured & passed to appComponent as selected
    // if(this.wasFirstEmitted){
    //   console.log("Listening to: "+JSON.stringify(this.selected_orgunits[0]));
    // this.selected_orgunits.forEach((orgUnit:any)=>{
    this.multiOrgUnits.push(this.selected_orgunits[0]);
    // })
    if(!this.yesWasFirstEmitted){
      this.wasFirstEmitted.emit(this.selected_orgunits[0]);
      this.yesWasFirstEmitted = true;
    }

    this.restoreOrgUnits.emit(this.selected_orgunits[0])
       // this.listenerToTableChange();
       // this.wasFirstEmitted = false;
    // console.log("Active First Emittion OrgUNit was fired");
   // this.updateOrgunits();
   //  }
    if (!this.checkOrgunitAvailabilty($event.node.data, this.orgunit_model.selected_orgunits)) {
      this.orgunit_model.selected_orgunits.push($event.node.data);
    }
    this.orgUnit = $event.node.data;
    this.emit(false);
  }

  emit(showUpdate: boolean) {
    const mapper = {};
    this.orgunit_model.selected_orgunits.forEach(function(orgUnit) {
      if (!mapper[orgUnit.level]) {
        mapper[orgUnit.level] = [];
      }
      mapper[orgUnit.level].push(orgUnit);
    });
    const arrayed_org_units = [];
    const tempArray = [];
    Object.keys(mapper).forEach(function(orgUnits) {
      arrayed_org_units.push(mapper[orgUnits]);
    });
    arrayed_org_units.forEach((array:any)=>{
      tempArray.concat(array[0])

    })

    // console.log("Listening to: "+JSON.stringify(arrayed_org_units[0]));
    //this.multiOrgUnits = arrayed_org_units[0];


    if (showUpdate) {
      this.onOrgUnitUpdate.emit({
        orgunit_model: this.orgunit_model,
        starting_name: this.getProperPreOrgunitName(),
        arrayed_org_units: arrayed_org_units,
        items: this.orgunit_model.selected_orgunits,
        name: 'ou',
        orgtree: this.orgtree,
        // value: this.getOrgUnitsForAnalytics(this.orgunit_model, this.pickChildren)
        value: ''
      });
      this.onOrgUnitModelUpdate.emit(this.orgunit_model);
    }else {
      this.onOrgUnitChange.emit({
        orgunit_model: this.orgunit_model,
        starting_name: this.getProperPreOrgunitName(),
        arrayed_org_units: arrayed_org_units,
        items: this.orgunit_model.selected_orgunits,
        name: 'ou',
        orgtree: this.orgtree,
        // value: this.getOrgUnitsForAnalytics(this.orgunit_model,  this.pickChildren)
        value: ''
      });
      this.onOrgUnitModelUpdate.emit(this.orgunit_model);
    }
  }


  // set selected groups
  setSelectedGroups( selected_groups ) {
    this.orgunit_model.selected_groups = selected_groups;
    this.onOrgUnitModelUpdate.emit(this.orgunit_model);
  }

  // set selected groups
  setSelectedUserOrg( selected_user_orgunit ) {
    this.orgunit_model.selected_user_orgunit = selected_user_orgunit;
    this.emit(false);
    //this.selectedOrgUnit.emit(this.selected_orgunits[0]);


  }

  // set selected groups
  setSelectedLevels( selected_levels ) {
    //console.log("Listening to: "+JSON.stringify(selected_levels));
    this.orgunit_model.selected_levels = selected_levels;
    this.emit(false);
  }

  prepareOrganisationUnitTree(organisationUnit, type: string = 'top') {
    if (type === 'top') {
      if (organisationUnit.children) {
        organisationUnit.children.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        organisationUnit.children.forEach((child) => {
          this.prepareOrganisationUnitTree(child, 'top');
        });
      }
    }else {
      organisationUnit.forEach((orgunit) => {
        if (orgunit.children) {
          orgunit.children.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          orgunit.children.forEach((child) => {
            this.prepareOrganisationUnitTree(child, 'top');
          });
        }
      });
    }
  }

  // prepare a proper name for updating the organisation unit display area.
  getProperPreOrgunitName(): string {
    let name = '';
    if ( this.orgunit_model.selection_mode === 'Group' ) {
      name = (this.orgunit_model.selected_groups.length === 0) ? '' : this.orgunit_model.selected_groups.map((group) => group.name).join(', ') + ' in';
    }else if ( this.orgunit_model.selected_user_orgunit.length !== 0 ) {
      name = (this.orgunit_model.selected_user_orgunit.length === 0) ? '' : this.orgunit_model.selected_user_orgunit.map((level) => level.name).join(', ');
    }else if ( this.orgunit_model.selection_mode === 'Level' ) {
      name = (this.orgunit_model.selected_levels.length === 0) ? '' : this.orgunit_model.selected_levels.map((level) => level.name).join(', ') + ' in';
    }else {
      name = '';
    }
    return name;
  }

  // get user organisationunit name
  getOrgUnitName(id) {
    const orgunit = this.orgtree.treeModel.getNodeById(id);
    return orgunit.name;
  }




}
