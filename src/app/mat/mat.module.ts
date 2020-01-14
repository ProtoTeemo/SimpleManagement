import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
   MatTableModule, 
   MatSortModule, 
   MatInputModule } from '@angular/material';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatInputModule
  ]
})
export class MatModule { }
