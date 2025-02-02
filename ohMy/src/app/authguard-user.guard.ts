import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthguardServiceService } from './authguard-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardUserGuard implements CanActivate {

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private authGuard : AuthguardServiceService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authGuard.getUserType()){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You must login as admin to access this page'
        })
        this.router.navigateByUrl("/")      
        return false     
      } else {
        return true
      }
  }
  
}
