import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../Services/AuthenticationService";

@Component({
  selector: 'navbar',
  standalone: true,
  template: `
    <nav class="flex justify-end p-2 bg-neutral-200">
      @if (!busy) {
        @if (signedIn) {
          <div class="flex items-center gap-2">
            <p>{{displayName}} ({{username}})</p>
            <button class="border border-black p-1 hover:bg-slate-400" (click)="logOut()">Log Out</button>
          </div>
        } @else {
          <div class="flex gap-2">
            <input class="border border-black p-1" type="text" name="username" autocomplete="webauthn" [(ngModel)]="username">
            <button class="border border-black p-1 hover:bg-slate-400" (click)="signUp()">Sign Up</button>
            <button class="border border-black p-1 hover:bg-slate-400" (click)="logIn()">Log In</button>
          </div>
        }
      } @else {
        <p>Loading...</p>
      }
    </nav>
  `,
  imports: [
    FormsModule
  ]
})
export class NavbarComponent {
  signedIn = false;
  username = "";
  displayName = "";
  authentication = inject(AuthenticationService);
  busy = true;

  public async ngOnInit(){
    await this.update();
  }

  private async update() {
    this.busy = true;
    let me = await this.authentication.getActor();
    if (me) {
      this.signedIn = true;
      this.displayName = me.name;
      this.username = me.preferredUsername;
    }
    this.busy = false;
  }

  async signUp() {
    this.busy = true;
    let displayName: string | null = this.displayName;
    if (displayName.length < 1) displayName = null;
    if (await this.authentication.register(this.username, displayName)) await this.update();
  }

  async logIn() {
    this.busy = true;
    if (await this.authentication.signIn(this.username)) await this.update();
  }

  async logOut(){
    this.busy = true;
    if (await this.authentication.signOut()) await this.update();
  }
}
