import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Form } from "./components/form/form";
import { Getall as G1 } from "./components/t1/getall/getall";
import { Getall as G2 } from "./components/t2/getall/getall";
import { Getall as G3 } from "./components/t3/getall/getall";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Form, G1, G2, G3],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
