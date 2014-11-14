/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/

class Select{
   
   private formGroup = document.createElement('div');
   private hidden = document.createElement('input');
   private input = document.createElement('input');
   private mask = document.createElement('div');
   private ico = document.createElement('i');
   private items = document.createElement('ul');
   private element = null;
   private oldItem:HTMLElement = null;
   private currentItem:HTMLElement = null;
   private open = false;
   private disabled = false;
   private readOnly = false;
   private data:Array<any> = null;
   private length = 0;
   private icono = 'fa-angle-down';  
   private height = 'auto';
   
   constructor(htmlElement:HTMLElement,data){
     this.element = htmlElement;
     this.data = data;
     this.formGroup.className = 'form-group  has-feedback';
     this.hidden.type = 'hidden'; 
     if(this.element.dataset.name) this.hidden.name = this.element.dataset.name;          
     this.formGroup.appendChild(this.hidden);
     this.input.type = 'text';
     this.input.className = 'form-control';
     this.input.onchange = () =>{return true;}
     this.formGroup.appendChild(this.input);
     this.mask.className = 'ui-mask';     
     this.mask.onclick =(e)=>{
       this.toggle();
       e.stopPropagation();
       return false;
     }
     this.formGroup.appendChild(this.mask);
     this.ico.className = 'form-control-feedback fa';
     this.ico.classList.add(this.icono);
     this.ico.onclick = (e)=>{
       this.toggle();
       e.stopPropagation();
       return false;
     }
     this.formGroup.appendChild(this.ico);
     this.element.appendChild(this.formGroup);
     this.items.className = 'ui-select-items';
     this.element.appendChild(this.items);
     this.fill();
   }
   
   private fill(){
     this.length = this.data.length;     
     for(var i =0; i<this.length;i++){
       var item = this.data[i];
       var li = document.createElement('li');
       li.textContent = item.value;
       li.tabIndex = i;
       li.setAttribute('data-option',item.option);
       var self = this;
       li.onclick = function(e){
         self.changeValue(this);                
         e.stopPropagation();
         return false;
       }
       this.items.appendChild(li);
       if(item.selected){
         this.selectItem(item.option);
       }
     }
   }  

   
   private animationIn(){
     this.items.classList.add('open');	  
     this.items.classList.add('ui-ease-in');
     this.items.classList.add('ui-0-2s');
     this.items.classList.add('ui-fade-in-down');     			            
     setTimeout(()=>{
          this.items.classList.remove('ui-ease-in');
          this.items.classList.remove('ui-0-2s');
          this.items.classList.remove('ui-fade-in-down');				          
        },200);    
   }
   
   private animationOut(){
     this.items.classList.add('ui-ease-out');
     this.items.classList.add('ui-0-2s');
     this.items.classList.add('ui-fade-out-up');   			            
     setTimeout(()=>{
          this.items.classList.remove('ui-ease-out');
          this.items.classList.remove('ui-0-2s');
          this.items.classList.remove('ui-fade-out-up');
          this.items.classList.remove('open');	  
        },200);  	
   }
   
   private changeValue(htmlElement:HTMLElement){
      this.oldItem = this.currentItem;
      this.currentItem = htmlElement;
      this.input.value = this.currentItem.textContent;      
      this.input.setAttribute('data-option',this.currentItem.getAttribute('data-option'));
      this.hidden.value = this.input.value;      
      this.input.onchange();
      this.toggle();
      this.currentItem.classList.add('bg-primary');
      this.oldItem.classList.remove('bg-primary');
   }
   
   public static clear(){     
     var selects = document.getElementsByClassName('ui-select');
     var n = selects.length;
     if(n > 0){       
         for(var i= 0; i<n;i++){
           var select = <HTMLElement> selects[i];
           var items =  select.getElementsByTagName('ul')[0];
           if(items.classList.contains('open')){
                 items.classList.add('ui-ease-out');
			     items.classList.add('ui-0-2s');
			     items.classList.add('ui-fade-out-up');	
			     (function(items) {
			       	  setTimeout(()=>{
			          items.classList.remove('ui-ease-out');
			          items.classList.remove('ui-0-2s');
			          items.classList.remove('ui-fade-out-up');
			          items.classList.remove('open');	  
			        },200);  
			     })(items);		
           } 
         }
     }
   }
   
   public toggle(){    
     this.readOnly = this.input.readOnly;
     this.disabled = this.input.disabled; 
     if(!this.readOnly && !this.disabled){
        this.open = this.items.classList.contains('open');
        if(this.open){
           this.animationOut();
           this.open = false;           
        }else{
           Select.clear();
           this.animationIn();
           this.open = true;
        }
        this.currentItem.focus();        	       
     }
   }
   
   public selectItem(option){
      var lis = this.items.getElementsByTagName('li');
      if(this.length > 0){
        var flag = true;
        var i =0;
        do{
          var item = lis[i];
          i++;
          if(item.getAttribute('data-option') == option){
             this.oldItem = this.currentItem;      
             this.currentItem = item;
             flag = false;           
          }
        }while(flag && i < this.length);        
        this.input.value = this.currentItem.textContent;
        this.input.setAttribute('data-option',this.currentItem.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.currentItem.focus();
        if(this.oldItem) this.oldItem.classList.remove('bg-primary');
        this.currentItem.classList.add('bg-primary');         
       }      
     }
     
     public addItem(option,value){
       var li = document.createElement('li');
       li.textContent = value;
       li.tabIndex = this.length + 1;
       this.input.setAttribute('data-option',option);
       var self = this;
       li.onclick = function(e){
         self.changeValue(this);
         e.stopPropagation();
         return false;
       }       
       this.items.appendChild(li);
       this.length++;
     }
     
     public getItem(){
       return {
         value : this.input.value,
         option : this.input.getAttribute('data-option');
       };
     }
     
     public getValue(){
        return this.input.value;
     }
     
     public getOption(){
      return this.input.getAttribute('data-option');
     }     
     
     public isOpen(){
       return this.open;
     }
     
     public isDisabled(){
       return this.disabled;
     }
     
     public setDisabled(disabled:boolean){
       this.disabled = disabled;
       this.input.disabled = this.disabled;
       if(this.disabled){
         this.element.classList.add('disabled');
       }else{
        this.element.classList.remove('disabled');
       }
     }
     
     public isReadOnly(){
      return this.readOnly;
     }
     
     public setReadOnly(readOnly:boolean){
       this.readOnly = readOnly;
       this.input.readOnly = this.readOnly;
       if(this.readOnly){
         this.element.classList.add('read-only');
       }else{
        this.element.classList.remove('read-only');
       }
     }
     
     public onchange(callback){
        this.input.onchange = callback;        
     };
           
   }


class Alert{
     
     private element:HTMLElement = null;
     private button = document.createElement('button');
     private span = document.createElement('span');
     private p =  document.createElement('p');
     private i =  document.createElement('i');
     private strong = document.createElement('strong');
     public icoSuccess = 'fa-check';
     public icoInfo =  'fa-info';
     public icoWarning = 'fa-exclamation-triangle';
     public icoDanger = 'fa-times';
     public icoWait = 'fa-circle-o-notch';   
     public animationIn = 'ui-bounce-in-up';
     public animationOut = 'ui-fade-out';
     public typeAnimation = 'ui-ease-in-out';     
     private type = 'close';
     private durationAnimation = 'ui-1s';
          
     constructor(htmlElement:HTMLElement){        
        this.element = htmlElement;
        this.element.className = 'hidden';            
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function(){
           self.close()
        }
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);          
     }     
     
     public close(){        
          if(this.type!=='close'){
	          switch(this.type){
	              case 'success':
	               this.element.className = 'alert alert-success alert-dismissible';      
	              break;
	              case 'info':
	              case 'wait':
	               this.element.className = 'alert alert-info alert-dismissible';
	              break;
	              case 'warning':
	               this.element.className = 'alert alert-warning alert-dismissible';
	              break;
	              case 'danger':
	               this.element.className = 'alert alert-danger alert-dismissible';
	              break;	               
	          }	          
	          this.type = 'close';	          
	          this.element.classList.add(this.typeAnimation);
	          this.element.classList.add(this.durationAnimation);
	          this.element.classList.add(this.animationOut);
	          var self = this;
	          setTimeout(function(){self.element.classList.add('hidden')}, 1000);
          }	
     }
     
     public success(message){
       this.removeAnimation();         
       this.i.className = 'fa fa-lg pull-left';
       this.i.classList.add(this.icoSuccess);
       this.element.className = 'alert alert-success alert-dismissible';
       this.addAnimation();
       this.strong.textContent = message;
       this.type = 'success';
      
     }
     
     public info(message){          
       this.i.className = 'fa fa-lg pull-left';
       this.i.classList.add(this.icoInfo);
       this.element.className = 'alert alert-info alert-dismissible';
       this.addAnimation();
       this.strong.textContent = message;
       this.type = 'info';
       this.removeAnimation();   
       
     }
     
     public warning(message){
       this.i.className = 'fa fa-lg pull-left';
       this.i.classList.add(this.icoWarning);
       this.element.className = 'alert alert-warning alert-dismissible';
       this.addAnimation();
       this.strong.textContent = message;
       this.type = 'warning';
       this.removeAnimation();
     }
     
     public danger(message){
       this.i.className = 'fa fa-lg pull-left';
       this.i.classList.add(this.icoDanger);
       this.element.className = 'alert alert-danger alert-dismissible';
       this.addAnimation();
       this.strong.textContent = message;
       this.type = 'danger';
       this.removeAnimation();
     }
     
     public wait(message){     
       this.i.className = 'fa fa-spin fa-lg pull-left';
       this.i.classList.add(this.icoWait);
       this.element.className = 'alert alert-info alert-dismissible';
       this.addAnimation();
       this.strong.textContent = message;
       this.type = 'wait';
       this.removeAnimation();
     }
     
     private addAnimation(){
       this.element.classList.add(this.typeAnimation);
	   this.element.classList.add(this.durationAnimation);
	   this.element.classList.add(this.animationIn);      
     }
     
     private removeAnimation(){
        var self = this;
        setTimeout(function(){
	       self.element.classList.remove(self.typeAnimation);
		   self.element.classList.remove(self.durationAnimation);
		   self.element.classList.remove(self.animationIn);
        },1000);      
     }
}

class Toggle {  

     static init(){           
         this.initNavBar();
         this.initDropDown();
     } 
     
      private static initNavBar(){
         var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
         var n = navbars.length;
	     if(n > 0){        
	     
	         for(var i = 0; i < n; i++){
	            var element:any =  navbars[i];	            
	            element.onclick = function(){		          
			          var target = document.getElementById(this.dataset.target);
			          this.classList.toggle('collapsed');
			          target.classList.toggle('in');   
                }
	         } 	         
	      }
      }
      
      private static initDropDown(){
         var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
         var n = dropdownsToggle.length;
	     if(n > 0){
	         for(var i = 0; i < n; i++){
	            var element:any =  dropdownsToggle[i];	            
	            element.onclick = function(e){		                 
			         var dropdown =  this.parentNode;
			         var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
			         if(dropdown.classList.contains('open')){		        
			          dropdownMenu.classList.add('ui-ease');
			          dropdownMenu.classList.add('ui-0-5s');
			          dropdownMenu.classList.add('ui-fade-out-up');			            
			          setTimeout(function(){
				          dropdownMenu.classList.remove('ui-ease');
				          dropdownMenu.classList.remove('ui-0-5s');
				          dropdownMenu.classList.remove('ui-fade-out-up');
				          dropdown.classList.remove('open');	  
				        },500);  			                 
			         }else{		              
		              dropdown.classList.add('open');	  
			          dropdownMenu.classList.add('ui-ease');
			          dropdownMenu.classList.add('ui-0-5s');
			          dropdownMenu.classList.add('ui-fade-in-down');			            
			          setTimeout(function(){
				          dropdownMenu.classList.remove('ui-ease');
				          dropdownMenu.classList.remove('ui-0-5s');
				          dropdownMenu.classList.remove('ui-fade-in-down');				          
				        },500);     
			         }        
			          e.stopPropagation(); 
                      return false;			          
                }
	         } 	         
	      }
      }    
      
       static clearDropDown(){
         var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
	     var n = dropdownsToggle.length;
	     if(n > 0){
	       for(var i = 0; i < n; i++){
	           var dropdown:any =  dropdownsToggle[i].parentNode;
	           if(dropdown.classList.contains('open')){	                
	                  var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
			          dropdownMenu.classList.add('ui-ease');
			          dropdownMenu.classList.add('ui-0-5s');
			          dropdownMenu.classList.add('ui-fade-out-up');			            
			          setTimeout(function(){
				          dropdownMenu.classList.remove('ui-ease');
				          dropdownMenu.classList.remove('ui-0-5s');
				          dropdownMenu.classList.remove('ui-fade-out-up');
				          dropdown.classList.remove('open');	  
				        },500);     		                     
	            }
	        }                    
	     }	
      }
}

class Utils{      
           
       static showActiveLink(element){
           var anchors = element.querySelectorAll('.ui-link');
           var n = anchors.length;
           var url:any= window.location.pathname;
           url = url.replace(/\//g,'');            
           for(var i = 0; i<n;i++){
             var a = anchors[i];
             var href = a.href.split('/');
             href = href[href.length-1];
             if(a.classList.contains('active')){
                a.parentNode.classList.add('remove'); 
             }             
             if(href === url){                 
                 a.parentNode.classList.add('active');  
             }
           }                   
      }
      
      static reloadCSS(element,href){
         var queryString = '?reload=' + new Date().getTime();
         element.href = href.replace(/\?.*|$/, queryString);         
      }
         
}


window.onload = function(){
  Toggle.init();
}


/*
* Evento click para el  documento.
*/
document.onclick = function(){
	/*
	* Cerrar los dropdowns
	*/
    Toggle.clearDropDown();
	/*
	* Cerrar los selects
	*/
    Select.clear();
 }