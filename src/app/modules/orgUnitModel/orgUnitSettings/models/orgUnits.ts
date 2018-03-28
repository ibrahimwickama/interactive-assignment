import {OrgUnitModel} from './org-unit-model';
export interface OrgUnitData {
  id: string;
  name: string;
  data: OrgUnitsData | any;
}
export interface OrgUnitsData {
    orgunit_settings: OrgUnitModel;

}
