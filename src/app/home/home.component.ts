import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { faFileUpload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {idNumberValidator} from '../validators/id-number.validator';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../app.component.css']
})
export class HomeComponent implements OnInit {
  fIDNumberControl = new FormControl('',[
    Validators.required,
    idNumberValidator
  ]);

  fNameControl = new FormControl('',[
    Validators.required,
    Validators.minLength(1)
  ]);

  fLastControl = new FormControl('',[
    Validators.required,
    Validators.minLength(1)
  ]);

  fContact = new FormControl('',[
    Validators.required,
    Validators.minLength(10)
  ]);

  fNationality = new FormControl('',[
    Validators.required,
    Validators.minLength(2)
  ]);

  clearInputs()
  {
    this.fIDNumberControl.setValue('');
    this.fNameControl.setValue('');
    this.fLastControl.setValue('');
    this.fContact.setValue('');
    this.fNationality.setValue('');
    var link = document.getElementById('inputs-div');
    link.style.visibility = 'hidden';
  }
  showInputs()
  {
    var link = document.getElementById('inputs-div');
    link.style.visibility ='visible' ;
  }

  getUserDataFromFile(dataArray)
  {
    for(let i = 0; i<dataArray.length; i++)
    {
      
      if(dataArray[i][0].toString().includes('id'))
      {
        this.fIDNumberControl.setValue(dataArray[i][1]);
      }

      if(dataArray[i][0].toString().includes('first'))
      {
        this.fNameControl.setValue(dataArray[i][1]);
      }
      
      if(dataArray[i][0].includes('last'))
      {
        this.fLastControl.setValue(dataArray[i][1]);
      }

      if(dataArray[i][0].includes('contact') || dataArray[i][0].includes('number'))
      {
        this.fContact.setValue(dataArray[i][1]);
      }

      if(dataArray[i][0].includes('nat') || dataArray[i][0].includes('origin'))
      {
        this.fNationality.setValue(dataArray[i][1]);
      }
    }
  }
  
  inputChange(fileInputEvent: any) {
    var file = fileInputEvent.target.files[0] ;
    if(file != null)
    {
      let formData:FormData = new FormData();
      formData.append('user-file',file,file.name);

      let userEmail = localStorage.getItem('email');
      let token = 'Bearer ' ;
      token += localStorage.getItem('token'); 

      let httpHeaders = new HttpHeaders()
      .set('Authorization', token);

      this.http.post('https://gen-project2-api.herokuapp.com/userFile/upload/'+ userEmail, formData ,{headers: httpHeaders})
      .subscribe(Response => {
        console.log(Response);

        var result = [];
        for(var i in Response)
        {
          result.push([i,Response[i]]);
        }
        
        if(result[0][1].toString().includes('success'))
        {
          this.load();
          var userData = Object.entries(result[1][1]);
          this.getUserDataFromFile(userData);
          this.showInputs();
          this.openSnackBar(result[0][1].toString(),"Close");
        }
      });
    }   
  };

  uploadTitle = "Upload" ;
  uploadSub = "Upload your file here";
  btnUploadTitle = "Upload File";
  uploadIco = faFileUpload;

  infoTitle = "Personal Information" ;
  infoSubtitle = "Check your personal info";
  infoIco = faInfoCircle;

  btnSubmitTitle = "Submit" ;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { 
  }

  showSpinner = false ;

  load()
  {
    this.showSpinner = true ;
    setTimeout(() => {
      this.showSpinner = false ;
    },5000);
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  submitInfo(){
    if(this.fIDNumberControl.valid)
    {
      if(this.fNameControl.valid)
      {
        if(this.fLastControl.valid)
        {
          if(this.fContact.valid)
          {
            if(this.fNationality.valid)
            {
              let userEmail = localStorage.getItem('email');
              let token = 'Bearer ' ;
              token += localStorage.getItem('token'); 
          
              let httpHeaders = new HttpHeaders()
              .set('Authorization', token);
          
              var data = [
                {'propName' : 'idNum', 'value': this.fIDNumberControl.value},
                {'propName' : 'fName', 'value': this.fNameControl.value},
                {'propName' : 'lName', 'value': this.fLastControl.value},
                {'propName' : 'contact', 'value': this.fContact.value},
                {'propName' : 'national', 'value': this.fNationality.value}
              ]     
          
              this.http.patch('https://gen-project2-api.herokuapp.com/user/'+ userEmail, data ,{headers: httpHeaders})
              .subscribe(Response => {
                console.log(Response);

                var result = [];
                for(var i in Response)
                {
                  result.push([i,Response[i]]);
                }
                console.log(result);
                if(result[0][1].toString().includes('updated'))
                {
                  this.clearInputs();
                }
                this.openSnackBar(result[0][1].toString(),"Close");
              });
            }
            else
            {
              this.openSnackBar("Please provide your nationality","Close");
            }
          }
          else
          {
            this.openSnackBar("Please provide your contact number","Close");
          }
        }
        else
        {
          this.openSnackBar("Please provide your surname","Close");
        }
      }
      else
      {
        this.openSnackBar("Please provide your name","Close");
      }
    }
    else
    {
      this.openSnackBar("Please provide your ID number","Close");
    }
  }
  

  ngOnInit(): void {
  }
}
