# vue-crud-tables
Smart Vue table component with crud funcionality

## Uses

``` bash
    npm install vue-tables
```

```javascript
    import VueTables from 'vue-tables'
    
    Vue.use(VueTables);
```
```html
     <vue-table :columns="my-columns" :data="my-data" :options="table-options"></vue-table>
```

## Documentation

### vue-crud-tables props

#### :columns (type: Array) 

| Option        | Type    | Values(default)           | Description  |
| ------------- |---------|---------------------------| -------------|
| **name**          | String  |(empty string)             | Name of column. It must be the same as the corresponding attribute name i data props  |
| **label**         | String  |(empty string)             | Column label in table header |
| **type**          | String  |text(default), select           | Type of table cell|
| **require**       | Boolean |true(default), false               | If cell is required before save|
| **filtrable**       | Boolean |true, false(default)              | If column is filtrable|
| **sortable**       | Boolean |true, false(default)               | If column is sortable|
| **editable**       | Boolean |true, false(default)               | If column is editable|
| **data**       | Array |[{id: Number,label: String}] (empty array) | Array of options to select in editable mode|

#### Example

```javascript
    var columns = [
        {
          name: 'firstName',
          label: 'First name',
          type: 'text',
          require: true,
          filtrable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'lastName',
          label: 'Last name',
          type: 'text',
          require: true,
          filtrable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'city',
          label: 'City',
          type: 'select',
          data: [
            {
              id: 1,
              label: 'Warsaw'
            },{
              id: 2,
              label: 'New York'
            },{
              id: 3,
              label: 'Moscow'
            }
          ],
          require: true,
          filtrable: true,
          sortable: true,
          editable: true
        }
    ]
```
#### :data (type: Array) 
Array of data objects. Object attributes must be the same as names attributes in columns.


#### :options (type: Object) 


| Option        | Type    | Values(default)           | Description  |
| ------------- |---------|---------------------------| -------------|
| **tableName**          | String  |"table"(default)             | Name of table|
| **style**          | String  |"bootstrap"(default)          | Choose default style of table |
| **classes**       | String |"table"(default) | class attribute in table tag|
| **url**       | String |null(default) |Url it is address of endpoint for table data. It can also be an address to the CRUD operations  API implemented same like below example:<br> ```Fetch table data  GET     /post``` <br>  ```Add new row       POST    /posts``` <br>``` Edit Row        PUT     /posts/1```<br>``` Delete row        DELETE  /posts/1``` |
| **editMode**       | String |"row"(default), "modal"           | Choose method of editing row, "modal" option is aviable only for "bootstrap" style |
| **editButtonTmp**       | String |``` <a href="#">edit</a> ```  (default)            | Edit button template|
| **deleteButtonTmp**       | String |``` <a href="#">delete</a>```  (default)               | Delete button template|
| **cancelButtonTmp**       | String |``` <a href="#">cancel</a> ```  (default)               | Cancel button template|
| **saveButtonTmp**       | String |``` <a href="#">save</a> ```  (default)               | Save button template|
| **customActionTmp**       | String |(empty string)                   | Custom buttons template|
| **buttonsFloat**       | String |"left"(default), "right" |Location of action buttons in table |
| **deleteFn**       | Function |(default  function) | Default delete method|
| **saveFn**       | Function |(default  function) | Default save method|
| **deleteCallbackFn**       | Function |(default callback function) | Default delete callback method|
| **saveCallBackFn**        | Function |(default callback function) | Default save callback method|

#### Example

```javascript
 var options = {       
        classes: 'table',
        tableName: 'my-table',
        editMode: 'row',  
        url: 'https://jsonplaceholder.typicode.com/posts',             
        customActionTmp: '', 
        buttonsFloat: 'left'
  }
```

### Extra functions

| Function        | Parameters(Type)    |   Description  | Example |
| ------------- |--------- |-------------|------------- |
| **addRow**         | tableName(String)  |Adding new row to table           | ```this.$VueTable.addRow('my-table'); ``` |








