import {Injectable} from '@angular/core';
import {startAuthentication} from "@simplewebauthn/browser";
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  async getActor() {
    let me = await fetch("http://localhost:5063/api/authenticate/me", {
      method: "GET",
      credentials: 'include',
    });

    return me.ok ? await me.json() : null;
  }

  async signIn(username: string){
    let data = new URLSearchParams();
    data.append("username", username);
    let options = await fetch("http://localhost:5063/api/authenticate/assertion/options", {
      method: "POST",
      credentials: 'include',
      body: data
    });

    let assertionResponse = await startAuthentication(await options.json());
    let result = await fetch("http://localhost:5063/api/authenticate/assertion/make", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: 'include',
      body: JSON.stringify(assertionResponse)
    });

    return result.ok;
  }
}
