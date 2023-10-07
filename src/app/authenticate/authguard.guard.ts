import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DataService } from '../service/data.service';
import { Injectable } from '@angular/core';
// export const authGuard: CanActivateFn = (route, state) => {
//   return false;
// };
@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private service: DataService, private router: Router) {
    this.router = router;
  }
  canActivate() {
    console.log(this.service.verify);
    if (this.service.verify) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }

  }

}
