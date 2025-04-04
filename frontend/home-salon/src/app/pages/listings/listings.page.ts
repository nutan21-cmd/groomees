import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Slider } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBar } from 'primeng/progressbar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { Tag } from 'primeng/tag';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

interface Item {
  _id: string;
  title: string;
  price?: number;
  contentDescription?: string;
  contentHighlights?: string;
  imageUrl: string;
  type?: string;
  categoryId?: string;
}

interface Category {
  _id: string;
  title: string;
  imageUrl: string;
  items?: Item[];
}

@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
  standalone: true,
  providers: [MessageService], // Add MessageService here
  imports: [
    IonContent,
    ButtonModule,
    InputTextModule,
    DialogModule,
    IonHeader,
    TableModule,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    AccordionModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    RippleModule,
    ConfirmDialogModule ,
    ReactiveFormsModule,
  ],
})
export class ListingsPage {
  items: Item[] = [];
  categories: Category[] = [];
  selectedItem: Item = {} as Item;
  selectedCategory: Category = {} as Category;
  
  itemDialog: boolean = false;
  categoryDialog: boolean = false;
  deleteItemDialog: boolean = false;
  deleteCategoryDialog: boolean = false;
  
  activeIndex: number = 0;
  submitted: boolean = false;
  treatmentForm: FormGroup; // Reactive form for treatment
  
  constructor(private messageService: MessageService,private fb: FormBuilder,private http:HttpClient) {
    this.treatmentForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      contentDescription: ['', [Validators.required]],
      contentHighlights: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      type: ['PACKAGE', [Validators.required]],
      categoryId: null
    });
  }

  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    // Mock data for items
    this.items = [
      {
        "_id": "67e8091a19c0d43cc5f107e0",
        "title": "Fairy Tale Hair Spa",
        "price": 59.99,
        "contentDescription": "A relaxing hair spa treatment that nourishes and strengthens young hair.",
        "contentHighlights": "Gentle shampoo and deep conditioning.\n Scalp massage for relaxation.\n Hairstyling with braids or curls.\n Uses mild, sulfate-free hair products.",
        "imageUrl": "https://m.media-amazon.com/images/I/71s5dPueqqL._AC_UF894,1000_QL80_.jpg",
        "type": "PACKAGE"
      },
      {
        "_id": "67e80b72e58f1d3f3f64bb1f",
        "title": "Glamorous Makeover Session",
        "price": 99.99,
        "contentDescription": "A complete transformation with professional makeup and hairstyling for a stunning look.",
        "contentHighlights": "Customized makeup based on skin type.\n Elegant hairstyling with curls or updos.\n Includes consultation for the perfect look.\n Ideal for special events and parties.",
        "imageUrl": "https://c1.wallpaperflare.com/preview/237/131/775/este-aroma-body-treatments-oil-massage-salon-relaxation.jpg",
        "type": "OFFER"
      },
      {
        "_id": "67ee3a797ee70d00ac985b87",
        "title": "Hair Spa Therapy",
        "price": 1499,
        "contentDescription": "A relaxing hair treatment to nourish the scalp and revitalize hair.",
        "contentHighlights": "Deeply nourishes the scalp and hair.\n Improves hair texture and volume.\n Strengthens hair follicles and prevents damage.\n Provides a soothing head massage.",
        "imageUrl": "https://media.istockphoto.com/id/1339268647/photo/top-view-of-client-sitting-close-to-sink.jpg?s=612x612&w=0&k=20&c=bEncDvz6rXHz9GtUatrFJ0kjJUB0syXlXl6aF7L-hIo=",
        "categoryId": "67e76ef476a4636407fb1304",
        "type": "TREATMENT"
      },
      {
        "_id": "67ee3e147ee70d00ac985ba8",
        "title": "Hot Stone Massage",
        "price": 2499,
        "contentDescription": "A therapeutic massage using heated stones to relieve tension and stress.",
        "contentHighlights": "Uses smooth, heated stones for deep relaxation.\n Relieves muscle stiffness and pain.\n Enhances blood circulation and promotes detoxification.\n Provides a soothing and calming experience.",
        "imageUrl": "https://5.imimg.com/data5/ANDROID/Default/2023/8/336724975/GP/HA/GR/117197059/product-jpeg-500x500.jpg",
        "categoryId": "67e76ef476a4636407fb1302",
        "type": "TREATMENT"
      },
      {
        "_id": "67ee39d87ee70d00ac985b7f",
        "title": "Keratin Hair Treatment",
        "price": 2499,
        "contentDescription": "A deep conditioning treatment that smoothens frizz and enhances shine.",
        "contentHighlights": "Reduces frizz and adds shine.\n Strengthens hair and reduces breakage.\n Long-lasting smooth and silky finish.\n Suitable for all hair types.",
        "imageUrl": "https://static.showit.co/1200/XOi4dpcoTPKX5jMsd2mErA/182606/img_0789.jpg",
        "categoryId": "67e76ef476a4636407fb1304",
        "type": "TREATMENT"
      },
      {
        "_id": "67e7857272acd573c16d7b4d",
        "title": "Keratine Hair Spa Treatment with Serum",
        "price": 7199,
        "contentDescription": "Any Length",
        "contentHighlights": "Looks moist into hair\n For stong smooth shiny hair\n Nourishes for healthy, soft hair\n It has pro-retinol helps in reducing appearence of aging signs",
        "imageUrl": "https://plus.unsplash.com/premium_photo-1661576866935-6e92c2f2e9f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "categoryId": "67e76ef476a4636407fb1304",
        "type": "TREATMENT"
      }
    ];
    
    // Mock data for categories
    this.categories = [
      {
        "_id": "67e76ef476a4636407fb1306",
        "title": "Body Massage",
        "imageUrl": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        "_id": "67e76ef476a4636407fb1302",
        "title": "Facial",
        "imageUrl": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        "_id": "67e76ef476a4636407fb1304",
        "title": "Hair",
        "imageUrl": "https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }
    ];
    
    // Associate items with their categories
    this.categories.forEach(category => {
      category.items = this.items.filter(item => item.categoryId === category._id);
    });
  }
  
  openNew(type: string) {
    if (type === 'package') {
      this.selectedItem = {
        _id: this.generateId(),
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        type: 'PACKAGE'
      };
      this.submitted = false;
      this.itemDialog = true;
    } else if (type === 'offer') {
      this.selectedItem = {
        _id: this.generateId(),
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        type: 'OFFER'
      };
      this.submitted = false;
      this.itemDialog = true;
    } else if (type === 'category') {
      this.selectedCategory = {
        _id: this.generateId(),
        title: '',
        imageUrl: ''
      };
      this.submitted = false;
      this.categoryDialog = true;
    }
      else if (type === 'treatment') {
        this.treatmentForm.reset();
        this.treatmentForm.patchValue({ type: 'TREATMENT' });
        this.itemDialog = true;
        this.submitted = false;
      }

  }

  saveTreatment() {
    this.submitted = true;

    if (this.treatmentForm.invalid) {
      return;
    }

    const treatmentData = this.treatmentForm.value;

    this.http.post('http://localhost:3000/api/treatments', treatmentData).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Treatment Created', life: 3000 });
        this.items.push(response);
        this.itemDialog = false;
        this.treatmentForm.reset();
        this.submitted = false;
      },
      (error:any) => {
        console.error('Error creating treatment:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create treatment', life: 3000 });
      }
    );
  }

  
  editItem(item: Item) {
    this.selectedItem = {...item};
    this.itemDialog = true;
  }
  
  editCategory(category: Category) {
    this.selectedCategory = {...category};
    this.categoryDialog = true;
  }
  
  deleteItem(item: Item) {
    this.deleteItemDialog = true;
    this.selectedItem = {...item};
  }
  
  deleteCategory(category: Category) {
    this.deleteCategoryDialog = true;
    this.selectedCategory = {...category};
  }
  
  confirmDeleteItem() {
    this.items = this.items.filter(val => val._id !== this.selectedItem._id);
    
    // Also remove from category items if applicable
    if (this.selectedItem.categoryId) {
      const category = this.categories.find(c => c._id === this.selectedItem.categoryId);
      if (category && category.items) {
        category.items = category.items.filter(item => item._id !== this.selectedItem._id);
      }
    }
    
    this.deleteItemDialog = false;
    this.selectedItem = {} as Item;
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item Deleted', life: 3000});
  }
  
  confirmDeleteCategory() {
    this.categories = this.categories.filter(val => val._id !== this.selectedCategory._id);
    this.deleteCategoryDialog = false;
    this.selectedCategory = {} as Category;
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Category Deleted', life: 3000});
  }
  
  hideDialog() {
    this.itemDialog = false;
    this.categoryDialog = false;
    this.submitted = false;
  }
  
  saveItem() {
    this.submitted = true;
    
    if (this.selectedItem.title.trim()) {
      if (this.selectedItem._id) {
        // Update existing item
        const index = this.findIndexById(this.selectedItem._id, this.items);
        if (index !== -1) {
          this.items[index] = this.selectedItem;
          
          // Update in category items if applicable
          if (this.selectedItem.categoryId) {
            const category = this.categories.find(c => c._id === this.selectedItem.categoryId);
            if (category && category.items) {
              const catItemIndex = this.findIndexById(this.selectedItem._id, category.items);
              if (catItemIndex !== -1) {
                category.items[catItemIndex] = this.selectedItem;
              } else {
                category.items.push(this.selectedItem);
              }
            }
          }
          
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item Updated', life: 3000});
        }
      } else {
        // Create new item
        this.selectedItem._id = this.generateId();
        this.items.push(this.selectedItem);
        
        // Add to category items if applicable
        if (this.selectedItem.categoryId) {
          const category = this.categories.find(c => c._id === this.selectedItem.categoryId);
          if (category) {
            if (!category.items) category.items = [];
            category.items.push(this.selectedItem);
          }
        }
        
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item Created', life: 3000});
      }
      
      this.items = [...this.items];
      this.itemDialog = false;
      this.selectedItem = {} as Item;
    }
  }

  onGlobalFilter(event: Event, dataTable: any) {
    const input = event.target as HTMLInputElement;
    dataTable.filterGlobal(input.value, 'contains');
  }
  
  saveCategory() {
    this.submitted = true;
    
    if (this.selectedCategory.title.trim()) {
      if (this.selectedCategory._id) {
        // Update existing category
        const index = this.findIndexById(this.selectedCategory._id, this.categories);
        if (index !== -1) {
          this.categories[index] = this.selectedCategory;
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Category Updated', life: 3000});
        }
      } else {
        // Create new category
        this.selectedCategory._id = this.generateId();
        this.selectedCategory.items = [];
        this.categories.push(this.selectedCategory);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Category Created', life: 3000});
      }
      
      this.categories = [...this.categories];
      this.categoryDialog = false;
      this.selectedCategory = {} as Category;
    }
  }
  
  findIndexById(id: string, array: any[]): number {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  
  generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getFilteredItems(type: string): Item[] {
    return this.items.filter(item => item.type === type);
  }

  getHighlightsArray(highlights: string): string[] {
    return highlights ? highlights.split('\n').map(h => h.trim()).filter(h => h) : [];
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
}