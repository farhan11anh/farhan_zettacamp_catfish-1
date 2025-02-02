import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AppService, Nav, Log } from './app.service';
import { AuthguardServiceService } from './authguard-service.service';
import { LoginService } from './login-management/login.service';



//dialog
import { MatDialog } from '@angular/material/dialog';
import { TopupWalletService } from './topup/topup-wallet.service';
import { TopupWalletComponent } from './topup/topup-wallet/topup-wallet.component';
import { StockService } from './stock-management-management/stock.service';

// service 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // user data
  user:any
  // if login as admin return true
  adm!:boolean

  title = 'ohMy';

  language:string = "en"

  loged!:boolean|null;

  logStatus!:Log[];

  // save nav temp
  nav!:Nav[]

  wallet:any

  statusCheckout:boolean = false
  time:any

  order_status = "pending"
  confirm = false

  //id trans pending
  id_pend:string|null = null

  constructor(
    private login:LoginService,
    private router:Router,
    private appServ:AppService,
    private guard:AuthguardServiceService,
    private translate:TranslateService,
    private dialog:MatDialog,
    private stockServ : StockService
  ) { }

  ngOnInit(){

    this.getTransaction()

    setInterval(()=>{
      this.getTransaction()
    }, 15000)

    //check jwt expired
    this.stockServ.getIngridients({limit:5, page:0}, name).subscribe(
      data=>{
        // console.log(data);
      }, err=>{
        // console.log(err);

      let data = localStorage.getItem('token') ? true : false


        if(data){
          this.router.navigate(['/login'])
          // window.location.href = "/login"
          localStorage.removeItem(environment.tokenKey);
          localStorage.removeItem('user');

        }

        
      }
    )

    this.appServ.getStatusCheckout().subscribe(
      (data:any)=>{
        // console.log(data);
        this.statusCheckout = data

        clearTimeout(this.time)

        // let time:any
        // if(this.statusCheckout){
        //   time = setTimeout(()=>{
        //     Swal.fire(
        //       'Your item has been deleted, because you not checkout in 5 minutes',
        //       'You not checkout',
        //       'success'
        //     )
        //   }, 20000)
        //   // this.setAlertDel()
        // } else {
        //   console.log('clear');
        //   clearTimeout(time)
        // }
      }
    )

    setInterval(()=>{
      if(this.statusCheckout == true){

        this.time = setTimeout(()=>{
          if(this.statusCheckout == true){
            // Swal.fire(
            //   'Your item has been deleted',
            //   'You not checkout',
            //   'success'
            // )
            this.statusCheckout = false
          }
        }, 300000)
      }else {
        clearTimeout(this.time)
      }
    }, 1)



    this.getWallet()

    const usr:any = localStorage.getItem('user') ? localStorage.getItem('user') : false
    if(usr !== false){
      
      
      const user = JSON.parse(usr)
      this.user = user
      this.adm = user.user_type[4].view // if admin true

      //if user(not admin)
      if(user.user_type[4].view == false){
        this.appServ.getNav().subscribe(
          (nav:any)=>{
            this.nav = nav;
          }
        )
      } else {
        // if admin
        this.appServ.changeAdmin().subscribe(
          (nav:any)=>{
            this.nav = nav;
          }
        )
      }
      
    } else {
      // if not login
      this.appServ.changeNotLog().subscribe(
        (nav:any)=>{
          this.nav = nav;
        }
      )
      
    }
    
    let data = localStorage.getItem('token') ? true : false
    this.loged = data;
  
    
  }

  setAlertDel(){
      let time = setTimeout(()=>{
        Swal.fire(
          'Your item has been deleted, because you not checkout in 5 minutes',
          'You not checkout',
          'success'
        )
      }, 20000)
  }

  // get transaction
  getTransaction(){
    console.log(this.id_pend);
    

    // get id form transaction status pending
    this.appServ.getPending().valueChanges.subscribe(
      (data:any)=>{
        console.log(data);
        
        if(data.data.getAllTransactions.length !== 0){
          console.log(data.data.getAllTransactions[0]._id);
          const id = data.data.getAllTransactions[0]._id
          this.id_pend = data.data.getAllTransactions[0]._id
          console.log(this.id_pend);
        } else {
          console.log('not');
          
        }

      }
    )


    if(this.id_pend !== null){
      console.log('yaho');
      
      this.appServ.getOneTrans(this.id_pend).valueChanges.subscribe(
        (data:any)=>{
          console.log(data.data.getOneTransactions);
          const res = data.data.getOneTransactions
  
          const order_status = res.order_status
  
          this.order_status = order_status
  
          const confirm = res.confirm
  
          this.confirm = confirm
  
          if(this.order_status == 'failed' && !this.confirm){
            // console.log('aha');
            
            Swal.fire({
              title: 'Whoaa',
              text: "Your item at cart has been deleted because you didnt checkout within 5 minutes",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                let id = ""
                this.appServ.getOneTrans(this.id_pend).valueChanges.subscribe(
                  (data:any)=>{
                    const res = data.data.getOneTransactions[0]
                    id = res._id
                    // console.log(id);
                    this.appServ.confirm(this.id_pend).subscribe(
                      data=>{
                        // console.log(data);
                      }
                    )
                  }
                )
                // console.log(id);
                  
                Swal.fire(
                  'oho',
                  'Your file has been deleted.',
                  'success'
                )
              }
            })
          }
          
          
        }
      )
    }



  }

  // get wallet
  getWallet(){
    this.appServ.getWallet().valueChanges.subscribe(
      (data:any)=>{
        this.wallet = data.data.getOneUser.wallet
        
      }
    )
  }

  // change localization
  changeLang(){
    if(this.language == "en"){
      this.translate.use("fr")
      this.language = "fr"
    } else {
      this.translate.use("en")
      this.language = "en"
    }
  }

  getLogin(){
    this.appServ.getLogStatus().subscribe(
      (data:any)=>{
        this.logStatus = [data]
      }
    )
  }

  public logIn(){
    this.appServ.changeStatus({name:"Logout", icon:"supervisor_account"});
    this.getLogin()
    this.router.navigate(['/'])
  }

  logOut(){
    Swal.fire({
      title: this.translate.instant('Are you sure to logout?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('Yes'),
      cancelButtonText : this.translate.instant("No")
    })
    
    .then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/'])
        window.location.href = "/"
        localStorage.removeItem(environment.tokenKey);
        localStorage.removeItem('user');
        // Swal.fire(
        //   'Log Out',
        //   'You success to logout',
        //   'success'
        // )
      }
    })
  }


  openDialog(){
    const dialogRef = this.dialog.open(TopupWalletComponent, {
      width:"300px",
      data: {
        hola:"test"
      }
    })
    dialogRef.afterClosed().subscribe(
      res=>{
        if(res){
          this.getWallet()
        }
        
      }
    )
  }


}
