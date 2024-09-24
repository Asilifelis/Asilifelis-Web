import {Component, Input} from "@angular/core";

@Component({
  selector: "note",
  standalone: true,
  template: `
    <li class="p-1 border-b-2 border-slate-500 bg-slate-100">
      <span>
        {{note.author?.displayName}}
      </span>
      <span>{{note.content}}</span>
    </li>
  `,
})
export class NoteComponent {
  @Input() note!: { id: string; content: string, author: {username: string, displayName: string}};
}
