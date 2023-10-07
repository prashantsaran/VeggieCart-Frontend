import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { login } from '../interface/login';
import { Observable, ObservedValueOf, catchError, mergeMap, of, switchMap, throwError } from 'rxjs';
import { resetPassword } from '../interface/resetPassword';
import { vegetables } from '../interface/vegetables';
import { register } from '../interface/register';
import { help } from '../interface/help';
import { Cart } from '../interface/Cart';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  seacrhItem: string = "";
  isLoggedIn: boolean = false;
  ticketNumber: string = "";
  verify: boolean = false;


  constructor(private http: HttpClient) { }
  loginUser(loginDetails: login): Observable<HttpResponse<string>> {
    const loginUrl = environment.login;

    return this.http.post(loginUrl, loginDetails, { observe: 'response', responseType: 'text' });
  }
  registerUser(registerDetails: register) {
    const registerUrl = environment.register;
    console.log(registerDetails);

    return this.http.post(registerUrl, registerDetails, { observe: 'response', responseType: 'text' });
  }
  sendOTP(email: string): Observable<HttpResponse<any>> {
    return this.http.post(environment.sendOtp, email, { observe: 'response', responseType: 'text' });
  }
  checkPresence(email: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain', // Set the content type to plain text
    });

    return this.http.post(environment.presence, email, {
      headers: headers,
      observe: 'response',
      responseType: 'text'
    });
  }
  // getProfile(): Observable<HttpResponse<register>> {
  //   return this.http.get<register>(environment.profileData, { observe: 'response' });
  // }
  getProfile() {
    return this.http.get(environment.profileData, { observe: 'response' });
  }



  checkPresenceAndSendOtp(email: string) {
    return this.checkPresence(email).pipe(
      mergeMap((presenceResponse: HttpResponse<any>) => {
        if (presenceResponse.status === 200) {
          console.log(presenceResponse.body)
          return this.sendOTP(email);
        } else {
          return throwError(presenceResponse.body);
        }
      }),
      // catchError(error => {
      //   // Handle the error here
      //   console.error(error);
      //   // You can return an Observable with an appropriate error message or logic
      //   return throwError('An error occurred');
      // })
    );
  }
  checkReset(email: string): Observable<HttpResponse<string>> {
    return this.http.post(environment.checkAndSendReset, email, { observe: 'response', responseType: 'text' });
  }
  resetPassword(reset: resetPassword): Observable<HttpResponse<string>> {
    return this.http.post(environment.resetPassword, reset, { observe: 'response', responseType: 'text' });
  }
  getVegetablesData(): Observable<vegetables[]> {
    return this.http.get<vegetables[]>(environment.getVegetablesData);
  }
  // sendReset(email:String):Observable<HttpResponse<string>>{
  //   return this.http.post(environment.sendReset,email,{observe:'response',responseType:'text'})
  // }
  // reset(email:string):Observable<HttpResponse<string>>{
  //   return this.http.post(environment.sendReset,email,{observe:'response',responseType:'text'})
  // }
  // resetPassword(email:string):Observable<HttpResponse<string>>{
  //   return this.http.post(environment.checkReset,email,{observe:'response',responseType:'text'});
  // }
  checkAndResetPassword(email: string, reset: register) {
    return this.checkReset(email).pipe(
      switchMap((presenceResponse: HttpResponse<any>) => {
        if (presenceResponse.status === 200) {
          console.log(presenceResponse.body)
          return this.resetPassword(reset);
        } else {
          return throwError(presenceResponse.body);
        }
      }),
      // catchError(error => {
      //   // Handle the error here
      //   console.error(error);
      //   // You can return an Observable with an appropriate error message or logic
      //   return throwError('An error occurred');
      // })
    );

  }
  getTicketId(): string {
    const number = Math.random() * (Math.pow(10, 18));
    console.log(number);

    return number.toString();
  }
  addIssue(issue: help): Observable<HttpResponse<string>> {
    return this.http.post(environment.addIssue, issue, { observe: 'response', responseType: 'text' });
  }
  getIssue(): Observable<HttpResponse<help>> {
    return this.http.get<help>(environment.getIssueList, { observe: 'response' });
  }
  checkLogin() {
    return this.http.get(environment.getIsLoggedIn, { observe: 'response' })
  }
  checkEmail(): Observable<HttpResponse<string>> {
    return this.http.get(environment.checkEmail, { observe: 'response', responseType: 'text' })
  }
  checkNotLoggedOut() {
    return this.http.get(environment.checkEmail, { observe: 'response', responseType: 'text' });
  }
  checkIsLoggedIn() {
    return this.checkEmail().pipe(
      mergeMap((presenceResponse: HttpResponse<any>) => {
        console.log(presenceResponse);

        if (presenceResponse.status == 200) {
          console.log(presenceResponse.status);

          console.log(presenceResponse.body)
          return this.getProfile();
        }
        return this.checkEmail();
      }), (error: any) => {
        console.log(error);
        return this.checkEmail();
      })
      ;
  }
  addToCart(cart: Cart) {
    return this.http.post(environment.addToCart, cart, { observe: 'response', responseType: 'text' })
  }

  getCart() {
    return this.http.get(environment.getCart, { observe: 'response' });
  }
  deleteCartItem(cartItem: Cart) {
    console.log(cartItem);

    // Make a custom HTTP request with the cartItem as the request body
    return this.http.request('delete', environment.deleteCartItem, { body: cartItem });
  }
  seacrh(name: string): Observable<HttpResponse<vegetables>> {
    return this.http.post<vegetables>(environment.searchVegetable, name, { observe: 'response' });
  }
  authLoggedIn(isValid: boolean) {
    if (isValid)
      this.verify = true;
    else
      this.verify = false;
  }
  logoutDataClear(): Observable<HttpResponse<String>> {
    return this.http.get(environment.logoutDataClear, { observe: 'response', responseType: 'text' });
  }
  verifyAuth(isValid: boolean) {
    if (isValid)
      this.verify = true;
    else
      this.verify = false;
  }
}
