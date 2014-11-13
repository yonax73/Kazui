/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/


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
         var dropdowns = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
         var n = dropdowns.length;
	     if(n > 0){
	         for(var i = 0; i < n; i++){
	            var element:any =  dropdowns[i];	            
	            element.onclick = function(e){		                 
			          this.parentNode.classList.toggle('open');			         
			          e.stopPropagation(); 
                      return false;			          
                }
	         } 	         
	      }
      }    
      
       static clearDropDown(){
         var dropdowns = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
	     var n = dropdowns.length;
	     if(n > 0){
	       for(var i = 0; i < n; i++){
	           var element:any =  dropdowns[i].parentNode;
	           if(element.classList.contains('open')){	               
	                 element.classList.remove('open');		                     
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
 }