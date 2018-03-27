import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import {FilterLevelPipe} from './pipes/filter-level.pipe';
import {OrderPipe} from './pipes/order-by.pipe';
import {OrgUnitFilterComponent} from './components/org-unit-filter/org-unit-filter.component';
import {MultiselectComponent} from './components/org-unit-filter/multiselect/multiselect.component';
import {PeriodFilterComponent} from './components/period-filter/period-filter.component';
import { OptionsComponent } from './components/options/options.component';
import {FilterIndicatorByNamePipe} from './pipes/filter-indicator-by-name.pipe';
import {PlaceholderComponent} from './components/placeholder/placeholder.component';
import {OrgUnitService} from "./services/org-unit.service";
import {HttpClientService} from "./services/http-client.service";
import {HttpClient} from "@angular/common/http";
import {Constants} from "./services/costants";
import {ScorecardService} from "./services/scorecard.service";
import {DataService} from "./services/data.service";
import {StoreService} from "./services/store-service";

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    NgxPaginationModule,
    FormsModule,
  ],
  declarations: [
    ClickOutsideDirective,
    FilterByNamePipe,
    SafeHtmlPipe,
    FilterLevelPipe,
    OrderPipe,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    MultiselectComponent,
    OptionsComponent,
    FilterIndicatorByNamePipe,
    PlaceholderComponent,
  ],
  exports: [
    TreeModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    FilterByNamePipe,
    SafeHtmlPipe,
    ClickOutsideDirective,
    FilterLevelPipe,
    OrderPipe,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    MultiselectComponent,
    OptionsComponent,
    FilterIndicatorByNamePipe,
    PlaceholderComponent,
  ],
   providers: [HttpClientService,OrgUnitService,HttpClient,Constants,ScorecardService,DataService,StoreService],
})
export class SharedModule { }
