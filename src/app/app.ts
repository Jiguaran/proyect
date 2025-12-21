import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Form } from "./components/form/form";
import { Getall as G1 } from "./components/t1/getall/getall";
import { Getall as G2 } from "./components/t2/getall/getall";
import { Getall as G3 } from "./components/t3/getall/getall";
import { Getall as G6 } from "./components/t6/getall/getall";
import {Getall as GF} from "./components/tf/getall/getall";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Form, G1, G2, G3,G6, GF],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
