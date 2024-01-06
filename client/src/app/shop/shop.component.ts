import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{
  @ViewChild('search') searchTerm?: ElementRef;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams = new ShopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name:'Price: Low to High', value:'priceAsc'},
    {name:'Price: High to Low', value:'priceDesc'}
  ]
  totalCount = 0;

  constructor(private shopService: ShopService){}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: res => {
        this.products = res.data;
        this.shopParams.pageNumber = res.pageIndex;
        this.shopParams.pageSize = res.pageSize;
        this.totalCount = res.count;
      },
      error: err => console.log(err)
    })
  }

  getBrands(){
    this.shopService.getBrands().subscribe({
      next: res => this.brands = [{id:0, name:'All'}, ...res],
      error: err => console.log(err)
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe({
      next: res => this.types = [{id:0, name:'All'}, ...res],
      error: err => console.log(err)
    })
  }

  onBrandIdSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeIdSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event :any){
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: number){
    if (this.shopParams.pageNumber != event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    if (this.searchTerm) {
      this.shopParams.search = this.searchTerm.nativeElement.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  onReset(){
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
