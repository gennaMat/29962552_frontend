import { Component, OnInit, Type } from '@angular/core';
import { faSignInAlt, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../app.component.css']
})
export class LoginComponent implements OnInit {


  fUsernameControl = new FormControl('',[
    Validators.required,
    Validators.email
  ]);

  fPasswordControl = new FormControl('',[
    Validators.required
  ])


  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private router: Router) { }

  loginTitle = "Login";
  loginIco = faSignInAlt;
  btnLogin = "Login";
  btnSignUp = "Sign Up";
  routerLink = "/";

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  showSpinner = false ;

  loadLogin()
  {
    this.showSpinner = true ;
    setTimeout(() => {
      this.showSpinner = false ;
    },5000);
  }

  login()
  {
    let userEmail =  this.fUsernameControl.value;
    let userPassword =  this.fPasswordControl.value;

    this.http.post('https://gen-project2-api.herokuapp.com/user/login',{
              email: userEmail,
              password: userPassword
            },)
            .subscribe(Response => {
              console.log(Response);
             
              var result = [];
              for(var i in Response)
              {
                result.push([i,Response[i]]);
              }

              if(result[0][1].toString().includes('success'))
              {
                localStorage.setItem('token',result[1][1]);
                localStorage.setItem('email',userEmail);
                this.router.navigate(['/home']);
              }
              this.openSnackBar(result[0][1].toString(),"Close");
             
    });
  }

  ngOnInit(): void {
  }

}
