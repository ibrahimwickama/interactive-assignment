import { BrowserModule } from '@angular/platform-browser';
import {NgModule, ViewRef} from '@angular/core';

import { AppComponent } from './app.component';
import {MenuModule} from "./modules/menu/menu.module";
import {FormsModule} from "@angular/forms";
import {HttpProviderService} from "./services/http-provider.service";
import { DataSetsComponent } from './components/data-sets/data-sets.component';
import { ProgramsComponent } from './components/programs/programs.component';
import {NgxPaginationModule} from "ngx-pagination";
import {OrgUnitModule} from "./modules/orgUnitModel/orgUnitSettings/orgUnit.module";
import {DataFilterModule} from "./modules/data-filter/data-filter.module";
import {LayoutModule} from "./modules/layout/layout.module";
import {TourCompComponent} from "./components/tour-comp/tour-comp.component";
import { TableDisplayComponent } from './table-display/table-display.component';

@NgModule({
  declarations: [
    AppComponent,
    DataSetsComponent,
    ProgramsComponent,TourCompComponent, TableDisplayComponent
  ],
  imports: [
    BrowserModule,MenuModule,FormsModule,NgxPaginationModule,OrgUnitModule,DataFilterModule,LayoutModule

  ],
  providers: [HttpProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
