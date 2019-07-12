import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  url = "localhost:3000";

  saveUser(user) {
    return this.http.post(this.url + '/api/saveUser', user);
  }

  getUser() {
    return this.http.get(this.url + '/api/getUser');
  }
}
