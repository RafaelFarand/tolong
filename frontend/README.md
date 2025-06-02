 API Documentation

 User API

Register
URL: /register
Method: POST
Body:

{
  "username": "string",
  "email": "string",
  "password": "string"
}

 Login
URL: /login
Method: POST
Body:
{
  "email": "string",
  "password": "string"
}

Get User by ID
URL: /:id
Method: GET
Headers: Authorization: Bearer <token>
Params: id - User ID

 Update User
URL: /:id
Method: PUT
Headers: Authorization: Bearer <token>
Params: id - User ID
Body: Updated user fields

Delete User
URL: /:id
Method: DELETE
Headers: Authorization: Bearer <token>
Params: id - User ID

 Auth Token API

Refresh Token
URL: /token
Method: POST
{
  "refreshToken": "string"
}

Logout
URL: /logout
Method: POST
Body:
{
  "refreshToken": "string"
}

Order API
All routes below require Authorization: Bearer <token>

Get All Orders
URL: /
Method: GET

Get Order by ID
URL: /:id
Method: GET

Create Order
URL: /
Method: POST
Body: Order data

Update Order
URL: /:id
Method: PUT
Params: id - Order ID
Body: Updated order data

Delete Order
URL: /:id
Method: DELETE
Params: id - Order ID

Get Orders by User ID
URL: /user/:userId
Method: GET
Params: userId - User ID

Checkout All Orders
URL: /checkout
Method: PUT

Checkout Specific Order
URL: /checkout/:id
Method: PUT
Params: id - Order ID

Get Checked-out Orders by User
URL: /user/:userId/checkedout

Method: GET
Params: userId - User ID

Product API

Get All Products
URL: /
Method: GET

Get Product by ID
URL: /:id
Method: GET
Params: id - Product ID

Add New Product
URL: /
Method: POST
Headers: Authorization: Bearer <token>
Form-data:
name: Nama produk
price: Harga
description: Deskripsi
image: Gambar (file)

Update Product
URL: /:id
Method: PUT
Headers: Authorization: Bearer <token>
Params: id - Product ID
Form-data: Field produk + file image opsional

Delete Product
URL: /:id
Method: DELETE
Headers: Authorization: Bearer <token>
Params: id - Product ID