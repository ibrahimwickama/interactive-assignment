import { Injectable } from '@angular/core';
import {Http, RequestOptions,Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';

@Injectable()
export class HttpProviderService {
  options:any;
  dataSetsFromServer:any = [];
  programsFromServer:any = [];
  organisationUnits:any;


  constructor(private http: Http) {
    let reqstHeadDon = new Headers({
      'Access-Control-Allow-Origin': '*'});
    this.options = new RequestOptions({ headers: reqstHeadDon });

    this.organisationUnits = [
      {
        id: "Rp268JB6Ne4",
        displayName: "Adonkia CHP"
      },
      {
        id: "cDw53Ej8rju",
        displayName: "Afro Arab Clinic"
      },
      {
        id: "GvFqTavdpGE",
        displayName: "Agape CHP"
      },
      {
        id: "plnHVbJR6p4",
        displayName: "Ahamadyya Mission Cl"
      },
      {
        id: "BV4IomHvri4",
        displayName: "Ahmadiyya Muslim Hospital"
      },
      {
        id: "qjboFI0irVu",
        displayName: "Air Port Centre, Lungi"
      },
      {
        id: "dWOAzMcK2Wt",
        displayName: "Alkalia CHP"
      },
      {
        id: "kbGqmM6ZWWV",
        displayName: "Allen Town Health Post"
      },
      {
        id: "eoYV2p74eVz",
        displayName: "Approved School CHP"
      }
    ]


  }

  userInfo(){
    let url = '../../../api/me.json?paging=false';
    return this.http.get(url)
      .map((response:Response)=> response.json()
      ).catch(this.handleError);
  }

  dataSetCaller(){
    let url = '../../../api/dataSets.json?fields=[*]&paging=false';
    return this.http.get(url)
      .map((response:Response)=>{
      var temp = response.json()
        this.dataSetsFromServer = temp.dataSets;
      //console.log("the dataSets are: "+JSON.stringify(this.dataSetsFromServer))
    }
      ).catch(this.handleError);
  }

  programCaller(){
    let url = '../../../api/programs.json?paging=false';
    return this.http.get(url)
      .map((response:Response)=>{
      var temp = response.json()
        this.programsFromServer = temp.programs;
    }
      ).catch(this.handleError);
  }



  handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const newErrorObject: any = Object.assign({}, error);
      let sanitizedError = newErrorObject.message ? newErrorObject.message : newErrorObject._body ? newErrorObject._body : newErrorObject.toString();
      try {
        sanitizedError = (new Function('return ' + sanitizedError))();
        errMsg = sanitizedError.message;
      } catch (e) {
        errMsg = sanitizedError;
      }

    } else {
      const newErrorObject: any = Object.assign({}, error);
      let sanitizedError = newErrorObject.message ? newErrorObject.message : newErrorObject._body ? newErrorObject._body : newErrorObject.toString();
      try {
        sanitizedError = (new Function('return ' + sanitizedError))();
        errMsg = sanitizedError.message;
      } catch (e) {
        errMsg = sanitizedError;
      }
    }
    return Observable.throw(errMsg);
  }
}
