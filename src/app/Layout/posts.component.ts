import {Component} from "@angular/core";
import {NoteComponent} from "../Components/note.component";

@Component({
  selector: "posts",
  standalone: true,
  template: `
    <section class="flex flex-col gap-2 mx-auto max-w-xl my-8">
      <button class="border stroke-black p-1 hover:bg-slate-400" (click)="update()">Load Posts</button>
      <ul>
        @for(note of this.userNotes; track note.id){
          <note [note]="note"></note>
        }
      </ul>
    </section>
  `,
  imports: [NoteComponent]
})
export class PostsComponent {
  userNotes: {id: string, content: string, author: {username: string, displayName: string}}[] = [];

  async update() {
    this.userNotes = [];
    let notes = await fetch("http://localhost:5063/api/actor/note", {
      method: "GET",
      credentials: 'include',
    });

    if (notes.ok) {
      this.userNotes = await notes.json();
    }
  }
}
