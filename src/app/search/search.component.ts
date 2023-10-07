import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { vegetables } from '../interface/vegetables';
import { Cart } from '../interface/Cart';
import { Route, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  successfullyAdded: boolean = false;
  profile: any;
  vegetablesData: vegetables[] = [];
  isAdded: boolean = false;
  notLoggedIn: boolean = false;
  constructor(private vegetables: DataService, private router: Router) { }
  home() {
    this.router.navigate(['home']);
  }
  navigate() {
    this.router.navigate(['home']);
  }
  notFound: boolean = false;
  found: boolean = false;
  searchListData: vegetables[] = [];
  ngOnInit(): void {
    this.vegetables.seacrh(this.vegetables.seacrhItem).subscribe((data: any) => {
      console.log(data);

      if (data.status == 200) {
        this.searchListData = data.body;
        this.found = true;
      }
      else if (data.status == 204)
        this.notFound = true;
      console.log(this.searchListData);
      console.log(this.notFound);


    })
  }

  getVegetablesData(): void {
    this.vegetables.getVegetablesData().subscribe((data: vegetables[]) => {
      this.vegetablesData = data;
      console.log(this.vegetablesData);
    });
  }
  addToCart(vegetableCart: vegetables) {
    // Check if the user is logged in by calling 'checkNotLoggedOut'
    this.vegetables.checkNotLoggedOut().pipe(
      mergeMap((data: any) => {
        console.log(data);
        if (data.status === 200) {
          return this.vegetables.getProfile().pipe(
            mergeMap((profileData: any) => {
              console.log(profileData);
              if (profileData.status === 200) {
                console.log(profileData.body);

                this.profile = profileData.body || {}; // Handle the possibility of null response
                console.log(this.profile);

                // Assuming you need to pass 'vegetableCart' to addToCart() method
                const cart: Cart = {
                  name: vegetableCart.name,
                  email: this.profile.email,
                  price: vegetableCart.price,
                  quantity: 1
                };
                this.notLoggedIn = false;
                alert("Added to cart");
                console.log("This is cart data", cart);
                return this.addToUserCart(cart);
              } else {
                console.log("Inside else block of Login First");

                alert("Added To Cart");

                return this.profile();
              }
            })
          );
        } else {
          // Handle the case when the user is not logged in
          console.log("Inside else block of Login First else block");
          alert("Error while adding to cart Please try again");
          return this.vegetables.checkEmail();
        }
      })
    ).subscribe(
      (addToCartData: any) => {
        console.log('this is add to cart');
        console.log(addToCartData);
        if (addToCartData.status == 500)
          alert("Please Login First");
      },
      (error: any) => {
        //  alert("Please Login First");
        console.log('this is add to cart');
        console.log(error);
        if (error.status == 500)
          alert("Please Login First");

      }
    );
  }



  addToUserCart(vegetableCart: Cart) {
    // If the user is logged in (status code 200), you can now proceed
    // Assuming 'this.vegetables.addToCart()' requires 'vegetableCart' as an argument
    console.log("inside adding");
    this.vegetables.checkIsLoggedIn().pipe(
      mergeMap((presenceResponse: HttpResponse<any>) => {
        if (presenceResponse.status === 200) {
          console.log(presenceResponse.body);
          return this.vegetables.addToCart(vegetableCart);
        } else {
          return throwError(presenceResponse.body);
        }
      })
    ).subscribe(
      (data: any) => {
        if (data.status === 200) {
          console.log("Added");
          console.log(data);
         
          // Set a flag or perform some action indicating that the item was added to the cart
          this.isAdded = true;
        }
      },
      (error) => {
        // Handle errors here
      }
    );
  }

}
