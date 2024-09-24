import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../Services/AuthenticationService";

@Component({
  selector: 'navbar',
  standalone: true,
  template: `
    <nav class="flex justify-end p-2 bg-neutral-200">
      @if (signedIn) {
        <p>{{displayName}} ({{username}})</p>
      } @else {
        <div class="flex gap-2">
          <input class="border border-black p-1" type="text" name="username" autocomplete="webauthn" [(ngModel)]="username">
          <button class="border border-black p-1 hover:bg-slate-400" (click)="signUp()">Sign Up</button>
          <button class="border border-black p-1 hover:bg-slate-400" (click)="logIn()">Log In</button>
        </div>
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

  public async ngOnInit(){
    await this.update();
  }

  private async update() {
    let me = await this.authentication.getActor();
    if (me) {
      this.signedIn = true;
      this.displayName = me.displayName;
      this.username = me.username;
    }
  }

  signUp() {
    alert("not implemented");
  }

  async logIn() {
    if (await this.authentication.signIn(this.username)) await this.update();
  }
}
