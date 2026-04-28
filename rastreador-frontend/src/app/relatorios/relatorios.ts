import { Component } from '@angular/core';
import { SidebarMenu } from '../sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [SidebarMenu],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css'
})
export class Relatorios {}
