import { Component, OnInit, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MenuService } from '../menu.service';
import { MatDialog } from '@angular/material/dialog';
import { MenuAddComponent } from '../menu-add/menu-add.component';
@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {

  loaded=false

  @ViewChild('paginator') paginator!: MatPaginator;
  length = 6
  pageSizeOptions: number[] = [8, 10, 16, 20];
  pagination:any = {
    page: 0,
    limit: 8
  }

  subs = new SubSink();

  recipes:any

  constructor(
    private menuServ : MenuService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(){
    this.subs.sink = this.menuServ
    .getRecipes(this.pagination)
    .valueChanges.subscribe(
      (data:any) => {

        if(data){
          this.loaded = true
        }

        this.recipes = data.data.getAllRecipes;
        // console.log(this.recipes[0].total_count);

        // set pagainate
        const length = this.recipes[0].total_count
        this.paginator.length = length;
        this.paginator.pageSize = this.pageSizeOptions[0]; // 6
      }
    )
  }

  // initPaginator() {
  //     this.menuServ.getRecipes({limit:1000, page:0}).valueChanges.subscribe(
  //       (data:any) => {
  //         const length = data.data.getAllRecipes.length
  //         this.paginator.length = length;
  //         this.paginator.pageSize = this.pageSizeOptions[0]; // 6
  //       }
  //     )
  // }

  onPaginatorChange(event: PageEvent) {
    this.pagination.limit = event.pageSize;
    this.pagination.page = event.pageIndex;
    // refetch data
    this.refetchData();
    this.getData()
  } 

  refetchData() {
    const pagination = this.pagination;
    this.menuServ.getRecipes(pagination).refetch();
  }

  openDialog(){
    const dialogRef = this.dialog.open(MenuAddComponent, {
      width:"400px",
      data: {
        hola:"test"
      }
    })
    dialogRef.afterClosed().subscribe(
      res=>{
        if(res){
          this.getData()
        }
        
      }
    )
  }

}
