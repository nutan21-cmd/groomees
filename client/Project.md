## Problem Statement
We have many book stores in a city who want to sell or rent their books through online website, in order to increase their customer base. According to the current scenario of buying or renting a book from a book store, the customers have to physically visit the store. There might be many scenarios where a book is not available in one store however it is available in a different nearby store. The customers should hence have an option to check the availability of a book in his nearby book stores and compare prices with other stores see reviews and ratings. Customers should also have an option to rent or buy a book online rather than physically visiting the store.  

The readers of a book should also be allowed to share their ratings and reviews with other readers. Similarly they should also have an option of being notified if a new book is available in their favorite stores.

## Proposed solution
Our proposed solution allows a customer to order or rent a book online rather than going to the store. At any point of time, a customer can check whether a given book is available in a book store or not. If the book is available then he can place an order either to buy the book or to rent it out.
 
Once a user/critic has bought/rented a book and he has finished reading it then he can post review and rating for it. All the user/critic reviews and ratings of a book will be visible to other customer so as to help them with their decision while buying a book.

Similarly the book store owners can notify the store followers if a new book is available in the store. The customers can follow Users and stores to get the regular updates from them. Whenever the user/critic posts reviews/ratings all his followers will get updated.

## Potential domain objects
* Book
* Bookshelf
* Book Store
* Customer
* Coupon
* Orders/Rentals

## Potential human users
* General readers
* Critics
* Author
* Book Store owner

## Goals the user could accomplish

 **General customer**
1. Buy books from the bookstore
2. Rent Books
3. Return Books 
4. add books to shopping cart
5. Create a Bookshelf of (READING|READ|WANTS TO READ)
6. Apply coupons to buy a book
7. follow other users
8. share updates
9. post ratings
10. post reviews
11. CRUD their addresses
12. CRUD their phones

 **Critics**
1. everything a general customer can do.
2. post **critics** ratings
3. post **critics** reviews

 **Book Store owner**
1. add books to their bookstore
2. update quantity/delete book from inventory
3. posts status of books added for followers of the store
4. update prices of books

 **Author**
1. post status of books published for their followers.
2. Add a new book.
3. CRUD their addresses

## Relations with other users
* Reader follows other readers for their status.
* Readers follows authors
* Readers follows/store owners
* Author follows other authors
* Author follows store owners
* general readers are customers
* critics are also customers who write critics reviews/ratings

## Relations between human to domain objects

* Customer adds Books to their shopping cart
* Customer posts reviews/ratings
* Customer can add books to their bookshelves (READING|READ|WANTS TO READ)

* Critics posts critics ratings/reviews.
* critics adds books to their shopping cart.
* Critics manages followers

* Author writes books 
* Author posts reviews/ratings
* Author manages followers
## Relations domain to domain objects
* Book store has Book inventories and owner.
* Book inventories has Books and customer
* Book have author
* Rental has books, book store and customer
* Bookshelf have books and customer.
* shopping cart has orders and coupon.
* Order has Bookstore, books and customer.
* Rental has Book
* person has phone and addresses
* author, bookstore owner, customer are person
* general readers and critics are customers.

## WEB API
STEP1: we are using google books api for fetching books details
[api example link](http://googleapis.com/books/v1/volumes?q=subject:history&startIndex=40)
we have created a script to scrape all the books data by genre (there are 33 genres and 400 books in each genre).
Books have data like 
`{title, language,genre, author, published date, description,pages}`.
We are using NO-SQL database which allows json formatted data to be inserted easily

STEP 2: The person data like `(name,email,date of birth, address and phone numbers)` is available over
[User data generator](https://www.generatedata.com)

STEP 3: We will store all the above data Over AWS in **Mongodb** database.

STEP 4: We will also add all the other collections like `(Orders, Bookshelf,Shopping cart, Rentals, Ratings & Reviews, Coupon)` which are required for the application.

STEP 5: We will use AWS to create an api endpoint for this database using **MongoClient** in JAVA.

STEP 6: Our website backend code will now consume this API for all the CRUD operations like for example.

SEARCH: aws.amazonxyz/api/bookstore/{storeId}/Books?category=History&orderBy=publishedDate&price>4&price<12








