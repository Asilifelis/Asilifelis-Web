import {Injectable} from '@angular/core';
import {startAuthentication, startRegistration} from "@simplewebauthn/browser";
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private BaseUri = "https://winter-cottage.eu";

  async getActor() : Promise<{id: string, name: string, preferredUsername: string, summary: string, outbox: URL, inbox: URL}> {
    let me = await fetch(new URL("/api/authenticate/me", this.BaseUri), {
      method: "GET",
      credentials: 'include',
      headers: {
        "Accept": "application/activity+json"
      }
    });

    return me.ok ? await me.json() : null;
  }

  async register(username: string, displayName?: string | null) {
    let data = new URLSearchParams();
    data.append("username", username);
    if (displayName) data.append("displayName", displayName);

    let options = await fetch(new URL("/api/authenticate/attestation/options", this.BaseUri), {
      method: "POST",
      credentials: 'include',
      body: data
    });

    let attestationResponse = await startRegistration(await options.json());
    let result = await fetch(new URL("/api/authenticate/attestation/make", this.BaseUri), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: 'include',
      body: JSON.stringify(attestationResponse)
    });

    return result.ok;
  }

  async signIn(username: string){
    let data = new URLSearchParams();
    data.append("username", username);
    let options = await fetch(new URL("/api/authenticate/assertion/options", this.BaseUri), {
      method: "POST",
      credentials: 'include',
      body: data
    });

    let assertionResponse = await startAuthentication(await options.json());
    let result = await fetch(new URL("/api/authenticate/assertion/make", this.BaseUri), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: 'include',
      body: JSON.stringify(assertionResponse)
    });

    return result.ok;
  }

  async signOut() {
    let result = await fetch(new URL("/api/authenticate/logout", this.BaseUri), {
      method: "POST",
      credentials: 'include'
    });
    return result.ok;
  }
}
