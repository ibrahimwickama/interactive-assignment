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
      },
{
  id: "nq7F0t1Pz6t",
  displayName: "Arab Clinic"
},
{
  id: "r5WWF9WDzoa",
    displayName: "Baama CHC"
},
{
  id: "yMCshbaVExv",
    displayName: "Babara CHC"
},
{
  id: "tlMeFk8C4CG",
    displayName: "Badala MCHP"
},
{
  id: "YuQRtpLP10I",
    displayName: "Badjia"
},
{
  id: "Jiymtq0A01x",
    displayName: "Bafodia CHC"
},
{
  id: "jPidqyo7cpF",
    displayName: "Bagruwa"
},
{
  id: "XtuhRhmbrJM",
    displayName: "Baiama CHP"
},
{
  id: "BH7rDkWjUqc",
    displayName: "Bai Bureh Memorial Hospital"
},
{
  id: "c41XRVOYNJm",
    displayName: "Baiima CHP"
},
{
  id: "Rll4VmTDRiE",
    displayName: "Bai Largo MCHP"
},
{
  id: "Eyj2kiEJ7M3",
    displayName: "Bailor CHP"
},
{
  id: "HFyjUvMjQ8H",
    displayName: "Baiwala CHP"
},
{
  id: "MHAWZr2Caxw",
    displayName: "Bakeloko CHP"
},
{
  id: "LOpWauwwghf",
    displayName: "Bambara Kaima CHP"
},
{
  id: "mUuCjQWMaOc",
    displayName: "Bambara MCHP"
},
{
  id: "TNbHYOuQi8s",
    displayName: "Bambawolo CHP"
},
{
  id: "aSfF9kuNINJ",
    displayName: "Bambuibu Tommy MCHP"
},
{
  id: "wYLjA4vN6Y9",
    displayName: "Bambukoro MCHP"
},
{
  id: "jjtzkzrmG7s",
    displayName: "Banana Island MCHP"
},
{
  id: "FNnj3jKGS7i",
    displayName: "Bandajuma Clinic CHC"
},
{
  id: "ABM75Q1UfoP",
    displayName: "Bandajuma Kpolihun CHP"
},
{
  id: "rx9ubw0UCqj",
    displayName: "Bandajuma MCHP"
},
{
  id: "OZ1olxsTyNa",
    displayName: "Bandajuma Sinneh MCHP"
},
{
  id: "MpcMjLmbATv",
    displayName: "Bandajuma Yawei CHC"
},
{
  id: "qO2JLjYrg91",
    displayName: "Bandakarifaia MCHP"
},
{
  id: "U7yKrx2QVet",
    displayName: "Bandaperie CHP"
},
{
  id: "uPshwz3B3Uu",
    displayName: "Bandasuma CHP"
},
{
  id: "aF6iPGbrcRk",
    displayName: "Bandasuma Fiama MCHP"
},
{
  id: "lpAPY3QOY2D",
    displayName: "Bandawor MCHP"
},
{
  id: "t1aAdpBbDB3",
    displayName: "Bandusuma MCHP"
},
{
  id: "xQIU41mR69s",
    displayName: "Bangambaya MCHP"
},
{
  id: "pdF4XIHIGPx",
    displayName: "Bangoma MCHP"
},
{
  id: "rxc497GUdDt",
    displayName: "Banka Makuloh MCHP"
},
{
  id: "vWbkYPRmKyS",
    displayName: "Baoma"
},
{
  id: "FLjwMPWLrL2",
    displayName: "Baomahun CHC"
},
{
  id: "Yj2ni275yPJ",
    displayName: "Baoma (Koya) CHC"
},
{
  id: "a1dP5m3Clw4",
    displayName: "Baoma Kpenge CHP"
},
{
  id: "TQ5DSmdliN7",
    displayName: "Baoma (Luawa) MCHP"
},
{
  id: "t52CJEyLhch",
    displayName: "Baoma MCHP"
},
{
  id: "Y8foq27WLti",
    displayName: "Baoma Oil Mill CHC"
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
    let url = '../../../api/programs.json?fields=[*]&paging=false';
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
