All sequence Diagrams and the class diagram are present in this folder with respective folder name(the link can only be accessed with northeastern email ID):
[Open Class Diagram and Sequence Diagram](https://drive.google.com/open?id=1ObKYSSQceU6AiyzEeXErTTD8O0PK0BCY)



Our Class diagrams has following users in it:
1. Author
2. Book Store Owner
3. General Reader 
4. Critics

* **Author, Book store owner and customer** have a **"is a"** relationship with **"Person"**. 
"**General Reader**" and "**Critics**" also have a "**is a**" relationship with "**Customer**". 

* There is **self reference** for **"followers"** attribute in **"Person"** as the followers will be different persons of the same "Person" type object. 

* Every person has **"Phone"** and **"Address"**, the corresponding "Phone" and "address" cannot exist without their respective **"Person"**, hence a **"composition"** relationship exists between them. Also one person can have many addresses and phones, hence there is a **"one to many"** relationship between both **"Person to Phone"** and **"Person to address"**. Also Phone and address have a "isPrimary" boolean flag to let the system know of their primary phone and address.

* There are two types of "Coupon" objects, "Amount off" and "Percent off" respectively. Hence there exists a **"is a"** relationship between **"Amount off and Coupon"** and also between **"Percent off and Coupon"**. 

* One customer can have only one "shopping cart" assigned. Hence there exists **"one to one"** mapping between **"customer and Shopping cart"**.

* Only one coupon can be applied to a shopping cart, hence **"one to one"** relationship between **"coupon and shopping cart".**

* There can exists many "order" in a "shopping cart", hence there is a **"one to many"** mapping between **"shopping cart and order"**. Also an "order" cannot exist without being part of a "shopping cart", hence there is a **"composition"** relationship between **"order and shopping cart"**.

* One "order" stores the "book" id and its corresponding quantity that has to be placed. It also stores the "Book store Id" to keep reference of the book store from which this order is being placed. 

* There is a **"one to many"** relationship between **"Book store and order"**, as one book store can receive multiple orders. Also there is a **composition** relationship between the two as a order cannot exist without its book store.

* There exists **"one to many"** relationship between **"book" and "order"**, as a book can be part of various orders. However one order can only have one book of that type in it. If there are multiple books of same book then corresponding quantity for it in order will be increased. Also there is **composition** relationship between the two, as an order cannot exist without a book in it.

* There is similar design pattern for "rental" as that of "order". 

* There is **"one to one"** relationship between **"book store owner"** and **"book store"** as one owner can only own a single book store, similarly a "store" can be owned by a single owner only.

* A book store will have many book inventories for corresponding books. Hence there is a **"one to many"** relationship between **"Book Inventory"** and **"Book Store"**. Also a "Book Inventory" cannot exist without belonging to a "Book Store", hence there is a **composition** relationship between the two.

* A **"book inventory"** stores the reference to the corresponding **"book"** and the **"Book Store"** to which it belongs. One "book inventory" can have many different "books" in it, also a "book" can belong to many "Book inventory". Hence there is a **many to many** relationship between the two.

* A "customer" will have three different kinds of "book shelf" - 1. Wants to read, 2. Bought/Read, 3. Reading, 4. Read. These bookshelves store the reference to the "book" which the "customer" is currently dealing with. Once the customer has read a book, he can also provide rating and reviews which is referenced in the "Rating and Reviews" with the help of "Bookshelf". 

* There exists **"one to many"** relationship between **"customer"** and **"Bookshelf"**, as a customer can have many bookshelf, however a bookshelf belongs to only one customer. Also there exists a "**composition**" relationship between "customer" and "Bookshelf", as a bookshelf cannot exist without being associated with a customer. 

* There exists "**one to many**" relationship between "**books and Bookshelf**", as a bookshelf will have a single reference of a unique book in it, however a book can be associated with many different bookshelves. Also there exists a "**composition**" relationship between "bookshelf" and "book", as a "bookshelf" cannot exist without having any books in it. 

* There exists **"one to one"** relationship between "**Bookshelf**" and **"rating and reviews"** as a customer can only provide a single review and rating for a book. It can only be provided for books that are present in the "read" bookshelf of the customer. 

* The "**enumeration**" "**Book Shelf Status**" stores the status of the "books" in that bookshelf for the respective customer. 
 

