The User management CURD -> The frontend created in React and backend created in Laravel
PHP version = "^8.2"
Laravel version = "^12.0"
React version = "^19.1.0"

--------------Laravel Backend -------------------------------
1) Download the laravel folder and run -> composer install 
2) composer install will install vendot folder or packages
3) After install please run -> php artisan serve 


Below is the Api route and payload
----------------------------------------

1)  http://127.0.0.1:8000/api/employees

2) POST http://127.0.0.1:8000/api//employees

payload - 
{
    "full_name" : "Pooja Lavhat",
    "mobile": "9976455555",
    "dob": "09/07/1990",
    "gender":"female",
    "address":[
                {
                    "address_type": "home",
                    "door_street": "1st Main Rd,Rajiv Nagar",
                    "landmark": "Zxy building",
                    "city": "chennai",
                     "state": "tamilnadu",
                     "country": "India",
                    "primary": "No",
                        "created_at": null,
                        "updated_at": null,
                        "deleted_at": null
                    },
                    {
                        "address_type": "office",
                        "door_street": "west cross Rd, chinmayi Nagar",
                        "landmark": "white cross building",
                        "city": "Brooklyn",
                        "state": "Newyork",
                        "country": "USA",
                        "primary": "No",
                        "created_at": null,
                        "updated_at": null,
                        "deleted_at": null
                    }
                ]
}

3) GET http://127.0.0.1:8000/api/employees/1

4) PUT http://127.0.0.1:8000/api/employees/1
    {
        "status_code": 200,
        "message": "User updated successfully",
        "data": {
            "id": 4,
            "full_name": "Harshali Omkar Mhatre",
            "mobile": "9976455555",
            "dob": "09/07/1990",
            "gender": "Female",
            "created_at": "2025-05-22T04:04:00.000000Z",
            "updated_at": "2025-05-23T04:36:25.000000Z",
            "address": [
                {
                    "id": 3,
                    "employee_id": 4,
                    "address_type": "home",
                    "door_street": "Vichumbe",
                    "landmark": "Green valley building",
                    "city": "mumbai",
                    "state": "maharshtra",
                    "country": "India",
                    "primary": "No",
                    "created_at": "2025-05-22T04:04:00.000000Z",
                    "updated_at": "2025-05-22T05:23:40.000000Z",
                    "deleted_at": null
                },
                {
                    "id": 4,
                    "employee_id": 4,
                    "address_type": "office",
                    "door_street": "Bhagatwadi",
                    "landmark": "sukapur cross building",
                    "city": "Brooklyn",
                    "state": "Newyork",
                    "country": "USA",
                    "primary": "No",
                    "created_at": "2025-05-22T04:04:00.000000Z",
                    "updated_at": "2025-05-22T05:24:42.000000Z",
                    "deleted_at": null
                }
            ]
        }
    }


5) DELETE  - http://127.0.0.1:8000/api/employees/1
6) Bulk Delete - http://127.0.0.1:8000/api/bulk-delete -   payload - {"ids": [6, 11]}


----------------React Frontend---------------------------
1) Download react folder and run the command -> npm install
2) npm install will install node_modules
3) After install run -> npm run dev 




For run unit test use follwing command
-----------------------------------------
php artisan test --filter=EmployeeControllerTest


