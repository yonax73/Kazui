/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/

class DataTable{
    
    private element:HTMLElement;
    private icoLoading:HTMLElement;
    private action:String;
    private fields:Array<{}>;
    private table:HTMLElement;
    private data:Array<JSON>;
    
    constructor(element:HTMLElement,action:String,fields:Array<{}>){
      this.element= element;
      this.action = action;
      this.fields = fields;
      this.icoLoading = document.createElement('i');
      this.table = document.createElement('table');
      this.init();      
    }
    
    public init(){
       this.icoLoading.className = 'fa fa-spinner fa-spin';
       this.table.className = 'ui-data-table table table-striped';       
       this.fillTable();              
    }
    
    private fillTable(){
      var m = this.fields.length;      
      if(m > 0){
      this.fillHeaderTable();      
         Http.get(this.action,this.runIcoLoading(),(xhr)=>{
           this.data = JSON.parse(xhr.responseText);
           var n = this.data.length;
           if(n > 0){
               var i = 0;
               var tbody = document.createElement('tbody');
                              
               do{
                 var tr = document.createElement('tr');
                 var d:any = this.data[i];                 
                 for(var j = 0; j < m; j++){
                   var td = document.createElement('td');
                   var field:any = this.fields[j];                   
                   td.textContent = d[field.value];
                   tr.appendChild(td);
                 }
                 tbody.appendChild(tr);
                 i++;
               }while(i<n);
               this.table.appendChild(tbody);
               this.stopIcoLoading();
               this.element.appendChild(this.table); 
           }           
         });
      }          
    }
    
    private fillHeaderTable(){
      var m = this.fields.length;
      if(m>0){
        var j = 0;
        var thead  = document.createElement('thead');
        var tr = document.createElement('tr');
        thead.appendChild(tr);
        do{
          var th = document.createElement('th');
          var field:any = this.fields[j];
          th.textContent= field.name;
          tr.appendChild(th); 
          j++;
        }while(j<m);
        this.table.appendChild(thead);
      }
    }
    
    private runIcoLoading(){
       this.element.appendChild(this.icoLoading);
    }
    
    private stopIcoLoading(){
      this.element.removeChild(this.icoLoading);
    } 
    
}

class Popup{   
   
   private element:HTMLElement;
   private animationShow:Animation;
   private animationClose:Animation;
   private mask:HTMLElement;
   
   constructor(element:HTMLElement){   
     this.element = element;
     this.animationShow = new Animation('ui-ease', 'ui-bounce-in-down', 'ui-1s', 1000);
     this.animationClose = new Animation('ui-ease', 'ui-fade-out', 'ui-1s', 1000);
     this.mask = document.createElement('div');
     this.init();   
   }
   
   private init(){
     this.mask.className='hidden';
     var body = document.getElementsByTagName('body')[0];
     body.appendChild(this.mask);
     this.element.classList.add('hidden');
   }
   
   public show(){
     this.mask.className = 'show ui-popup-mask';
     if(this.element.classList.contains('hidden')){
        this.element.classList.remove('hidden');
        this.element.classList.add('show');
        this.animationShow.run(this.element);
     }
   }
   
   public close(){     
     if(this.element.classList.contains('show')){
        this.animationClose.run(this.element,()=>{
             this.mask.className = 'hidden';
             this.element.classList.remove('show');
             this.element.classList.add('hidden');
        });
     }     
   }   
   
}

enum ETypeClock {
    STANDARD,
    MILITARY,
    COUNT_DOWN,
    COUNT_UP,
    CUSTOM_STANDARD,
    CUSTOM_MILITARY
}
/**
 * Clock
 * @class Clock
 */
class Clock {

    private element: HTMLElement;
    private panel: HTMLDivElement;
    private panelBody: HTMLDivElement;
    private table: HTMLTableElement;
    private upHour: HTMLTableCellElement;
    private upMinutes: HTMLTableCellElement;
    private upSeconds: HTMLTableCellElement;
    private upTime: HTMLTableCellElement;
    private downHour: HTMLTableCellElement;
    private downMinutes: HTMLTableCellElement;
    private downSeconds: HTMLTableCellElement;
    private downTime: HTMLTableCellElement;
    private hour: HTMLTableCellElement;
    private minutes: HTMLTableCellElement;
    private seconds: HTMLTableCellElement;
    private time: HTMLTableCellElement;
    private isStop: boolean;
    private type: ETypeClock;
    private animationUp: Animation;
    private animationDown: Animation;
    private iconUp: string;
    private iconDown: string;
    private disabledControl: boolean;
    private hiddenControl: boolean;
    private hiddenSeconds: boolean;
    private timeOut;
    private callBackCountDown;
    private date: Date;


    /**
    * constructor 
    * @param {HTMLElement} element
    */
    constructor(element: HTMLElement) {
        this.element = element;
        this.iconUp = 'fa fa-chevron-up';
        this.iconDown = 'fa fa-chevron-down';
        this.animationUp = new Animation('ui-ease-in', 'ui-fade-in-up', 'ui-0-2s', 200);
        this.animationDown = new Animation('ui-ease-in', 'ui-fade-in-down', 'ui-0-2s', 200);
        this.isStop = true;
        this.create();
    }

    /**
    * Create HTML
    * @method create
    */
    private create() {
        /**
         * Create HTMLElements.
         */
        this.panel = document.createElement('div');
        this.panelBody = document.createElement('div');
        this.createTable();
        /**
         * add classes.
         */
        this.element.className = 'ui-clock';
        this.panel.className = 'panel panel-primary';
        this.panelBody.className = 'ui-clock panel-body';
        /**
         * append Nodes.
         */
        this.panelBody.appendChild(this.table);
        this.panel.appendChild(this.panelBody);
        this.element.appendChild(this.panel);
    }
    /**
    * Create Table HTML
    * @method createTable
    */
    private createTable() {
        /**
         * Create HTMLElements.
         */
        this.table = document.createElement('table');
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        this.upHour = document.createElement('td');
        this.upMinutes = document.createElement('td');
        this.upSeconds = document.createElement('td');
        this.upTime = document.createElement('td');
        this.downHour = document.createElement('td');
        this.downMinutes = document.createElement('td');
        this.downSeconds = document.createElement('td');
        this.downTime = document.createElement('td');
        this.hour = document.createElement('td');
        this.minutes = document.createElement('td');
        this.seconds = document.createElement('td');
        this.time = document.createElement('td');
        var iconUp = document.createElement('i');
        var iconDown = document.createElement('i');
        /**
         * add classes.
         */
        this.table.className = 'ui-clock table table-condensed';
        tr.className = 'ui-clock-controls text-primary';
        iconUp.className = this.iconUp;
        iconDown.className = this.iconDown;
        /**
         * create row for up controls
         */
        this.upHour.appendChild(iconUp.cloneNode());
        this.upMinutes.appendChild(iconUp.cloneNode());
        this.upSeconds.appendChild(iconUp.cloneNode());
        this.upTime.appendChild(iconUp.cloneNode());
        tr.appendChild(this.upHour);
        tr.appendChild(this.upMinutes);
        tr.appendChild(this.upSeconds);
        tr.appendChild(this.upTime);
        tbody.appendChild(tr);
        this.addEventsUpControls();
        /**
         * create row for display the time
         */
        tr = document.createElement('tr');
        tr.className = 'bg-primary';
        this.clearTime();
        tr.appendChild(this.hour);
        tr.appendChild(this.minutes);
        tr.appendChild(this.seconds);
        tr.appendChild(this.time);
        tbody.appendChild(tr);
        /**
         * create row for down controls
         */
        tr = document.createElement('tr');
        tr.className = 'ui-clock-controls text-primary';
        this.downHour.appendChild(iconDown.cloneNode());
        this.downMinutes.appendChild(iconDown.cloneNode());
        this.downSeconds.appendChild(iconDown.cloneNode());
        this.downTime.appendChild(iconDown.cloneNode());
        tr.appendChild(this.downHour);
        tr.appendChild(this.downMinutes);
        tr.appendChild(this.downSeconds);
        tr.appendChild(this.downTime);
        tbody.appendChild(tr);
        this.addEventsDownControls();
        /**
         * add node tbody
         */
        this.table.appendChild(tbody);
    }
    /**
    * clear clock
    * @method clearTime
    */
    private clearTime() {
        this.hour.textContent = '00';
        this.minutes.textContent = '00';
        this.seconds.textContent = '00';
        this.time.textContent = '--';
    }
    /**
    * add events for Up Controls
    * @method addEventsUpControls
    */
    private addEventsUpControls() {
        this.upHour.onclick = () => {
            var max = this.isCountDown() || this.isCountUp() ? 99 : this.isMilitaryTime() ? 23 : 12;
            this.animationUp.run(this.hour);
            this.hour.textContent = this.upDigit(this.getHours(), max);
        };
        this.upMinutes.onclick = () => {
            this.animationUp.run(this.minutes);
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
        };
        this.upSeconds.onclick = () => {
            this.animationUp.run(this.seconds);
            this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        };
        this.upTime.onclick = () => {
            this.animationUp.run(this.time);
            this.time.textContent = this.time.textContent === 'AM' ? 'PM' : 'AM';
        };
    }
    /**
    * add events for Down Controls
    * @method addEventsDownControls
    */
    private addEventsDownControls() {
        this.downHour.onclick = () => {
            var start = this.isCountDown() || this.isCountUp() ? 99 : this.isMilitaryTime() ? 23 : 12;
            this.animationDown.run(this.hour);
            this.hour.textContent = this.downDigit(this.getHours(), 0, start);
        };
        this.downMinutes.onclick = () => {
            this.animationDown.run(this.minutes);
            this.minutes.textContent = this.downDigit(this.getMinutes(), 0, 59);
        };
        this.downSeconds.onclick = () => {
            this.animationDown.run(this.seconds);
            this.seconds.textContent = this.downDigit(this.getSeconds(), 0, 59);
        };
        this.downTime.onclick = () => {
            this.animationDown.run(this.time);
            this.time.textContent = this.time.textContent === 'AM' ? 'PM' : 'AM';
        };
    }

    /**
    * Add an zero in front, if the digit is less that ten
    * @param {any} digit
    * @return {string} digit fixed
    * @method fixDigit
    */
    private fixDigit(digit) {
        if (digit < 10 && digit.toString().length === 1) {
            digit = '0' + digit;
        }
        return digit;
    }
    /**
    * hidden time column 
    * @method hiddenTimeColumn
    */
    private hiddenTimeColumn() {
        if (!this.upTime.classList.contains('hidden')) this.upTime.classList.add('hidden');
        if (!this.time.classList.contains('hidden')) this.time.classList.add('hidden');
        if (!this.downTime.classList.contains('hidden')) this.downTime.classList.add('hidden');
    }
    /**
    * show time column 
    * @method showTimeColumn
    */
    private showTimeColumn() {
        if (this.upTime.classList.contains('hidden')) this.upTime.classList.remove('hidden');
        if (this.time.classList.contains('hidden')) this.time.classList.remove('hidden');
        if (this.downTime.classList.contains('hidden')) this.downTime.classList.remove('hidden');
    }
    /**
    * Digit increase to the maximum number
    * @param {any} digit
    * @param {number} max
    * @method upDigit
    */
    private upDigit(digit, max: number) {
        digit++;
        if (digit > max)
            digit = 0;
        return this.fixDigit(digit);
    }
    /**
    * Decrement digit to the minimum number and start over
    * @param {any} digit
    * @param {number} min
    * @param {number} start
    * @method downDigit
    */
    private downDigit(digit, min: number, start: number) {
        digit--;
        if (digit < min)
            digit = start;
        return this.fixDigit(digit);
    }
    /**
   * Start clock in the standard time
   * @method standardTime
   */
    public standardTime() {
        this.isStop = false;
        this.type = ETypeClock.STANDARD;
        this.showTimeColumn();
        this.setDisabledControls(true);
        this.runStandardTime();
    }
    /**
   * run clock in the standard time
   * @method runStandardTime
   */
    private runStandardTime() {
        var today = new Date();
        var h: any = today.getHours();
        var m: any = today.getMinutes();
        var s: any = today.getSeconds();
        var t = h < 12 ? 'AM' : 'PM';
        if (h > 12) h = h - 12;
        else if (h === 0) h = 12;
        h = this.fixDigit(h);
        m = this.fixDigit(m);
        s = this.fixDigit(s);

        if (this.getSeconds() != s) {
            this.animationDown.run(this.seconds);
            this.seconds.textContent = s;
        }
        if (this.getMinutes() != m) {
            this.animationDown.run(this.minutes);
            this.minutes.textContent = m;
        }
        if (this.getHours() != h) {
            this.animationDown.run(this.hour);
            this.hour.textContent = h;
        }
        if (this.time.textContent != t) {
            this.animationDown.run(this.time);
            this.time.textContent = t;
        }
        this.timeOut = setTimeout(() => {
            this.runStandardTime();
        }, 1000);
    }
    /**
   * Start clock in the military time
   * @method militaryTime
   */
    public militaryTime() {
        this.isStop = false;
        this.type = ETypeClock.MILITARY;
        this.hiddenTimeColumn();
        this.setDisabledControls(true);
        this.runMilitaryTime();
    }
    /**
   * Run clock in the military time
   * @method runMilitaryTime
   */
    private runMilitaryTime() {
        var today = new Date();
        var h: any = today.getHours();
        var m: any = today.getMinutes();
        var s: any = today.getSeconds();

        h = this.fixDigit(h);
        m = this.fixDigit(m);
        s = this.fixDigit(s);

        if (this.getSeconds() != s) {
            this.animationDown.run(this.seconds);
            this.seconds.textContent = s;
        }
        if (this.getMinutes() != m) {
            this.animationDown.run(this.minutes);
            this.minutes.textContent = m;
        }
        if (this.getHours() != h) {
            this.animationDown.run(this.hour);
            this.hour.textContent = h;
        }
        this.timeOut = setTimeout(() => {
            this.runMilitaryTime();
        }, 1000);
    }
    /**
   * Start clock with the counting down
   * @param {function} callBack 
   * @method countDown
   */
    public countDown(callBack?) {
        this.isStop = true;
        this.type = ETypeClock.COUNT_DOWN;
        this.hiddenTimeColumn();
        this.setDisabledControls(false);
        if (callBack) this.callBackCountDown = callBack;
    }
    /**
   * Run clock in the counting down
   * @method runCountDown
   */
    private runCountDown() {
        this.isStop = this.getHours() === '00' && this.getMinutes() === '00' && this.getSeconds() === '00';
        if (this.isStop) {
            this.isStop = false;           //restart isStop in FALSE
            this.stop();
            if (this.callBackCountDown) this.callBackCountDown();
            return false;
        } else {
            var lap = this.getSeconds() === '00';
            this.animationDown.run(this.seconds);
            this.seconds.textContent = this.downDigit(this.getSeconds(), 0, 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.minutes);
                lap = this.getMinutes() === '00';
                this.minutes.textContent = this.downDigit(this.getMinutes(), 0, 59);

                if (lap && this.getHours() > 0) {
                    lap = false;
                    this.animationDown.run(this.hour);
                    this.hour.textContent = this.downDigit(this.getHours(), 0, 99);
                }
            }
        }
        this.timeOut = setTimeout(() => {
            this.runCountDown();
        }, 1000);
    }
    /**
   * Start clock with the counting up
   * @method countUp
   */
    public countUp() {
        this.isStop = true;
        this.type = ETypeClock.COUNT_UP;
        this.hiddenTimeColumn();
        this.setDisabledControls(false);
    }
    /**
   * Run clock in the counting up
   * @method runCountUp
   */
    private runCountUp() {
        var lap = this.getSeconds() === '59';
        this.animationUp.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationUp.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationUp.run(this.hour);
                this.hour.textContent = this.upDigit(this.getHours(), 99);
            }
        }
        this.timeOut = setTimeout(() => {
            this.runCountUp();
        }, 1000);
    }
    /**
    * set Standard time
    * @param {Date} date
    * @method setStandarTime
    */
    public setStandardTime(date: Date) {
        if (date) {            
            this.seconds.textContent = this.fixDigit(date.getSeconds());
            this.minutes.textContent = this.fixDigit(date.getMinutes());
            this.hour.textContent = this.fixDigit(date.getHours());
            this.date = date;
        }        
        var h: any = this.getHours();
        this.time.textContent = h < 12 ? 'AM' : 'PM';        
        if (h > 12) h = h - 12;
        else if (parseInt(h) === 0) h = 12;
        h = this.fixDigit(h);
        this.hour.textContent = h;
        this.isStop = false;
        this.type = ETypeClock.CUSTOM_STANDARD;
        this.showTimeColumn();
        this.setDisabledControls(true);
        this.runCustomStandarTime();
    }
    /**
    * Run clock in the custom standar time
    * @method runCustomStandarTime
    */
    private runCustomStandarTime() {
        var lap = this.getSeconds() === '59';
        this.animationDown.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationDown.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.hour);
                if (this.getHours() === '12') {
                    this.time.textContent = this.getTimeForStandarClock() === 'AM' ? 'PM' : 'AM';
                }
                var h = this.upDigit(this.getHours(), 12);
                this.hour.textContent = h === '00' ? '01' : h;
            }
        }
        this.timeOut = setTimeout(() => {
            this.runCustomStandarTime();
        }, 1000);
    }
    /**
    * set Military time
    * @param {Date} date
    * @method setMilitaryTime
    */
    public setMilitaryTime(date: Date) {
        if (date) {
            this.seconds.textContent = this.fixDigit(date.getSeconds());
            this.minutes.textContent = this.fixDigit(date.getMinutes());
            this.hour.textContent = this.fixDigit(date.getHours());
            this.date = date;
        }
        this.isStop = false;
        this.type = ETypeClock.CUSTOM_MILITARY;
        this.hiddenTimeColumn();
        this.setDisabledControls(true);
        this.runCustomStandarTime();
    }
    /**
    * Run clock in the custom military time
    * @method runCustomMilitaryTime
    */
    private runCustomMilitaryTime() {
        var lap = this.getSeconds() === '59';
        this.animationDown.run(this.seconds);
        this.seconds.textContent = this.upDigit(this.getSeconds(), 59);
        if (lap) {
            lap = false;
            this.animationDown.run(this.minutes);
            lap = this.getMinutes() === '59';
            this.minutes.textContent = this.upDigit(this.getMinutes(), 59);
            if (lap) {
                lap = false;
                this.animationDown.run(this.hour);
                this.hour.textContent = this.upDigit(this.getHours(), 23);
            }
        }
        this.timeOut = setTimeout(() => {
            this.runCustomMilitaryTime();
        }, 1000);
    }
    /**
   * Start clock
   * @method start
   */
    public start() {
        this.isStop = false;
        switch (this.type) {
            case ETypeClock.STANDARD:
                this.setDisabledControls(true);
                this.runStandardTime();
                break;
            case ETypeClock.MILITARY:
                this.setDisabledControls(true);
                this.runMilitaryTime();
                break;
            case ETypeClock.COUNT_DOWN:
                this.runCountDown();
                break;
            case ETypeClock.COUNT_UP:
                this.runCountUp();
                break;
            case ETypeClock.CUSTOM_STANDARD:
                this.setDisabledControls(true);
                this.runCustomStandarTime();
                break;
            case ETypeClock.CUSTOM_MILITARY:
                this.setDisabledControls(true);
                this.runCustomMilitaryTime();
                break;
        }
    }
    /**
    * Stop clock
    * @method stop
    */
    public stop() {
        if (!this.isStop) {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
                this.isStop = true;
                this.setDisabledControls(false);
            }
        }
    }
    /**
   * Reset clock
   * @method reset
   */
    public reset() {
        this.stop();
        this.clearTime();
    }
    /**
   * Set disabled controls
   * @param {boolean} disabled
   * @method setDisabledControls
   */
    public setDisabledControls(disabled: boolean) {
        var rowControlsUp: any = this.table.rows[0];
        var rowControlsDown: any = this.table.rows[2];
        this.disabledControl = disabled;
        if (disabled) {
            if (!rowControlsUp.classList.contains('disabled')) {
                rowControlsUp.classList.add('disabled');
            }
            if (!rowControlsDown.classList.contains('disabled')) {
                rowControlsDown.classList.add('disabled');
            }
        } else {
            if (rowControlsUp.classList.contains('disabled')) {
                rowControlsUp.classList.remove('disabled');
            }
            if (rowControlsDown.classList.contains('disabled')) {
                rowControlsDown.classList.remove('disabled');
            }
        }
    }
    /**
    * Is disabled controls
    * @returns {boolean} disabled
    * @method isDisabledControls
    */
    public isDisabledControls() {
        return this.disabledControl;
    }
    /**
   * Set hidden controls
   * @param {boolean} hidden
   * @method setHiddenControls
   */
    public setHiddenControls(hidden: boolean) {
        var rowControlsUp: any = this.table.rows[0];
        var rowControlsDown: any = this.table.rows[2];
        this.hiddenControl = hidden;
        if (hidden) {
            if (!rowControlsUp.classList.contains('hidden')) {
                rowControlsUp.classList.add('hidden');
            }
            if (!rowControlsDown.classList.contains('hidden')) {
                rowControlsDown.classList.add('hidden');
            }
        } else {
            if (rowControlsUp.classList.contains('hidden')) {
                rowControlsUp.classList.remove('hidden');
            }
            if (rowControlsDown.classList.contains('hidden')) {
                rowControlsDown.classList.remove('hidden');
            }
        }
    }
    /**
    * Is hidden controls
    * @returns {boolean} hidden
    * @method isHiddenControls
    */
    public isHiddenControls() {
        return this.hiddenControl;
    }
    /**
* Set hidden Seconds
* @param {boolean} hidden
* @method setHiddenSeconds
*/
    public setHiddenSeconds(hidden: boolean) {
        var rowControlsUp: any = this.table.rows[0];
        var cellControlsUp = rowControlsUp.cells[2];
        var rowControlsDown: any = this.table.rows[2];
        var cellControlsDown = rowControlsDown.cells[2];
        this.hiddenSeconds = hidden;
        if (hidden) {
            if (!cellControlsUp.classList.contains('hidden')) {
                cellControlsUp.classList.add('hidden');
            }
            if (!this.seconds.classList.contains('hidden')) {
                this.seconds.classList.add('hidden');
            }
            if (!cellControlsDown.classList.contains('hidden')) {
                cellControlsDown.classList.add('hidden');
            }
        } else {
            if (cellControlsUp.classList.contains('hidden')) {
                cellControlsUp.classList.remove('hidden');
            }
            if (this.seconds.classList.contains('hidden')) {
                this.seconds.classList.remove('hidden');
            }
            if (cellControlsDown.classList.contains('hidden')) {
                cellControlsDown.classList.remove('hidden');
            }
        }
    }
    /**
    * Is hidden seconds
    * @returns {boolean} hidden
    * @method isHiddenSeconds
    */
    public isHiddenSeconds() {
        return this.hiddenSeconds;
    }
    /**
    * get DateTime
    * @returns {String} dateTime
    * @method getDateTime
    */
    public getDateTime() {
        var t = this.isStandardTime() ? this.time.textContent : '';
        return this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds() + ' '+t;
    }
    /**
    * get Date
    * @returns {Date} date
    * @method getDate
    */
    public getDate() {
        var date = this.isCustom() ? this.date : new Date();
        date.setHours(this.getHours(), this.getMinutes(), this.getSeconds());        
        return date;
    }
    /**
    * get Hour
    * @returns {any} hour
    * @method getHours
    */
    public getHours() {
        var h: any = this.hour.textContent;
        if (this.isStandardTime()) {            
            h = h > 12 ? h - 12 : h;            
        }
        return h;
    }
    /**
    * get Minutes
    * @returns {any} minutes
    * @method getMinutes
    */
    public getMinutes(): any {
        return this.minutes.textContent;
    }
    /**
    * get Seconds
    * @returns {any} seconds
    * @method getSeconds
    */
    public getSeconds(): any {
        return this.seconds.textContent;
    }
    /**
    * get Time for a standard clock :AM/PM
    * @returns {string} time
    * @method getTimeForStandarClock
    */
    public getTimeForStandarClock() {
        var time = null;
        if (this.isStandardTime()) {
            time = this.time.textContent;
        }
        return time;
    }
    /**    
    * @returns {boolean} return true if the type is standard time
    * @method isStandardTime
    */
    public isStandardTime() {
        return this.type === ETypeClock.STANDARD || this.type === ETypeClock.CUSTOM_STANDARD;
    }
    public isCustomStandard() {
        return this.type === ETypeClock.CUSTOM_STANDARD;
    }
    /**    
    * @returns {boolean} return true if the type is military time
    * @method isMilitaryTime
    */
    public isMilitaryTime() {
        return this.type === ETypeClock.MILITARY || this.type === ETypeClock.CUSTOM_MILITARY;
    }
    public isCustomMilitary() {
        return this.type === ETypeClock.CUSTOM_MILITARY;
    }

    public isCustom() {
        return this.isCustomMilitary() || this.isCustomStandard();
    }
    /**    
    * @returns {boolean} return true if the type is count down
    * @method isCountDown
    */
    public isCountDown() {
        return this.type === ETypeClock.COUNT_DOWN;
    }
    /**    
    * @returns {boolean} return true if the type is count up
    * @method isCountUp
    */
    public isCountUp() {
        return this.type === ETypeClock.COUNT_UP;
    }

    public isStopped() {
        return this.isStop;
    }



}
/**
 * Animation
 * @class Animation
 */
class Animation {
    public type: string;
    public fn: string;
    public time: string;
    public ms: number;
    public timeOut;
    /**
    * constructor 
    * @param {string} type
    * @param {string} fn
    * @param {string} time
    * @param {number} ms 
    */
    constructor(type: string, fn: string, time: string, ms: number) {
        this.type = type;
        this.fn = fn;
        this.time = time;
        this.ms = ms;
    }
    /**
   * Run animation
   * @param {HTMLElement} element
   * @param {Function} callback
   * @method run
   */
    public run(element: HTMLElement, callBack?) {
        element.classList.add(this.type);
        element.classList.add(this.fn);
        element.classList.add(this.time);
        this.timeOut = setTimeout(() => {
            element.classList.remove(this.type);
            element.classList.remove(this.fn);
            element.classList.remove(this.time);
            if (callBack) callBack();
        }, this.ms);
    }
    /**
    * Stop animation
    * @method stop
    */
    public stop() {
        if (this.timeOut) clearTimeout(this.timeOut);
    }
}

enum ETypeCalendar {
    DAY,
    MONTH,
    YEAR
}

class Calendar {

    private days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
    private abbDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    private abbMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    private yearGregorian = 1582;
    private today = new Date();
    private displayDate: Date;
    private data;
    private table;
    private tbody: HTMLElement;
    private btnBack;
    private btnCurrent;
    private btnNext;
    private selectedCell;
    private element: HTMLElement;
    private legend: HTMLElement;
    private options;
    private title;
    private animationIn: Animation;
    private animationOut: Animation;
    private animationNext: Animation;
    private animationBack: Animation;
    private animationUp: Animation;
    private animationDown: Animation;
    private type: ETypeCalendar = ETypeCalendar.DAY;

    constructor(element: HTMLElement, options) {
        this.element = element;
        this.options = options;
        this.animationIn = new Animation('ui-ease', 'ui-fade-in-down', 'ui-0-5s', 500);
        this.animationOut = new Animation('ui-ease', 'ui-fade-out-up', 'ui-0-5s', 500);
        this.animationNext = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s', 200);
        this.animationBack = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s', 200);
        this.animationUp = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s', 200);
        this.animationDown = new Animation('ui-ease', 'ui-flip-out-x', 'ui-0-2s', 200);
        this.setOptions();
        this.displayDate = this.today.clone();
        this.displayDate.setDate(1);
        this.data = {};
        this.dataDay();
        this.createCalendar();
        this.calendarDay();
        this.mediaQuery();
    }

    private dataDay() {

        var dayweek = this.displayDate.getDay();
        var month = this.displayDate.getMonth();
        var year = this.displayDate.getFullYear();
        var totalDays = this.displayDate.getMonthDayCount();
        this.data.month = {
            value: month,
            text: this.displayDate.getMonthName()
        };
        this.data.year = year;
        this.data.currentDay = month === this.today.getMonth() && year === this.today.getFullYear() ? this.today.getDate() : 1;
        this.data.items = new Array();
        var previousTotalDays = 0;
        var day = 0;                                                  //The day to display on the calendar.
        var isPreviousDay = false;
        var isCurrentDay = true;
        var isNextDay = false;
        /*
         * If the day week is greater than zero,
         * necessary known how many days has the previous month.
         */
        if (dayweek > 0) {
            var previousDate = this.displayDate.clone();
            previousDate.previousMonth();
            previousTotalDays = previousDate.getMonthDayCount();
            /*
             * calculate the first day for display on the calendar
             */
            day = previousTotalDays - dayweek;
            if (day > 30) day--;
            isPreviousDay = true;
            isCurrentDay = false;
        }
        /*
         * Fill data.items
         */
        for (var i = 0; i < 42; i++) {
            var item: any = {};
            day++;
            item.day = day;
            if (isPreviousDay) {
                item.previousDay = true;
                /*
                *If the day is equals at  total days the
                *previous month, is becasuse wiLL start
                *the current month
                */
                if (day === previousTotalDays) {
                    isPreviousDay = false;
                    isCurrentDay = true;
                    day = 0;
                }
            } else if (isCurrentDay) {
                item.currentDay = true;
                /*
                *If the day is equals at  total days the
                *current month, is becasuse wiLL start
                *the next month.
                */
                if (day === totalDays) {
                    isNextDay = true;
                    isCurrentDay = false;
                    day = 0;
                }
            } else {
                item.nextDay = true;
            }
            this.data.items.push(item);
        }
        this.type = ETypeCalendar.DAY;
    }

    private dataMonth() {
        var year = this.displayDate.getFullYear();
        this.data.year = year;
        this.data.currentMonth = year === this.today.getFullYear() ? this.today.getMonth() : 0;
        this.type = ETypeCalendar.MONTH;
    }

    private dataYear() {
        var year = this.displayDate.getFullYear();
        var limitYear = year + 11;
        this.data.year = year;
        this.data.currentYear = year <= this.today.getFullYear() && limitYear >= this.today.getFullYear() ? this.today.getFullYear() : year;
        this.data.range = year + ' - ' + limitYear;
        this.type = ETypeCalendar.YEAR;
    }

    private createCalendar() {
        var row = document.createElement('div');
        var col = document.createElement('div');
        var panelDefault = document.createElement('div');
        var panelBody = document.createElement('div');

        row.className = 'row';
        col.className = 'col-sm-12 col-md-12';
        panelDefault.className = 'ui-calendar panel panel-default panel-main';
        panelBody.className = 'panel-body';

        panelBody.appendChild(this.header());
        panelBody.appendChild(this.body());
        panelDefault.appendChild(panelBody);
        col.appendChild(panelDefault);
        row.appendChild(col);
        /*
        * add calendar to parent
        */
        this.element.appendChild(row);
    }


    /*
     * Create calendar header HTML.
     * @returns HTMLElement
     */
    private header() {
        var row = document.createElement('div');
        row.className = 'row';

        var colTitle = document.createElement('div');
        colTitle.className = 'col-sm-6';
        /*
        * add the title
        */
        this.title = document.createElement('a');
        this.title.className = 'ui-title';
        this.title.href = '#';

        colTitle.appendChild(this.title);

        var colButtons = document.createElement('div');
        colButtons.className = 'ui-calendar col-sm-6';
        var btnGroupJustified = document.createElement('div');
        btnGroupJustified.className = 'btn-group btn-group-justified';
        /*
        * back Button
        */
        var btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnBack = document.createElement('button');
        this.btnBack.type = 'button';
        this.btnBack.className = 'btn btn-default';
        var i = document.createElement('i');
        i.className = 'fa fa-chevron-circle-left';
        this.btnBack.appendChild(i);
        btnGroup.appendChild(this.btnBack);
        btnGroupJustified.appendChild(btnGroup);
        /*
        * current Button
        */
        btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnCurrent = document.createElement('button');
        this.btnCurrent.type = 'button';
        this.btnCurrent.className = 'btn btn-default';
        i = document.createElement('i');
        i.className = 'fa fa-circle';
        this.btnCurrent.appendChild(i);
        btnGroup.appendChild(this.btnCurrent);
        btnGroupJustified.appendChild(btnGroup);
        /*
        * next Button
        */
        btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        this.btnNext = document.createElement('button');
        this.btnNext.type = 'button';
        this.btnNext.className = 'btn btn-default';
        i = document.createElement('i');
        i.className = 'fa fa-chevron-circle-right';
        this.btnNext.appendChild(i);
        btnGroup.appendChild(this.btnNext);
        btnGroupJustified.appendChild(btnGroup);

        colButtons.appendChild(btnGroupJustified);
        row.appendChild(colTitle);
        row.appendChild(colButtons);
        return row;
    }

    /*
    *Create calendar body HTML. 
    *@returns HTMLElement
    */
    private body() {
        var row = document.createElement('div');
        row.className = 'row';
        var col = document.createElement('div');
        col.className = 'col-sm-12';

        var panelDefault = document.createElement('div');
        panelDefault.className = 'ui-calendar panel panel-default';

        var panelBody = document.createElement('div');
        panelBody.className = 'panel-body';

        /*
        * Create the table
        */
        this.table = document.createElement('table');
        this.table.className = 'table table-condensed';
        var thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.table.appendChild(thead);
        this.table.appendChild(this.tbody);
        panelBody.appendChild(this.table);
        panelDefault.appendChild(panelBody);
        col.appendChild(panelDefault);
        row.appendChild(col);
        return row;
    }


    private clearTable(callback, animation: Animation) {
        this.table.classList.add(animation.type);
        this.table.classList.add(animation.fn);
        this.table.classList.add(animation.time);
        setTimeout(() => {
            this.table.classList.remove(animation.type);
            this.table.classList.remove(animation.fn);
            this.table.classList.remove(animation.time);
            this.table.tHead.removeChildren();
            this.tbody.removeChildren();
            callback(this);
        }, 200);
    }

    private calendarDay(self?) {
        if (!self) self = this;
        self.title.textContent = self.data.month.text + ' ' + self.data.year;
        /*
        * add event to change view type by months.
        */
        self.title.onclick = (e) => {
            e.preventDefault();
            self.displayDate.setDate(1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationUp);
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            self.displayDate.setDate(1);
            self.displayDate.previousMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationBack);
        }
        self.btnCurrent.onclick = () => {
            /*
            * If not is the current month,
            * go to current month.
            */
            var dMonth = self.displayDate.getMonth();
            var month = self.today.getMonth();
            if (!(dMonth === month && self.today.getFullYear() === self.displayDate.getFullYear())) {
                self.displayDate = self.today.clone();
                self.displayDate.setDate(1);
                self.dataDay();
                self.clearTable(self.calendarDay, self.animationUp);
            }
        }
        self.btnNext.onclick = () => {
            self.displayDate.setDate(1);
            self.displayDate.nextMonth();
            self.dataDay();
            self.clearTable(self.calendarDay, self.animationNext);
        }
        self.loadLegendMatchMedia();
        /*
         * Create the days of previous month, current month and next month,
         * with a total of 42 days
         */
        var mod = 1;
        var axuTr = document.createElement('tr');
        var currentDay = self.data.currentDay;
        for (var j = 0; j < 42; j++) {
            var item = self.data.items[j];
            var day = item.day;
            var td = document.createElement('td');
            /*
            * If the day not for the current month,
            * make the text clearer
            */
            if (item.previousDay || item.nextDay) {
                td.className = 'text-muted';
            }
            /*
            * If the day is the current day,
            * make the background darker
            */
            if (item.currentDay && day === currentDay) {
                td.className = 'bg-primary';
                self.selectedCell = td;
            }
            /*
            * Add event, if  is input option 
            * then change self value for the selected date.                
            */

            td.onclick = function () {
                self.selectCell(this);
                if (this.classList.contains('text-muted')) {     //no is current month
                    if (this.textContent > 20) {                   //is previous month	                      
                        self.displayDate.setDate(1);
                        self.displayDate.previousMonth();
                        self.dataDay();
                        self.displayDate.setDate(this.textContent);
                        self.data.currentDay = self.displayDate.getDate();
                        self.clearTable(self.calendarDay, self.animationBack);
                    } else {                                    //is next month	                      
                        self.displayDate.setDate(1);
                        self.displayDate.nextMonth();
                        self.dataDay();
                        self.displayDate.setDate(this.textContent);
                        self.data.currentDay = self.displayDate.getDate();
                        self.clearTable(self.calendarDay, self.animationNext);
                    }
                }
                if (self.options && self.options.isInput) {
                    self.displayDate.setDate(this.textContent);
                    var tmpInput = self.options.input;
                    tmpInput.value = self.displayDate.format(tmpInput.dataset.date);
                    tmpInput.onchange();
                    tmpInput.onblur();
                    self.close();
                }
            }
            td.textContent = day;
            axuTr.appendChild(td);
            /*
            * If mod is greater than zero and is module of 7,
            * is because will start other week on the calendar
            */
            if (mod > 1 && mod % 7 === 0) {
                self.tbody.appendChild(axuTr);
                axuTr = document.createElement('tr');
            }
            mod++;
        }
    }
    /*
    * Load the legend of the days of week
    */
    private loadLegend(array) {
        if (this.type === ETypeCalendar.DAY) {
            if (this.legend) this.legend.removeChildren();
            this.legend = document.createElement('tr');
            this.table.tHead.appendChild(this.legend);
            for (var i = 0; i < 7; i++) {
                var th = document.createElement('th');
                th.textContent = array[i];
                this.legend.appendChild(th);
            }
        }
    }

    private calendarMonth(self?) {
        if (!self) self = this;
        self.title.text = self.data.year;
        /*
        * add event to change view type by range years.
        */
        self.title.onclick = (e) => {
            e.preventDefault();
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationUp);
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            var year = self.displayDate.getFullYear() - 1;
            if (year > self.yearGregorian) {
                self.displayDate = new Date(year, 0, 1);
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationBack);
            }
        }
        self.btnCurrent.onclick = () => {
            /*
            * If not is the current year,
            * go to current year.
            */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationUp);
            }
        }
        self.btnNext.onclick = () => {
            self.displayDate = new Date(self.displayDate.getFullYear() + 1, 0, 1);
            self.dataMonth();
            self.clearTable(self.calendarMonth, self.animationNext);
        }

            /*
            * Create all months of a year.            
            */
            var tr = document.createElement('tr');
        var mod = 1;
        var currentMonth = self.data.currentMonth;
        for (var j = 0; j < 12; j++) {
            var td = document.createElement('td');
            /*
            * If the j is the current day,
            * make the background darker.
            */
            if (j === currentMonth) {
                td.className = 'bg-primary';
            }
            td.textContent = self.abbMonths[j];
            tr.appendChild(td);
            /*
            * add event to go to month selected.
            */
            td.onclick = function () {
                self.displayDate.setMonth(self.abbMonths.indexOf(this.textContent));
                self.displayDate.setDate(1);
                self.dataDay();
                self.clearTable(self.calendarDay, self.animationDown);
            }
                /*
                * If mod is greater than zero and is module of 3,
                * add new row.
                */
                if (mod > 1 && mod % 3 === 0) {
                self.tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
            mod++;
        }

    }


    private calendarYear(self?) {
        if (!self) self = this;
        self.title.text = self.data.range;
        self.title.onclick = (e) => {
            e.preventDefault();
        }
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = () => {
            var year = self.displayDate.getFullYear() - 12;
            if (year <= self.yearGregorian) {
                year = self.yearGregorian;
            }
            self.displayDate = new Date(year, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationBack);
        }
        self.btnCurrent.onclick = () => {
            /*
           * If not is the current year,
           * go to current range year.
           */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataYear();
                self.clearTable(self.calendarYear, self.animationUp);
            }
        }
        self.btnNext.onclick = () => {
            self.displayDate = new Date(self.displayDate.getFullYear() + 12, 0, 1);
            self.dataYear();
            self.clearTable(self.calendarYear, self.animationNext);
        }

            /*
            * Create range year.            
            */
            var tr = document.createElement('tr');
        var mod = 1;
        var year = self.data.year;
        var currentYear = self.data.currentYear;
        for (var j = 0; j < 12; j++) {
            var td = document.createElement('td');
            /*
            * If the j is the current day,
            * make the background darker.
            */
            if (year === currentYear) {
                td.className = 'bg-primary';
            }
            td.textContent = (year++).toString();
            tr.appendChild(td);
            /*
            * add event to go to year selected.
            */

            td.onclick = function () {
                self.displayDate.setFullYear(this.textContent);
                self.dataMonth();
                self.clearTable(self.calendarMonth, self.animationDown);
            }
                /*
                * If mod is greater than zero and is module of 3,
                * add new row.
                */
                if (mod > 1 && mod % 3 === 0) {
                self.tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
            mod++;
        }
    }

    private setOptions() {
        if (this.options) {
            if (this.options.isInput) {
                this.element.className = 'hidden ui-calendar-input';
            }
        }
    }

    private displayDateFromValue() {
        if (this.options && this.options.isInput) {
            var input = this.options.input;
            var value = input.value;
            if (!value.isEmpty()) {
                this.displayDate = new Date().parse(value, input.dataset.date);
                this.displayDate = this.displayDate.isValid() ? this.displayDate : new Date();
                var col = this.displayDate.getDay();
                var row = this.displayDate.getWeekOfMonth();
                this.displayDate.setDate(1);
                this.dataDay();
                this.clearTable(this.calendarDay, this.animationUp);
                var cell = this.table.rows[row].cells[col];
                this.selectCell(cell);
            }
        }
    }

    private selectCell(cell: HTMLElement) {
        this.selectedCell.classList.remove('bg-primary');
        cell.classList.add('bg-primary');
        this.selectedCell = cell;
    }

    /* JavaScript Media Queries */
    private mediaQuery() {
        if (matchMedia) {
            var mq = window.matchMedia("(max-width: 969px)");
            var self = this;
            mq.addListener(function () {
                if (mq.matches) {
                    self.loadLegend(self.abbDays);
                } else {
                    self.loadLegend(self.days);
                }
            });
        }
    }

    private loadLegendMatchMedia() {
        var mq = window.matchMedia("(max-width: 969px)");
        if (mq.matches) {
            this.loadLegend(this.abbDays);
        } else {
            this.loadLegend(this.days);
        }
    }

    public refresh() {
        this.dataDay();
        this.clearTable(this.calendarDay, this.animationUp);
    }

    public open(callback?) {
        this.element.classList.remove('hidden');
        this.element.classList.add(this.animationIn.type);
        this.element.classList.add(this.animationIn.fn);
        this.element.classList.add(this.animationIn.time);
        setTimeout(() => {
            this.element.classList.remove(this.animationIn.type);
            this.element.classList.remove(this.animationIn.fn);
            this.element.classList.remove(this.animationIn.time);
            this.displayDateFromValue();
            if (callback) callback();
        }, 500);
    }

    public close(callback?) {
        this.element.classList.add(this.animationOut.type);
        this.element.classList.add(this.animationOut.fn);
        this.element.classList.add(this.animationOut.time);
        setTimeout(() => {
            this.element.classList.remove(this.animationOut.type);
            this.element.classList.remove(this.animationOut.fn);
            this.element.classList.remove(this.animationOut.time);
            this.element.classList.add('hidden');
            if (callback) callback();
        }, 500);
    }

    public isOpen() {
        return !this.element.classList.contains('hidden');
    }

    public getDate() {
        this.displayDate.setDate(this.selectedCell.textContent);
        return this.displayDate;
    }

    public setAnimationIn(animationFn) {
        this.animationIn.fn = animationFn;
    }

    public setAnimationOut(animationFn) {
        this.animationOut.fn = animationFn;
    }

    public setLegendDaysWeek(strDays: string) {
        this.days = strDays.split(',');
        this.abbDays = new Array();
        var i = 0;
        while (i < 7) {
            this.abbDays.push(this.days[i].charAt(0));
            i++;
        }
    }

    public setLegendMonths(strMonths: string) {
        var months = strMonths.split(',');
        //@overwrite Date.getMonthName()
        Date.prototype.getMonthName = function () {
            var month_names = months;
            return month_names[this.getMonth()];
        }
        var i = 0;
        this.abbMonths = new Array();
        while (i < 12) {
            this.abbMonths.push(months[i].substring(0, 3));
            i++;
        }
        var mAbbrs = this.abbMonths;
        //@overwrite Date.getMonthAbbr()
        Date.prototype.getMonthAbbr = function () {
            var month_abbrs = mAbbrs;
            return month_abbrs[this.getMonth()];
        }
    }

}

enum ETypeSelect {
    SIMPLE,
    ICON,
    IMAGE
}

class State {
    public old = null;
    public current = null;

    constructor(old?, current?) {
        if (old) this.old = old;
        if (current) this.current = current;
    }

    public exchange(value) {
        this.old = this.current;
        this.current = value;
    }
}

class Select {

    private formGroup = document.createElement('div');
    private hidden = document.createElement('input');
    private input: any = document.createElement('input');
    private mask = document.createElement('div');
    private ico = document.createElement('i');
    private icoItem: HTMLElement;
    private imgItem: HTMLImageElement;
    private items = document.createElement('ul');
    private element: HTMLElement = null;
    private open = false;
    private disabled = false;
    private readOnly = false;
    private data: Array<any> = null;
    private length = 0;
    private icono = 'fa-angle-down';
    private animaIn: Animation;
    private animaOut: Animation;
    private type = ETypeSelect.SIMPLE;
    private options = null;
    private itemSate: State;
    private itemIconState: State;
    private itemImageState: State;

    constructor(htmlElement: HTMLElement, data, options) {
        this.element = htmlElement;
        this.data = data;
        if (options) this.setOptions(options);
        this.animaIn = new Animation('ui-ease-in', 'ui-0-2s', 'ui-fade-in-down', 200);
        this.animaOut = new Animation('ui-ease-out', 'ui-0-2s', 'ui-fade-out-up', 200);
        this.itemSate = new State();
        this.formGroup.className = 'form-group  has-feedback';
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name')) this.hidden.name = this.element.getAttribute('data-name');
        this.formGroup.appendChild(this.hidden);
        this.input.type = 'text';
        this.input.className = 'form-control';
        this.input.onchange = () => { return true; }
        this.input.onkeyup = (e) => {
            if (e) {
                if (e.keyCode == 13) this.toggle();
                if (e.keyCode == 38) this.previous();
                if (e.keyCode == 40) this.next();
            }
        };
        this.input.onkeydown = (e) => {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 &&
                    e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.formGroup.appendChild(this.input);
        this.mask.className = 'ui-mask';
        this.mask.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.formGroup.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.formGroup.appendChild(this.ico);
        this.element.appendChild(this.formGroup);
        this.items.className = 'ui-select-items';
        this.element.appendChild(this.items);
        this.config();
        this.fill();
    }

    private setOptions(options) {
        this.options = options;
        if (options.icon) {
            this.type = ETypeSelect.ICON;
            this.itemIconState = new State();
        } else if (options.image) {
            this.type = ETypeSelect.IMAGE;
            this.itemImageState = new State();
        }
    }

    private config(clear?) {
        switch (this.type) {
            case ETypeSelect.ICON:
                if (clear) {
                    this.formGroup.classList.remove('has-ui-icon');
                    this.items.classList.remove('fa-lu');
                    this.formGroup.removeChild(this.icoItem);
                    this.icoItem = null;
                } else {
                    this.formGroup.classList.add('has-ui-icon');
                    this.items.classList.add('fa-lu');
                    this.icoItem = document.createElement('i');
                    this.icoItem.className = 'form-control-ui-icon fa';
                    this.formGroup.appendChild(this.icoItem);
                }

                break;
            case ETypeSelect.IMAGE:
                if (clear) {
                    this.formGroup.classList.remove('has-ui-image');
                    this.items.classList.remove('ui-image-lu');
                    this.formGroup.removeChild(this.imgItem);
                    this.imgItem = null;
                } else {
                    this.formGroup.classList.add('has-ui-image');
                    this.items.classList.add('ui-image-lu');
                    this.imgItem = document.createElement('img');
                    this.imgItem.className = 'form-control-ui-image';
                    this.formGroup.appendChild(this.imgItem);
                }
                break;
        }
    }

    private fill() {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            if (item.icon) this.addIcon(li, item.icon);
            else if (item.image) this.addImage(li, item.image);
            li.appendChild(document.createTextNode(item.value));
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            }
            li.onkeyup = function (e) {
                if (e) {
                    if (e.keyCode == 13) {
                        self.changeValue(self.itemSate.current);
                        self.toggle();
                    }
                    if (e.keyCode == 38) {
                        self.previous();
                    }
                    if (e.keyCode == 40) {
                        self.next();
                    }
                }
            }
           this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    }

    private addIcon(element: HTMLElement, classIcon: string) {
        var tmpIcon = document.createElement('i');
        tmpIcon.className = 'fa fa-li';
        tmpIcon.classList.add(classIcon);
        element.appendChild(tmpIcon);
    }

    private addImage(element: HTMLElement, src: string) {
        var tmpImg = document.createElement('img');
        tmpImg.className = 'ui-image-item';
        tmpImg.src = src;
        element.appendChild(tmpImg);
    }

    private animationIn() {
        this.items.classList.add('open');
        this.animaIn.run(this.items);
    }

    private animationOut() {
        this.animaOut.run(this.items, () => {
            this.items.classList.remove('open');
        });
    }

    private changeValue(htmlElement: HTMLElement) {
        this.itemSate.exchange(htmlElement);
        this.input.value = this.itemSate.current.textContent;
        this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.input.onchange();
        this.itemSate.old.classList.remove('bg-primary');
        this.itemSate.current.classList.add('bg-primary');
        if (this.isTypeIcon()) {
            this.changeIconItem();
        } else if (this.isTypeImage()) {
            this.changeImageItem();
        }
        this.input.focus();
    }

    private changeIconItem() {
        this.itemIconState.exchange(this.getIconItem());
        this.icoItem.classList.remove(this.itemIconState.old);
        this.icoItem.classList.add(this.itemIconState.current);
    }

    private changeImageItem() {
        this.itemImageState.exchange(this.getImageItem());
        this.imgItem.src = this.itemImageState.current;
    }

    private next() {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.nextElementSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    private previous() {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.previousSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    private isTypeIcon() {
        return this.type === ETypeSelect.ICON;
    }

    private isTypeImage() {
        return this.type === ETypeSelect.IMAGE;
    }

    private isTypeSimple() {
        return this.type === ETypeSelect.SIMPLE;
    }

    public toggle() {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            } else {
                Select.clear();
                this.animationIn();
                this.open = true;
                if (!this.itemSate.current) {
                    this.itemSate.current = this.items.getElementsByTagName('li')[0];
                    this.itemSate.current.classList.add('bg-primary');
                }
                this.itemSate.current.focus();
                this.input.focus();
            }
        }
    }

    public selectItem(option) {
        if (!this.disabled && !this.readOnly) {
            var lis = this.items.getElementsByTagName('li');
            if (this.length > 0) {
                var found = false;
                var i = 0;
                do {
                    var item = lis[i];
                    i++;
                    if (item.getAttribute('data-option') == option) {
                        this.itemSate.exchange(item);
                        found = true;
                    }
                } while (!found && i < this.length);
                if (found) {
                    this.input.value = this.itemSate.current.textContent;
                    this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
                    this.hidden.value = this.input.value;
                    if (this.isTypeIcon()) {
                        this.changeIconItem();
                    } else if (this.isTypeImage()) {
                        this.changeImageItem();
                    }
                    this.itemSate.current.focus();
                    if (this.itemSate.old) this.itemSate.old.classList.remove('bg-primary');
                    this.itemSate.current.classList.add('bg-primary');
                }
            }
        }
    }

    public addItem(option, value, args) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            if (args) {
                if (args.icon && this.isTypeIcon()) {
                    this.addIcon(li, args.icon);
                } else if (args.image && this.isTypeImage()) {
                    this.addImage(li, args.image);
                }
            }            
            li.appendChild(document.createTextNode(value));
            li.tabIndex = this.length + 1;
            li.setAttribute('data-option', option);
            this.input.setAttribute('data-option', option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            }

            this.items.appendChild(li);
            this.length++;
        }
    }

    public getItem() {
        if (!this.disabled && !this.readOnly) {
            if (this.isTypeIcon()) {
                var tmpIcon: any = this.itemSate.current.getElementsByClassName('fa')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    icon: tmpIcon.classList.item(2)
                };
            } else if (this.isTypeImage()) {
                var tmpImg: any = this.itemSate.current.getElementsByClassName('ui-image-item')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    image: tmpImg.src
                };
            } else {
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option')
                };
            }
        }
    }

    public getValue() {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    }

    public getOption() {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    }

    public isOpen() {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    }

    /**
    * get Icon Item Class
    * @returns {string} class Icon
    * @method getIconItem
    */
    public getIconItem() {
        if (!this.disabled && !this.readOnly) {
            var tmpIcon: any = this.itemSate.current.getElementsByClassName('fa')[0];
            return tmpIcon.classList.item(2);
        }
    }

    /**
    * get Image Item src
    * @returns {string} src
    * @method getImageItem
    */
    public getImageItem() {
        if (!this.disabled && !this.readOnly) {
            var tmpImg: any = this.itemSate.current.getElementsByClassName('ui-image-item')[0];
            return tmpImg.src;
        }
    }
    /**
    * set Data
    * @param {[JSON]} data
    * @param {JSON} options
    * @method setDate
    */
    public setData(data, options) {
        if (!this.disabled && !this.readOnly) {
            /**
            * Clear
            */
            this.clearData();
            /**
            * Load
            */
            this.data = data;
            if (options) this.setOptions(options);
            this.config();
            this.fill();
        }
    }

    public isDisabled() {
        return this.disabled;
    }

    public setDisabled(disabled: boolean) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        } else {
            this.element.classList.remove('disabled');
        }
    }

    public isReadOnly() {
        return this.readOnly;
    }

    public setReadOnly(readOnly: boolean) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        } else {
            this.element.classList.remove('read-only');
        }
    }

    public setHeight(height: string) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    }

    public getSize() {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    }

    public setIcono(icono: string) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    }

    public focus() {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    }

    public loading() {        
        if (this.ico.classList.contains(this.icono)) this.ico.classList.remove(this.icono);                    
        if (!this.ico.classList.contains('fa-spinner')) this.ico.classList.add('fa-spinner');
        if (!this.ico.classList.contains('fa-spin')) this.ico.classList.add('fa-spin');
        this.setDisabled(true);
    }

    public complete() {
        if (this.ico.classList.contains('fa-spinner')) this.ico.classList.remove('fa-spinner');
        if (this.ico.classList.contains('fa-spin')) this.ico.classList.remove('fa-spin');
        if (!this.ico.classList.contains(this.icono)) this.ico.classList.add(this.icono);
        this.setDisabled(false);
    }

    public clearData() {
        this.config(true);
        this.hidden.value = '';
        this.input.value = '';
        this.input.removeAttribute('data-option');
        this.items.innerHTML = '';
    }

    public onchange(callback) {
        this.input.onchange = callback;
    }

    public static clear() {
        var selects = document.getElementsByClassName('ui-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = <HTMLElement> selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items) {
                    if (items.classList.contains('open')) {
                        items.classList.add('ui-ease-out');
                        items.classList.add('ui-0-2s');
                        items.classList.add('ui-fade-out-up');
                        (function (items) {
                            setTimeout(() => {
                                items.classList.remove('ui-ease-out');
                                items.classList.remove('ui-0-2s');
                                items.classList.remove('ui-fade-out-up');
                                items.classList.remove('open');
                            }, 200);
                        })(items);
                    }
                }
            }
        }
    }
}


class Alert {

    private element: HTMLElement = null;
    private button = document.createElement('button');
    private span = document.createElement('span');
    private p = document.createElement('p');
    private i = document.createElement('i');
    private strong = document.createElement('strong');
    public icoSuccess = 'fa-check';
    public icoInfo = 'fa-info';
    public icoWarning = 'fa-exclamation-triangle';
    public icoDanger = 'fa-times';
    public icoWait = 'fa-circle-o-notch';
    public animationIn = 'ui-fade-in';
    public animationOut = 'ui-fade-out';
    public typeAnimation = 'ui-ease-in-out';
    private type = 'close';
    private durationAnimation = 'ui-1s';

    constructor(htmlElement: HTMLElement) {
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
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

    public close() {
        if (this.type !== 'close') {
            switch (this.type) {
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
            setTimeout(function () { self.element.classList.add('hidden') }, 1000);
        }
    }

    public success(message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';

    }

    public info(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();

    }

    public warning(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    }

    public danger(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    }

    public wait(message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    }

    private addAnimation() {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    }

    private removeAnimation() {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    }
}

class Toggle {

    static init() {
        this.initNavBar();
        this.initDropDown();
    }

    private static initNavBar() {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {

            for (var i = 0; i < n; i++) {
                var element: any = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                }
	         }
        }
    }

    private static initDropDown() {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element: any = dropdownsToggle[i];
                element.onclick = function (e) {
                    var dropdown = this.parentNode;
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    if (dropdown.classList.contains('open')) {
                        dropdownMenu.classList.add('ui-ease');
                        dropdownMenu.classList.add('ui-0-5s');
                        dropdownMenu.classList.add('ui-fade-out-up');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('ui-ease');
                            dropdownMenu.classList.remove('ui-0-5s');
                            dropdownMenu.classList.remove('ui-fade-out-up');
                            dropdown.classList.remove('open');
                        }, 500);
                    } else {
                        dropdown.classList.add('open');
                        dropdownMenu.classList.add('ui-ease');
                        dropdownMenu.classList.add('ui-0-5s');
                        dropdownMenu.classList.add('ui-fade-in-down');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('ui-ease');
                            dropdownMenu.classList.remove('ui-0-5s');
                            dropdownMenu.classList.remove('ui-fade-in-down');
                        }, 500);
                    }
                    e.stopPropagation();
                    return false;
                }
	         }
        }
    }

    static clearDropDown() {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var dropdown: any = dropdownsToggle[i].parentNode;
                if (dropdown.classList.contains('open')) {
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    dropdownMenu.classList.add('ui-ease');
                    dropdownMenu.classList.add('ui-0-5s');
                    dropdownMenu.classList.add('ui-fade-out-up');
                    setTimeout(function () {
                        dropdownMenu.classList.remove('ui-ease');
                        dropdownMenu.classList.remove('ui-0-5s');
                        dropdownMenu.classList.remove('ui-fade-out-up');
                        dropdown.classList.remove('open');
                    }, 500);
                }
            }
        }
    }
}

enum EHttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
enum EReadyStateStatus {
    UNINITIALIZED= 0,
    LOADING = 1,
    LOADED = 2,
    INTERACTIVE= 3,
    COMPLETED =4
}
class Http {    

    static get(action, onBeforeSend, onReady, onError?) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend) onBeforeSend();
            if (this.readyState === EReadyStateStatus.COMPLETED) {
                if (this.status === EHttpStatus.OK) {
                   if(onReady) onReady(this);
                } else {
                   if (onerror) onError();
                }
            }
        }
        xhr.open('GET', action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send();
    }

    static post(data, action, onBeforeSend, onReady, onError?) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend) onBeforeSend();
            if (this.readyState === EReadyStateStatus.COMPLETED) {
                if (this.status === EHttpStatus.OK) {
                    if (onReady) onReady(this);
                } else {
                    if (onerror) onError();
                }
            }
        }
        xhr.open('POST', action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send(data);
    }

    static sendJSON(data, action, onBeforeSend, onReady, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend) onBeforeSend();
            if (this.readyState === EReadyStateStatus.COMPLETED) {
                if (this.status === EHttpStatus.OK) {
                    if (onReady) onReady(this);
                } else {
                    if (onerror) onError();
                }
            }
        }
        xhr.open('POST', action);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
    }

    static put() {
    }

    static delete() {
    }
}

class Utils {

    static showActiveLink(element) {
        var anchors = element.querySelectorAll('.ui-link');
        var n = anchors.length;
        var url: any = window.location.pathname;
        url = url.replace(/\//g, '');
        for (var i = 0; i < n; i++) {
            var a = anchors[i];
            var href = a.href.split('/');
            href = href[href.length - 1];
            if (a.classList.contains('active')) {
                a.parentNode.classList.add('remove');
            }
            if (href === url) {
                a.parentNode.classList.add('active');
            }
        }
    }

    static reloadCSS(element, href) {
        var queryString = '?reload=' + new Date().getTime();
        element.href = href.replace(/\?.*|$/, queryString);
    }
    
    static serialize(form){
    	var elems = form.elements;
		var serialized = [];		
		var n= elems.length;
		for (var i = 0; i < n; i ++) {
			var element = elems[i];
			var type = element.type;			
			var value = element.value;
			var name = element.name;			
			if(name !== null || name !== undefined || name !== ""){
				switch (type) {
				case 'text':
				case 'radio':
				case 'checkbox':					            
	    	    case 'search':
	    	    case 'email':
	    	    case 'url':
	    	    case 'tel':
	    	    case 'number':
	    	    case 'range':
	    	    case 'date':
	    	    case 'month':
	    	    case 'week':
	    	    case 'time':
	    	    case 'datetime':
	    	    case 'datetime-local':
	    	    case 'color':
	    	    case 'textarea':
	    	    case 'password':
	    	    case 'select':   
				case 'hidden':	
					serialized.push(name+'='+value);
					break;
				default:
					break;
				}
			}
		}
		return serialized.join('&');
    }
}


window.onload = function () {
    Toggle.init();    
    
}

document.onclick = function () {
    Toggle.clearDropDown();
    Select.clear();
}

interface Date {
    getMonthName(): string;
    getMonthAbbr(): string;
    getDayFull(): string;
    getDayAbbr(): string;
    getDayOfYear(): number;
    getDaySuffix(): string;
    getWeekOfYear(): number;
    getWeekOfMonth(): number;
    isLeapYear(): boolean;
    getMonthDayCount(): number;
    previousMonth();
    nextMonth();
    clone(): Date;
    isValid(): boolean;
    format(format): string;
    parse(strDate, pattern): Date;
}
/*
* Return name of month
*/
Date.prototype.getMonthName = function () {
    var month_names = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return month_names[this.getMonth()];
}
/*
* Return month abbreviation
*/
Date.prototype.getMonthAbbr = function () {
    var month_abbrs = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    return month_abbrs[this.getMonth()];
}
/*
* Return full day of week name
*/
Date.prototype.getDayFull = function () {
    var days_full = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    return days_full[this.getDay()];
};

/*
*  Return full day of week name
*/
Date.prototype.getDayAbbr = function () {
    var days_abbr = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    return days_abbr[this.getDay()];
};
/*
* Return the day of year 1-365
*/
Date.prototype.getDayOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this.getTime() - onejan.getTime()) / 86400000);
};
/*
* Return the day suffix (st,nd,rd,th)
*/
Date.prototype.getDaySuffix = function () {
    var d = this.getDate();
    var sfx = ["th", "st", "nd", "rd"];
    var val = d % 100;
    return (sfx[(val - 20) % 10] || sfx[val] || sfx[0]);
};
/*
* Return Week of Year
*/
Date.prototype.getWeekOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
}
/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
}

/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
}
/*
* Return Number of Days in a given month
*/
Date.prototype.getMonthDayCount = function () {
    var month_day_counts = [
        31,
        this.isLeapYear() ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    return month_day_counts[this.getMonth()];
}
/*
* back a month 
*/
Date.prototype.previousMonth = function () {
    var month = this.getMonth() - 1;
    var year = this.getFullYear();
    if (month < 0 && year > 1582) {
        month = 11;
        year--;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
}
/*
* next an month 
*/
Date.prototype.nextMonth = function () {
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    if (month > 11) {
        month = 0;
        year++;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
}
/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}
/*
 * returns true if the date is valid
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
}
/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(),
        month = this.getMonth(),
        hours = this.getHours(),
        minutes = this.getMinutes(),
        seconds = this.getSeconds();
    /*
    * get all date properties
    * ( based on PHP date object functionality )
    */
    var date_props = {
        d: date < 10 ? '0' + date : date,
        D: this.getDayAbbr(),
        j: this.getDate(),
        l: this.getDayFull(),
        S: this.getDaySuffix(),
        w: this.getDay(),
        z: this.getDayOfYear(),
        W: this.getWeekOfYear(),
        F: this.getMonthName(),
        m: month < 9 ? '0' + (month + 1) : month + 1,
        M: this.getMonthAbbr(),
        n: month + 1,
        t: this.getMonthDayCount(),
        L: this.isLeapYear() ? '1' : '0',
        Y: this.getFullYear(),
        y: this.getFullYear() + ''.substring(2, 4),
        a: hours > 12 ? 'pm' : 'am',
        A: hours > 12 ? 'PM' : 'AM',
        g: hours % 12 > 0 ? hours % 12 : 12,
        G: hours > 0 ? hours : "12",
        h: hours % 12 > 0 ? hours % 12 : 12,
        H: hours,
        i: minutes < 10 ? '0' + minutes : minutes,
        s: seconds < 10 ? '0' + seconds : seconds
    };
    /*
    * loop through format array of characters and add matching data 
    * else add the format character (:,/, etc.)
    */
    var date_string = "";
    var n = dateFormat.length;
    for (var i = 0; i < n; i++) {
        var f = dateFormat[i];
        if (f.match(/[a-zA-Z]/g)) {
            date_string += date_props[f] ? date_props[f] : '';
        } else {
            date_string += f;
        }
    }

    return date_string;
};
/*
* parse string date to object Date
* @param string date
* @param string pattern formmat
* @returns object Date
*/
Date.prototype.parse = function (dateString, pattern) {
    /*
    * break apart format string into array paralel of characters
    */
    dateString = dateString.split(/\W/);
    var pattern = pattern.split(/\W/);
    var n = pattern.length;
    var date = new Date();
    for (var i = 0; i < n; i++) {
        var str = pattern[i];
        switch (str) {
            case 'd':
            case 'j':
                date.setDate(dateString[i]);
                break;
            case 'm':
            case 'n':
                date.setMonth(dateString[i] - 1);
                break;
            case 'F':
                var monthNames = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];
                date.setMonth(monthNames.indexOf(dateString[i]));
                break;
            case 'M':
                var monthAbbrs = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                date.setMonth(monthAbbrs.indexOf(dateString[i]));
                break;
            case 'Y':
                date.setFullYear(dateString[i]);
                break;
        }
    }
    return date;
};

interface Element {
    removeChildren();
}
Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
}


var author = 'Yonatan Alexis Quintero Rodriguez';
var version = '0.1';
