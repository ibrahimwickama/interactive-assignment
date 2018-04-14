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
  }

  getSampleOrgUnits(){
    let sampleUnits
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
      var temp = response.json();
        this.dataSetsFromServer = temp.dataSets;
        this.dataSetsFromServer.forEach((dataSet:any)=>{
          dataSet.formType = 'dataSet';
        })
      //console.log("the dataSets are: "+JSON.stringify(this.dataSetsFromServer))
    }
      ).catch(this.handleError);
  }

  programCaller(){
    let url = '../../../api/programs.json?fields=[*]&paging=false';
    return this.http.get(url)
      .map((response:Response)=>{
      var temp = response.json();
        this.programsFromServer = temp.programs;
        this.programsFromServer.forEach((program:any)=>{
          program.formType = 'program';
        })
    }
      ).catch(this.handleError);
  }

  uploadDataAssignmentChangesToServer(newDataSetInfo){
    let url='../../../api/dataSets/'+newDataSetInfo.id+'.json?fields=organisationUnits';
    return this.http.put(url,newDataSetInfo.orgUnits)
      .map((response:Response)=> response.json()
    ).catch(this.handleError);
  }

  addFacilityToForm(payload){
    let url='../../../api/metadata';
    delete payload.lastUpdated;
    delete payload.created;
    delete payload.href;
    delete payload.formType;
    delete payload.assigned;
    return this.http.post(url,payload)
      .map((response:Response)=> response.json()
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
