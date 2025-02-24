# Important Note while testing:

Youtube URL: https://www.youtube.com/playlist?list=PLrUCXMz2zUCY9VJp1-wlyLEHSnqTe3FHy

### While logging into the system, the user has to provide his EMAIL rather than his USERNAME. Please refer the following logging credentials:

<table>
<tr>
<th>USERNAME</th>
<th>USER TYPE</th>
<th>EMAIL</th>
<th>PASSWORD</th>
</tr>
<tr>
<td>ADMIN</td>
<td>Admin</td>
<td>admin@admin.com</td>
<td>admin</td>
</tr>
<tr>
<td>alice</td>
<td>Reader</td>
<td>alice@wonder.com</td>
<td>alice</td>
</tr>
<tr>
<td>bob</td>
<td>Owner</td>
<td>bob@marley.com</td>
<td>bob</td>
</tr>
<tr>
<td>charlie</td>
<td>Critic</td>
<td>chuch@garcia.com</td>
<td>charlie</td>
</tr>
<tr>
<td>dan</td>
<td>Author</td>
<td>dan@martin.com</td>
<td>dan</td>
</tr>
</table> 

<hr>

# How to test - "User related to another user"

## User follows another user:
#### Description:
A user has the privilege of following other users. In case a user has followed some other user, then all the activity details of those other user whom the current user has decided to follow will be displayed in the user's own feed. Activity details includes liking a book, providing rating and review of a book, buying a new book etc.

#### Steps to test:  
<ol>
<li> login to the system by providing your valid credentials, lets say "Charles" has logged in</li>
<li> Go to "Users" tab displayed in the navigation bar</li>
<li> Search the user you want to follow, lets say i want to follow "Alice" </li>
<li> After searching for the required user, go to users profile by clicking on his name, i.e, click on "Alice" </li>
<li> On top of the user profile page, "Follow" button is displayed, just click on the "Follow" button </li>
<li> Logout from "Charles" profile and now login with the credentials of "Alice" </li>
<li> Once "Alice" is logged in, on the "books" homepage, open any book by clicking on the book name and following the link, scroll down and change the "Status" of that book to "read" and provide a "rating" and "review" to that book, then save the changes by clicking "Save to my Bookshelf".</li>
<li> Logout from Alice's profile and Login back from "Charles" profile. </li>
<li> After logging in, goto "Feeds" page by clicking on "Feeds" in the navigation bar. </li>
<li> You should be able to see the activity stating the details such as: 
     
     Dec 9, 2019 10:52 AM : Alice Wonder READ A Boy Named Koko and Rated it 8/10 as well as Reviewed it: A very 
     pleasant read !
</li>
</ol>

# How to test - "Search books from a list of books"

## User searches books from a list of books using filters such as "Title", "Author" & "Store":
#### Description:
Any user or guest has the privilege to search books from the entire books that are available across all the bookstores using search filters such as "book title", "book author" and "store name or zip". The matched results will be displayed dynamically as the user types in the search details. 

#### Steps to test:  
<ol>
<li> Open the default home page of the website i.e, the "Books" page in the navigation bar.</li>
<li> You should be able to see the list of books available across all the bookstores, with the total count of books displayed on the top.</li>
<li> Enter the search criteria, i.e, provide "book title" or "book author" or "Store name" or any combinations of these. </li>
<li> As the user will type in the search criteria, the book list displayed below will get modified, with only the books matching the search criteria being included in the displayed result. </li>
</ol>

# How to test - "View details of a book from the search result of a list of books"

## User views the details of a book 
#### Description:
A user can view the details of a book from the search result by clicking on the book name. On doing so, the user will be redirected to a page having all the details of that book such as book description, book author, book rating etc.The user must be logged in to the system to view the book details, in case he isn't logged in he will be redirected to the login page first, requesting him to login first before redirecting him back to the book details page.

#### Steps to test:  
<ol>
<li> login to the system by providing your valid credentials, lets say "Charles" has logged in</li>
<li> Open the default home page of the website i.e, the "Books" page in the navigation bar.</li>
<li> You should be able to see the list of books available across all the bookstores, with the total count of books displayed on the top.</li>
<li> Enter the search criteria, i.e, provide "book title" or "book author" or "Store name" or any combinations of these. </li>
<li> As the user will type in the search criteria, the book list displayed below will get modified, with only the books matching the search criteria being included in the displayed result. </li>
<li>In order to view the details of any book, just click on the book name and you will be redirected to a page having all the details of that book such as book description, book author, book rating etc. </li>
</ol>


# How to test - "User views all the books added to his cart and then views orders/rentals placed by the user"

## User views cart details and orders/rentals details
#### Description:
A user can view the details about all the books that has been added to his/her cart from the "Cart" tab in the navigation bar. Once the user has placed the order from the cart, then the details about the orders/rentals can be viewed from the "Orders" and "Rentals" tab in the navigation bar. Please note that only the user type "readers" have the privilege and access to "cart", "orders" & "rentals".

#### Steps to test:  
<ol>
<li> Login to the system by providing your valid credentials, lets say "Alice" has logged in. Please note that user type should be "readers" for the next steps to be performed. "Alice" is defined as "readers" type of user in the system.</li>
<li> Open the default home page of the website i.e, the "Books" page in the navigation bar.</li>
<li> You should be able to see the list of books available across all the bookstores, with the total count of books displayed on the top.</li>
<li> Click on any book that you want to buy. You will be redirected to the book details page.</li>
<li> On the book details page for that book, you should be able to see the "Add to Cart" and "Rent" button. </li>
<li> Click on "Add to order" or "Rent" button, whichever operation you want to perform. </li>
<li> [Optional] Repeat the above steps of adding a book to cart for few other books in order to have multiple books in cart. </li>
<li> Click on the "Cart" in the navigation bar to view all the orders that have been added to cart. </li>
<li> Click on "Place order" button to place the orders/rentals displayed on the page. </li>
<li> Once the user has placed orders, he can view the orders/rentals that he has placed in the "Orders" and "Rentals" tab respectively, present in the navigation bar.</li>
</ol>


# How to test - "User views all other users related to him"

## User views all of his followers and all other users which he himself is following
#### Description:
A user can view the list of all other users which he himself is following as well as the list of users who are following him. 

#### Steps to test:  
<ol>
<li> Login to the system by providing your valid credentials, lets say "Alice" has logged in.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> Click on the "Followers" filter button present on the left hand side to fetch all the followers of the current user. </li>
<li> Click on the "Following" filter button present on the left hand side to fetch all the users whom the current user is following. </li>
</ol>


# How to test - "User views all other users related to him"

## User views all of his followers and all other users which he himself is following
#### Description:
A user can view the list of all other users which he himself is following as well as the list of users who are following him. 

#### Steps to test:  
<ol>
<li> Login to the system by providing your valid credentials, lets say "Alice" has logged in.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> Click on the "Followers" filter button present on the left hand side to fetch all the followers of the current user. </li>
<li> Click on the "Following" filter button present on the left hand side to fetch all the users whom the current user is following. </li>
</ol>

# How to test - "User related to domain object"

## User can add books to his wishlist 
#### Description:
A user can add books to his wishlist by marking the book as "Wants to read". The user must be of type "reader" or "critic" to perform this operation.

#### Steps to test:  
<ol>
<li> Login to the system by providing your valid credentials, lets say "Dan" has logged in. Please note that the user type should be "reader" or "critic" to perform this operation.</li>
<li> Browse to the "Books" page, by clicking on the "Books" tab in the navigation bar.</li>
<li> Open the book details page by clicking on the name of any book. </li>
<li> Scroll down the book detail page to the "Status" of the book, and set the status as "WANTS TO READ". </li>
<li> In the navigation bar select the tab "My Wish List". User should be able to see the book marked above here in his wishlist page. </li>
</ol>


# How to test - "A domain object related to other domain object"

## The domain object Book can be added to the other domain object Book Store 
#### Description:
A user of type "book owner" can add books to his book store inventory. The user must be of type "owner" to perform this operation.

#### Steps to test:  
<ol>
<li> Login to the system by providing your valid credentials, lets say "Bob" has logged in. Please note that the user type should be "owner" to perform this operation.</li>
<li> Browse to the "Published-Books" page, by clicking on the "Published-Books" tab in the navigation bar.</li>
<li> All the published books present in the entire book database can now be viewed on this page</li>
<li> Search for the book that you want to add to your bookstore using the search filters present on the page. </li>
<li> Click on the book name to go to the book details page. </li>
<li> Scroll down to enter "Store", "Quantity" and "Price" of that book. </li>
<li> Once you have entered the details, click on "Save" button. </li>
<li> Now browse to the "My Store" page by clicking on the "My Store" tab in the navigation bar. </li>
<li> Scroll down to the bottom of the list to see the newly added book in the book store. </li>
</ol>

# How to test - "Admin creates a user"

## Admin adds a new user to the system
#### Description:
Admin has the privilege to perform CRUD operations on all types of user i.e, he can add/remove/read/update other "admins", "readers", "author", "owner" and "critics" user types.

#### Steps to test:  
<ol>
<li> Login to the system by providing valid admin credentials, lets say "admin" has logged in. Please note that the user type should be "admin" to perform this operation.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> All the existing users present in the database can be viewed on this page</li>
<li> Click on the "New User" button. </li>
<li> Enter all the user details on the user form. </li>
<li> Click on "Save" button </li>
<li> You will be redirected back to the users page, displaying the list of existing users. </li>
<li> Type the name of the new user added, in the search bar, to confirm that the user has been added. </li>
</ol>


# How to test - "Admin lists all the users"

## Admin can view all the users present in the system
#### Description:
Admin has the privilege to perform CRUD operations on all types of user i.e, he can add/remove/read/update other "admins", "readers", "author", "owner" and "critics" user types.

#### Steps to test:  
<ol>
<li> Login to the system by providing valid admin credentials, lets say "admin" has logged in. Please note that the user type should be "admin" to perform this operation.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> All the existing users present in the database can be viewed on this page</li>
<li> Admin can search for any particular user from the list, using both the "user-type" filter present on the left side or by typing the user name in the search bar.
</ol>


# How to test - "Admin edits/updates a particular user"

## Admin can edit/update all the users present in the system
#### Description:
Admin has the privilege to perform CRUD operations on all types of user i.e, he can add/remove/read/update other "admins", "readers", "author", "owner" and "critics" user types.

#### Steps to test:  
<ol>
<li> Login to the system by providing valid admin credentials, lets say "admin" has logged in. Please note that the user type should be "admin" to perform this operation.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> All the existing users present in the database can be viewed on this page</li>
<li> Admin can search for any particular user from the list, using both the "user-type" filter present on the left side or by typing the user name in the search bar.</li>
<li> Select the user which the admin has to edit/update by clicking on his name. </li>
<li> Edit the user details by providing the new details such as address and phone number, then click on "Save" to save the changes. </li>
<li> You will be redirected back to the "users" page having the details of all the users. </li>
<li> Search for the user whom you just modified and again click and open the user details to verify that the changes have been saved. </li>
</ol>


# How to test - "Admin removes a particular user"

## Admin can remove any user present in the system
#### Description:
Admin has the privilege to perform CRUD operations on all types of user i.e, he can add/remove/read/update other "admins", "readers", "author", "owner" and "critics" user types.

#### Steps to test:  
<ol>
<li> Login to the system by providing valid admin credentials, lets say "admin" has logged in. Please note that the user type should be "admin" to perform this operation.</li>
<li> Browse to the "Users" page, by clicking on the "Users" tab in the navigation bar.</li>
<li> All the existing users present in the database can be viewed on this page</li>
<li> Admin can search for any particular user from the list, using both the "user-type" filter present on the left side or by typing the user name in the search bar.</li>
<li> Select the user which the admin has to remove by clicking on his name. </li>
<li> On the user details page, click on the "delete user" button displayed on the top to delete this user from the system. </li>
<li> You will be redirected back to the "users" page having the details of all the users. </li>
<li> Search for the user whom you just deleted in the search bar and verify the user doesn't exist any more in the system. </li>
</ol>
