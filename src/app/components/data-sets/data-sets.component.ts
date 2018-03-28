import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpProviderService} from "../../services/http-provider.service";

@Component({
  selector: 'app-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.css']
})
export class DataSetsComponent implements OnInit {
  initDataSets:any = [];
  initDataSetsBackUp:any = [];
  selectedDataSetColor:any;
  loaderMessage:string = 'fetching dataSets...';
  showLoader:boolean = false;

  @Output() exportedDataset = new EventEmitter();


  constructor(private httpProvider: HttpProviderService) { }

  ngOnInit() {
    this.callDataSets();
  }

  callDataSets(){
    if(this.httpProvider.dataSetsFromServer.length <= 0){
      this.showLoader = true;
      this.httpProvider.dataSetCaller().subscribe(response =>{
        this.showLoader = false;
        this.initDataSets = this.httpProvider.dataSetsFromServer;
        this.initDataSetsBackUp = this.httpProvider.dataSetsFromServer;
      });
    }else {
      this.initDataSets = this.httpProvider.dataSetsFromServer;
      this.initDataSetsBackUp = this.httpProvider.dataSetsFromServer;
    }

  }

  selectedDataSet(selectedDataSet){
    this.exportedDataset.emit(selectedDataSet);
  }

  choosedDataSet(choosedDataSet){
    this.selectedDataSetColor = '#f7f7f7';
  }

  getFilteredList(ev) {
    let val = ev.target.value;
    // console.log("the value : "+val);
    this.initDataSets = this.initDataSetsBackUp;
    if(val && val.trim() != ''){
      this.initDataSets = this.initDataSets.filter((file:any) => {
        return (file.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.initDataSets = this.initDataSetsBackUp;
    }
  }

}
