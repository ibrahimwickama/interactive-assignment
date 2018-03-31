import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MenuModule} from "./modules/menu/menu.module";
import {FormsModule} from "@angular/forms";
import {HttpProviderService} from "./services/http-provider.service";
import { DataSetsComponent } from './components/data-sets/data-sets.component';
import { ProgramsComponent } from './components/programs/programs.component';
import {NgxPaginationModule} from "ngx-pagination";
import {OrgUnitModule} from "./modules/orgUnitModel/orgUnitSettings/orgUnit.module";
import {DataFilterModule} from "./modules/data-filter/data-filter.module";

@NgModule({
  declarations: [
    AppComponent,
    DataSetsComponent,
    ProgramsComponent
  ],
  imports: [
    BrowserModule,MenuModule,FormsModule,NgxPaginationModule,OrgUnitModule,DataFilterModule

  ],
  providers: [HttpProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
