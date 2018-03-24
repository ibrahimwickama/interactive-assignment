import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MenuModule} from "./modules/menu/menu.module";
import {FormsModule} from "@angular/forms";
import {HttpProviderService} from "./services/http-provider.service";
import { DataSetsComponent } from './components/data-sets/data-sets.component';
import { ProgramsComponent } from './components/programs/programs.component';
// import {OrgUnitFilterComponent} from "./components/org-unit-filter/org-unit-filter.component";

@NgModule({
  declarations: [
    AppComponent,
    DataSetsComponent,
    ProgramsComponent
  ],
  imports: [
    BrowserModule,MenuModule,FormsModule
  ],
  providers: [HttpProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
