import axios from 'axios'
const VueTable = {
    install(Vue, options) {
        var that = this;
        Vue.tableComponents = {};
        Vue.prototype.$VueTable = {
            editRow: null,
            addRow: function(tableName) {
                Vue.tableComponents[tableName].addRow()
            },
            options: null
        };
        var modalEditBootstrap = {
            template: `<div><div :class="'modal fade '+show" v-if="edit" tabindex="-1" role="dialog" style="display:block">
                        
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title">{{title}}</h5>
                            <button type="button" class="close" aria-label="Close" v-on:click="closeModal">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                           <form>
                              <div class="form-group" v-for="column in columns" v-if="column.editable">
                                 <label :for="column.name">{{column.label}}</label>
                                 <input type="text" class="form-control" :ref="column.name" :name="column.name"  :placeholder="column.label" :value="row[column.name]" v-if="column.type == 'text'" >
                                 <select class="form-control" :ref="column.name" :name="column.name"  v-if="column.type == 'select'">
                                    <option v-for="option in column.data" :value="option.id" :selected="option.label == row[column.name] || option.id == row[column.name]">{{option.label}}</option>                                 
                                </select>
                              </div>                              
                              </form>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-primary" v-on:click="saveModal">Save changes</button>
                            <button type="button" class="btn btn-secondary" v-on:click="closeModal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="edit" :class="'modal-backdrop fade '+show"></div></div>`,
            props: ['row', 'columns', 'edit', 'title', 'options'],
            computed: {
                show: function() {
                    if (this.edit) {
                        return 'show'
                    } else {
                        return ''
                    }
                }
            },
            methods: {
                closeModal: function() {
                    this.$parent.edit = false;
                },
                updateValue: function(name) {
                    this.$parent.row[name] = this.$refs[name][0].value
                },
                saveModal: function() {
                    for (var ref in this.$refs) {
                            this.$parent.row[ref] = this.$refs[ref][0].value
                        }
                    this.$parent.save(this.$parent.row);
                    
                    this.$parent.edit = false;
                    this.$VueTable.editRow = null;
                }
            }
        }
        var textCell = {
            template: `<div class="cell">
                        <input type="text"  :name="name" v-model="currentValue"  v-if="editMode" @input="updateValue"/>
                        <span v-if="!editMode">
                            {{value}}
                        </span>
                    </div>`,
            props: ['value', 'edit', 'name', 'options'],
            data: function() {
                return {
                    currentValue: this.value
                }
            },
            computed: {
                editMode: function() {
                    return this.edit && this.options.editMode === 'row'
                }
            },
            methods: {
                updateValue: function() {
                    this.$parent.row[this.name] = this.currentValue
                }
            }
        }
        var selectCell = {
            template: `<div class="cell">
                        <select :name="name" v-if="editMode" v-model="currentValue" @change="updateValue">
                            <option v-for="option in data" :value="option.id">{{option.label}}</option>
                        </select>                       
                        <span v-if="!editMode" v-for="option in data">
                            <span v-if="option.id == value">
                                {{option.label}}
                            </span>
                        </span>
                    </div>`,
            props: ['value', 'edit', 'name', 'data', 'options'],
            data: function() {
                return {
                    currentValue: this.value,
                }
            },
            computed: {
                editMode: function() {
                    return this.edit && this.options.editMode === 'row'
                }
            },
            methods: {
                updateValue: function() {
                    this.$parent.row[this.name] = this.currentValue
                }
            }
        }
        var row = {
            template: `<tr>
                        <td v-if="options.buttonsFloat == 'left' ">
                            <div class="edit-button" style="display: inline-block; " v-html="options.editButtonTmp" v-on:click="editRow(row)" v-if="!editMode">                                             
                            </div>
                            <div class="delete-button" style="display: inline-block;" v-html="options.deleteButtonTmp" v-on:click="deleteRow(row)" v-if="!editMode">                                
                            </div>
                            <div class="custom-button" style="display: inline-block;" v-html="options.customActionTmp" v-if="!editMode">
                            </div>                          
                            <div class="save-button" style="display: inline-block;" v-html="options.saveButtonTmp" v-on:click="save(row)" v-if="editMode">                              
                            </div>
                            <div class="cancel-button" style="display: inline-block;" v-html="options.cancelButtonTmp" v-on:click="cancelEdit" v-if="editMode">                             
                            </div>
                            <modal-bootstrap :options="options" v-if="options.style === 'bootstrap'" :row="row" :columns="columns" :edit="edit && options.editMode === 'modal'" title="Edit"></modal-bootstrap>
                            
                            
                         </td>
                         <td v-for="column in columns">
                            <text-cell :edit="edit && column.editable" :value="row[column.name]" :name="column.name" v-if="column.type =='text'" :options="options"></text-cell>                                             
                            <select-cell :edit="edit && column.editable" :value="row[column.name]" :name="column.name" :data="column.data" v-if="column.type =='select'" :options="options"></select-cell>                                           
                         </td>
                         <td v-if="options.buttonsFloat == 'right' ">
                            <a href="#" >edit</a>
                            <a href="#" >delete</a>
                         </td>
                   </tr>`,
            props: ['row', 'options', 'columns'],
            computed: {
                editMode: function() {
                    return this.edit && this.options.editMode === 'row'
                }
            },
            created: function() {
                if (this.row.isNew) {
                    this.edit = true;
                }
            },
            components: {
                'text-cell': textCell,
                'select-cell': selectCell,
                'modal-bootstrap': modalEditBootstrap
            },
            data: function() {
                return {
                    edit: false
                }
            },
            methods: {
                editRow: function(row) {
                    this.$VueTable.editRow = row;
                    if (this.options.editMode === "row") {
                        this.edit = true;
                    } else if (this.options.editMode === "modal") {
                        if (this.options.style === 'bootstrap' || this.options.style === 'material') {
                            this.edit = false;
                            this.edit = true;                           
                            
                        } else {
                            console.warn("Modal edit mode is aviable only for option style 'bootstrap' or 'material'");
                        }
                    }
                },
                deleteRow: function(row) {
                    var that = this;
                    if (this.options.deleteFn == 'default') {
                       
                        if (this.options.deleteCallbackFn == 'default') {
                            if (this.options.url && !this.data) {
                                axios.delete(this.options.url + '/' + row[this.options.idAttribute], row).then(function(response) {                                    
                                    that.$parent.data.forEach(function(el, index) {
                                        if (el[that.options.idAttribute] === row[that.options.idAttribute]) {
                                            that.$parent.data.splice(index, 1);
                                        }
                                    })
                                  
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            } else {
                                console.warn("If you want delete with default method you must specific 'url' parameter in options!");
                                that.$parent.data.forEach(function(el, index) {
                                    if (el[that.options.idAttribute] === row[that.options.idAttribute]) {
                                        that.$parent.data.splice(index, 1);
                                    }
                                })
                            }
                        } else if (typeof this.options.deleteCallbackFn === 'function') {
                            this.options.deleteCallbackFn();
                        }
                    } else if (typeof this.options.deleteFn === 'function') {
                        this.options.deleteFn();
                    }
                    this.edit = false;
                    this.$VueTable.editRow = null;
                },
                cancelEdit: function() {
                    this.edit = false;
                    this.$VueTable.editRow = null;
                },
                save: function(row) {
                    if (this.options.saveFn == 'default') {
                       
                        if (row[this.options.idAttribute]) {
                           
                            if (this.options.url) {
                                axios.put(this.options.url + '/' + row[this.options.idAttribute], row).then(function(response) {
                                    
                                }).catch(function(error) {
                                    
                                });
                            } else {
                                console.warn("If you want save with default method you must specific 'url' parameter in options!");
                            }
                        } else {
                           
                            delete row.isNew;
                            if (this.options.url) {
                                axios.post(this.options.url, row).then(function(response) {
                                    
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            } else {
                                console.warn("If you want save with default method you must specific 'url' parameter in options!");
                            }
                        }
                        //this.edit = false;
                        if (this.options.saveCallBackFn == 'default') {} else if (typeof this.options.saveCallBackFn === 'function') {
                            this.options.saveCallBackFn();
                        }
                    } else if (typeof this.options.saveFn === 'function') {
                        this.options.saveFn();
                    }
                    this.edit = false;
                    this.$VueTable.editRow = null;
                },
            },
        }
       
        Vue.component('vue-table', {
            name: 'vue-table',
            components: {
                'row': row
            },
            template: `<table :class="optionsDefault.classes">
                    <thead>
                        <tr>
                            <th v-if="optionsDefault.buttonsFloat == 'left' " style="min-width: 120px;">
                            </th>
                            <th v-for="column in columns">
                                                            
                                <a href="javascript:void(0);" v-if="column.sortable" v-on:click="sortByColumn(column)">{{column.label}}</a>                         
                                <span v-if="!column.sortable">
                                    {{column.label}}
                                </span>
                            </th>
                            <th v-if="optionsDefault.buttonsFloat == 'right' "  style="min-width: 120px;">
                            </th>
                        </tr>
                        <tr v-if="showFilters">
                            <th v-if="optionsDefault.buttonsFloat == 'left' " style="min-width: 120px;">
                            </th>
                            <th v-for="column in columns">
                                <input v-if="column.filtrable" :ref="column.name" type="text" @input="filterData(column)"/>
                            </th>
                            <th v-if="optionsDefault.buttonsFloat == 'right' "  style="min-width: 120px;">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <row v-for="row in dataTable" :row="row" :columns="columns" :options="optionsDefault"></row>
                    </tbody>
                   </table>`,
            props: {
                columns: {
                    type: Array
                },
                data: {
                    type: Array,
                    default: null
                },
                url: {
                    type: String
                },
                options: {
                    type: Object
                }
            },
            computed: {
                showFilters: function() {   
                    var  tmp = false;               
                    this.columns.forEach(function(column){
                        if(column.filtrable){                           
                            tmp = true;
                        }
                    });

                    return tmp;
                }
            },
            data: function() {
                return {
                    text: 'This is table',
                    optionsDefault: {
                        tableName: 'table',
                        pagination: false,
                        style: 'bootstrap',
                        classes: 'table',
                        url: null,
                        editMode: 'row',
                        idAttribute: 'id',
                        editButtonTmp: '<a href="#">edit</a>',
                        deleteButtonTmp: '<a href="#">remove</a>',
                        cancelButtonTmp: '<a href="#">cancel</a>',
                        saveButtonTmp: '<a href="#">save</a>',
                        customActionTmp: '',
                        buttonsFloat: 'left',
                        deleteFn: 'default',
                        saveFn: 'default',
                        deleteCallbackFn: 'default',
                        saveCallBackFn: 'default'
                    },
                    dataTable: this.data,
                    backupData: this.data                    
                };
            },
            methods: {
                addRow: function() {                  
                    var new_row = {};                   
                    this.columns.forEach(function(column) {
                        new_row[column.name] = "";
                    })
                    new_row["isNew"] = true;
                    this.dataTable.push(new_row);
                },
                filterData: function() {                    
                    var that = this;                    
                    that.dataTable = that.backupData; 
                    this.columns.forEach(function(column){
                        that.dataTable = that.dataTable.filter(function(el){                            
                            if(column.type == 'select'){                                
                                var tmp = false;
                                column.data.forEach(function(data){                                                         
                                    if(el[column.name] == data.id &&  data.label.indexOf(that.$refs[column.name][0].value) !== -1 ){
                                        tmp = true
                                    }                                   
                                });
                                return tmp                                 
                            }                       
                            return el[column.name].indexOf(that.$refs[column.name][0].value) !== -1                         
                        });
                    })
                               
                },
                sortByColumn: function(column) {                    
                    if(column.sortAttr == "up"){  
                        if(column.type === 'select'){
                            this.dataTable.sort(compareSelectDown)
                        }else{
                            this.dataTable.sort(compareDown)
                        }                                   
                        
                        column.sortAttr = "down"
                    }else if(column.sortAttr == "down"){ 
                                        
                        this.dataTable = this.backupData
                        delete column.sortAttr;
                    }else{
                        if(column.type === 'select'){
                            this.dataTable.sort(compareSelectUp)
                        }else{
                            this.dataTable.sort(compareUp)
                        }                                       
                        
                        column.sortAttr = "up";
                    }
                    


                    function compareUp(a,b) {                     
                      if (a[column.name] < b[column.name])
                        return -1;
                      if (a[column.name] > b[column.name])
                        return 1;
                      return 0;
                    }

                    function compareDown(a,b) {                   
                      if (a[column.name] > b[column.name])
                        return -1;
                      if (a[column.name] < b[column.name])
                        return 1;
                      return 0;
                    }

                    function compareSelectUp(a,b) {  
                      var aLabel = column.data.find(function(el){
                        return el.id == a[column.name]
                      }).label; 

                      var bLabel = column.data.find(function(el){
                        return el.id == b[column.name]
                      }).label; 

                      if (aLabel < bLabel)
                        return -1;
                      if (aLabel > bLabel)
                        return 1;
                      return 0;
                    }

                    function compareSelectDown(a,b) {  
                      var aLabel = column.data.find(function(el){
                        return el.id == a[column.name]
                      }).label; 

                      var bLabel = column.data.find(function(el){
                        return el.id == b[column.name]
                      }).label; 

                      if (aLabel > bLabel)
                        return -1;
                      if (aLabel < bLabel)
                        return 1;
                      return 0;
                    }
                    

                }
            },
            created() {
                
                for (var prop in this.options) {
                    if (this.optionsDefault.hasOwnProperty(prop)) {
                        this.optionsDefault[prop] = this.options[prop];
                    }
                }
                Vue.tableComponents[this.optionsDefault.tableName] = this
                var that = this;
                if (this.optionsDefault.url && !this.data) {
                    axios.get(this.options.url).then(function(response) {                       
                        that.dataTable = response.data;
                        that.backupData = response.data;
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        });
       
    }
}
export default VueTable;