import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MenuModule} from "./modules/menu/menu.module";
import {FormsModule} from "@angular/forms";
import {HttpProviderService} from "./services/http-provider.service";
import { DataSetsComponent } from './components/data-sets/data-sets.component';
import { ProgramsComponent } from './components/programs/programs.component';
import {NgxPaginationModule} from "ngx-pagination";
import {TreeModule} from 'angular-tree-component';
import {SharedModule} from "./modules/shared/shared.module";
import {OrgUnitService} from "./modules/shared/services/org-unit.service";
import {HttpClientService} from "./modules/shared/services/http-client.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {getInitialState} from "./modules/store/application.state";
import {reducers} from "./modules/store/reducers/reducers";
import {StoreModule} from "@ngrx/store";
// import {OrgUnitFilterComponent} from "./components/org-unit-filter/org-unit-filter.component";

@NgModule({
  declarations: [
    AppComponent,
    DataSetsComponent,
    ProgramsComponent
  ],
  imports: [
    BrowserModule,MenuModule,FormsModule,NgxPaginationModule,
    TreeModule,SharedModule,HttpClientModule,
    StoreModule.forRoot(reducers, {
      initialState: getInitialState
    }),
  ],
  providers: [HttpProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
