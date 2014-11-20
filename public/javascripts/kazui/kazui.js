/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
var Animation = (function () {
    function Animation(type, fn, time) {
        this.type = type;
        this.fn = fn;
        this.time = time;
    }
    return Animation;
})();
var Calendar = (function () {
    function Calendar(element, options) {
        this.days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
        this.abbDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.abbMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.yearGregorian = 1582;
        this.today = new Date();
        this.element = element;
        this.options = options;
        this.animationOut = new Animation('ui-ease', 'ui-flip-out-y', 'ui-0-2s');
        this.setOptions();
        this.displayDate = this.today.clone();
        this.displayDate.setDate(1);
        this.data = {};
        this.dataDay();
        this.createCalendar();
        this.calendarDay();
        this.mediaQuery();
    }
    Calendar.prototype.dataDay = function () {
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
        var day = 0; //The day to display on the calendar.
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
            if (day > 30)
                day--;
            isPreviousDay = true;
            isCurrentDay = false;
        }
        for (var i = 0; i < 42; i++) {
            var item = {};
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
            }
            else if (isCurrentDay) {
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
            }
            else {
                item.nextDay = true;
            }
            this.data.items.push(item);
        }
    };
    Calendar.prototype.dataMonth = function () {
        var year = this.displayDate.getFullYear();
        this.data.year = year;
        this.data.currentMonth = year === this.today.getFullYear() ? this.today.getMonth() : 0;
    };
    Calendar.prototype.dataYear = function () {
        var year = this.displayDate.getFullYear();
        var limitYear = year + 11;
        this.data.year = year;
        this.data.currentYear = year <= this.today.getFullYear() && limitYear >= this.today.getFullYear() ? this.today.getFullYear() : year;
        this.data.range = year + ' - ' + limitYear;
    };
    Calendar.prototype.createCalendar = function () {
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
    };
    /*
     * Create calendar header HTML.
     * @returns HTMLElement
     */
    Calendar.prototype.header = function () {
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
    };
    /*
    *Create calendar body HTML.
    *@returns HTMLElement
    */
    Calendar.prototype.body = function () {
        var row = document.createElement('div');
        row.className = 'row';
        var col = document.createElement('div');
        col.className = 'col-sm-12';
        var panelDefault = document.createElement('div');
        panelDefault.className = 'ui-calendar panel panel-default';
        this.panelBody = document.createElement('div');
        this.panelBody.className = 'panel-body';
        this.contentTable = document.createElement('div');
        this.contentTable.className = 'ui-calendar-content-table';
        /*
        * Create the table
        */
        this.table = document.createElement('table');
        this.table.className = 'table table-condensed';
        var thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.table.appendChild(thead);
        this.table.appendChild(this.tbody);
        this.contentTable.appendChild(this.table);
        this.panelBody.appendChild(this.contentTable);
        panelDefault.appendChild(this.panelBody);
        col.appendChild(panelDefault);
        row.appendChild(col);
        return row;
    };
    Calendar.prototype.clearTable = function (callback) {
        var oldTable = this.table.cloneNode(true);
        var oldContent = document.createElement('div');
        oldContent.className = 'ui-calendar-content-table';
        oldContent.appendChild(oldTable);
        this.panelBody.insertBefore(oldContent, this.panelBody.childNodes[0]);
        this.table.tHead.removeChildren();
        this.tbody.removeChildren();
        callback(this);
        oldContent.classList.add(this.animationOut.type);
        oldContent.classList.add(this.animationOut.fn);
        oldContent.classList.add(this.animationOut.time);
        // this.table.classList.add('ui-below');
        var self = this;
        setTimeout(function () {
            oldContent.classList.remove(self.animationOut.type);
            oldContent.classList.remove(self.animationOut.fn);
            oldContent.classList.remove(self.animationOut.time);
            //this.table.classList.remove('ui-below');  
            //oldTable.tHead.removeChildren();   
            // oldContent.removeChildren();
            // callback(this);
        }, 200);
    };
    Calendar.prototype.calendarDay = function (self) {
        if (!self)
            self = this;
        self.title.textContent = self.data.month.text + ' ' + self.data.year;
        /*
        * add event to change view type by months.
        */
        self.title.onclick = function (e) {
            e.preventDefault();
            self.displayDate.setDate(1);
            self.dataMonth();
            self.clearTable(self.calendarMonth);
        };
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = function () {
            self.displayDate.setDate(1);
            self.displayDate.previousMonth();
            self.dataDay();
            //self.clearTable();
            self.calendarDay();
        };
        self.btnCurrent.onclick = function () {
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
                //self.clearTable();
                self.calendarDay();
            }
        };
        self.btnNext.onclick = function () {
            self.displayDate.setDate(1);
            self.displayDate.nextMonth();
            self.dataDay();
            self.clearTable(self.calendarDay);
        };
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
                if (this.options && this.options.isInput) {
                    if (this.classList.contains('text-muted')) {
                        if (this.textContent > 20) {
                            this.displayDate.previousMonth();
                        }
                        else {
                            this.displayDate.nextMonth();
                        }
                    }
                    this.displayDate.setDate(this.textContent);
                    var tmpInput = this.options.input;
                    tmpInput.value = this.displayDate.format(tmpInput.dataset.date);
                    tmpInput.onchange();
                    tmpInput.onblur();
                    self.close();
                }
            };
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
    };
    /*
    * Load the legend of the days of week
    */
    Calendar.prototype.loadLegend = function (array) {
        if (this.legend)
            this.legend.removeChildren();
        this.legend = document.createElement('tr');
        this.table.tHead.appendChild(this.legend);
        for (var i = 0; i < 7; i++) {
            var th = document.createElement('th');
            th.textContent = array[i];
            this.legend.appendChild(th);
        }
    };
    Calendar.prototype.calendarMonth = function (self) {
        self.title.text = self.data.year;
        /*
        * add event to change view type by range years.
        */
        self.title.onclick = function (e) {
            e.preventDefault();
            self.dataYear();
            ////self.clearTable();
            self.calendarYear();
        };
        /*
        * add Event to navigation
        */
        self.btnBack.onclick = function () {
            var year = self.displayDate.getFullYear() - 1;
            if (year > self.yearGregorian) {
                self.displayDate = new Date(year, 0, 1);
                self.dataMonth();
                //self.clearTable();
                self.calendarMonth();
            }
        };
        self.btnCurrent.onclick = function () {
            /*
            * If not is the current year,
            * go to current year.
            */
            if (self.displayDate.getFullYear() !== self.today.getFullYear()) {
                self.displayDate = self.today.clone();
                self.dataMonth();
                //self.clearTable();
                self.calendarMonth();
            }
        };
        self.btnNext.onclick = function () {
            self.displayDate = new Date(self.displayDate.getFullYear() + 1, 0, 1);
            self.dataMonth();
            //self.clearTable();
            self.calendarMonth();
        };
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
                //                    self.clearTable();
                self.calendarDay();
            };
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
    };
    Calendar.prototype.calendarYear = function () {
        var _this = this;
        this.title.text = this.data.range;
        this.title.onclick = function (e) {
            e.preventDefault();
        };
        /*
        * add Event to navigation
        */
        this.btnBack.onclick = function () {
            var year = _this.displayDate.getFullYear() - 12;
            if (year <= _this.yearGregorian) {
                year = _this.yearGregorian;
            }
            _this.displayDate = new Date(year, 0, 1);
            _this.dataYear();
            //this.clearTable();
            _this.calendarYear();
        };
        this.btnCurrent.onclick = function () {
            /*
           * If not is the current year,
           * go to current range year.
           */
            if (_this.displayDate.getFullYear() !== _this.today.getFullYear()) {
                _this.displayDate = _this.today.clone();
                _this.dataYear();
                //this.clearTable();
                _this.calendarYear();
            }
        };
        this.btnNext.onclick = function () {
            _this.displayDate = new Date(_this.displayDate.getFullYear() + 12, 0, 1);
            _this.dataYear();
            //this.clearTable();
            _this.calendarYear();
        };
        /*
        * Create range year.
        */
        var tr = document.createElement('tr');
        var mod = 1;
        var year = this.data.year;
        var currentYear = this.data.currentYear;
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
            var self = this;
            td.onclick = function () {
                self.displayDate.setFullYear(this.textContent);
                self.dataMonth();
                //                    self.clearTable();
                self.calendarMonth();
            };
            /*
            * If mod is greater than zero and is module of 3,
            * add new row.
            */
            if (mod > 1 && mod % 3 === 0) {
                this.tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
            mod++;
        }
    };
    Calendar.prototype.setOptions = function () {
        if (this.options) {
            if (this.options.isInput) {
                this.element.className = 'hidden ui-calendar-input';
            }
        }
    };
    Calendar.prototype.displayDateFromValue = function () {
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
                //this.clearTable();
                this.calendarDay();
                var cell = this.table.rows[row].cells[col];
                this.selectedCell.classList.remove('bg-primary');
                cell.classList.add('bg-primary');
                this.selectedCell = cell;
            }
        }
    };
    /* JavaScript Media Queries */
    Calendar.prototype.mediaQuery = function () {
        if (matchMedia) {
            var mq = window.matchMedia("(max-width: 969px)");
            var self = this;
            mq.addListener(function () {
                if (mq.matches) {
                    self.loadLegend(self.abbDays);
                }
                else {
                    self.loadLegend(self.days);
                }
            });
        }
    };
    Calendar.prototype.loadLegendMatchMedia = function () {
        var mq = window.matchMedia("(max-width: 969px)");
        if (mq.matches) {
            this.loadLegend(this.abbDays);
        }
        else {
            this.loadLegend(this.days);
        }
    };
    Calendar.prototype.open = function (callback) {
        this.element.classList.remove('hidden');
        this.displayDateFromValue();
        if (callback)
            callback();
    };
    Calendar.prototype.close = function (callback) {
        this.element.classList.add('hidden');
        if (callback)
            callback();
    };
    Calendar.prototype.isOpen = function () {
        return !this.element.classList.contains('hidden');
    };
    return Calendar;
})();
var Select = (function () {
    function Select(htmlElement, data) {
        var _this = this;
        this.formGroup = document.createElement('div');
        this.hidden = document.createElement('input');
        this.input = document.createElement('input');
        this.mask = document.createElement('div');
        this.ico = document.createElement('i');
        this.items = document.createElement('ul');
        this.element = null;
        this.oldItem = null;
        this.currentItem = null;
        this.open = false;
        this.disabled = false;
        this.readOnly = false;
        this.data = null;
        this.length = 0;
        this.icono = 'fa-angle-down';
        this.element = htmlElement;
        this.data = data;
        this.formGroup.className = 'form-group  has-feedback';
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name'))
            this.hidden.name = this.element.getAttribute('data-name');
        this.formGroup.appendChild(this.hidden);
        this.input.type = 'text';
        this.input.className = 'form-control';
        this.input.onchange = function () {
            return true;
        };
        this.input.onkeyup = function (e) {
            if (e) {
                if (e.keyCode == 13)
                    _this.toggle();
                if (e.keyCode == 38)
                    _this.previous();
                if (e.keyCode == 40)
                    _this.next();
            }
        };
        this.input.onkeydown = function (e) {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.formGroup.appendChild(this.input);
        this.mask.className = 'ui-mask';
        this.mask.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.formGroup.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.formGroup.appendChild(this.ico);
        this.element.appendChild(this.formGroup);
        this.items.className = 'ui-select-items';
        this.element.appendChild(this.items);
        this.fill();
    }
    Select.prototype.fill = function () {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            li.textContent = item.value;
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            };
            li.onkeyup = function (e) {
                if (e) {
                    if (e.keyCode == 13) {
                        self.changeValue(self.currentItem);
                        self.toggle();
                    }
                    if (e.keyCode == 38) {
                        self.previous();
                    }
                    if (e.keyCode == 40) {
                        self.next();
                    }
                }
            };
            this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    };
    Select.prototype.animationIn = function () {
        var _this = this;
        this.items.classList.add('open');
        this.items.classList.add('ui-ease-in');
        this.items.classList.add('ui-0-2s');
        this.items.classList.add('ui-fade-in-down');
        setTimeout(function () {
            _this.items.classList.remove('ui-ease-in');
            _this.items.classList.remove('ui-0-2s');
            _this.items.classList.remove('ui-fade-in-down');
        }, 200);
    };
    Select.prototype.animationOut = function () {
        var _this = this;
        this.items.classList.add('ui-ease-out');
        this.items.classList.add('ui-0-2s');
        this.items.classList.add('ui-fade-out-up');
        setTimeout(function () {
            _this.items.classList.remove('ui-ease-out');
            _this.items.classList.remove('ui-0-2s');
            _this.items.classList.remove('ui-fade-out-up');
            _this.items.classList.remove('open');
        }, 200);
    };
    Select.prototype.changeValue = function (htmlElement) {
        this.oldItem = this.currentItem;
        this.currentItem = htmlElement;
        this.input.value = this.currentItem.textContent;
        this.input.setAttribute('data-option', this.currentItem.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.input.onchange();
        this.oldItem.classList.remove('bg-primary');
        this.currentItem.classList.add('bg-primary');
        this.input.focus();
    };
    Select.prototype.next = function () {
        if (!this.disabled && !this.readOnly && this.currentItem) {
            var item = this.currentItem.nextElementSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };
    Select.prototype.previous = function () {
        if (!this.disabled && !this.readOnly && this.currentItem) {
            var item = this.currentItem.previousSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };
    Select.prototype.toggle = function () {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            }
            else {
                Select.clear();
                this.animationIn();
                this.open = true;
                if (!this.currentItem) {
                    this.currentItem = this.items.getElementsByTagName('li')[0];
                    this.currentItem.classList.add('bg-primary');
                }
                this.currentItem.focus();
                this.input.focus();
            }
        }
    };
    Select.prototype.selectItem = function (option) {
        if (!this.disabled && !this.readOnly) {
            var lis = this.items.getElementsByTagName('li');
            if (this.length > 0) {
                var found = false;
                var i = 0;
                do {
                    var item = lis[i];
                    i++;
                    if (item.getAttribute('data-option') == option) {
                        this.oldItem = this.currentItem;
                        this.currentItem = item;
                        found = true;
                    }
                } while (!found && i < this.length);
                if (found) {
                    this.input.value = this.currentItem.textContent;
                    this.input.setAttribute('data-option', this.currentItem.getAttribute('data-option'));
                    this.hidden.value = this.input.value;
                    this.currentItem.focus();
                    if (this.oldItem)
                        this.oldItem.classList.remove('bg-primary');
                    this.currentItem.classList.add('bg-primary');
                }
            }
        }
    };
    Select.prototype.addItem = function (option, value) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            li.textContent = value;
            li.tabIndex = this.length + 1;
            li.setAttribute('data-option', option);
            this.input.setAttribute('data-option', option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                e.stopPropagation();
                return false;
            };
            this.items.appendChild(li);
            this.length++;
        }
    };
    Select.prototype.getItem = function () {
        if (!this.disabled && !this.readOnly) {
            return {
                value: this.input.value,
                option: this.input.getAttribute('data-option')
            };
        }
    };
    Select.prototype.getValue = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    };
    Select.prototype.getOption = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    };
    Select.prototype.isOpen = function () {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    };
    Select.prototype.isDisabled = function () {
        return this.disabled;
    };
    Select.prototype.setDisabled = function (disabled) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        }
        else {
            this.element.classList.remove('disabled');
        }
    };
    Select.prototype.isReadOnly = function () {
        return this.readOnly;
    };
    Select.prototype.setReadOnly = function (readOnly) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        }
        else {
            this.element.classList.remove('read-only');
        }
    };
    Select.prototype.setHeight = function (height) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    };
    Select.prototype.getSize = function () {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    };
    Select.prototype.setIcono = function (icono) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    };
    Select.prototype.focus = function () {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    };
    Select.prototype.onchange = function (callback) {
        this.input.onchange = callback;
    };
    Select.clear = function () {
        var selects = document.getElementsByClassName('ui-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items.classList.contains('open')) {
                    items.classList.add('ui-ease-out');
                    items.classList.add('ui-0-2s');
                    items.classList.add('ui-fade-out-up');
                    (function (items) {
                        setTimeout(function () {
                            items.classList.remove('ui-ease-out');
                            items.classList.remove('ui-0-2s');
                            items.classList.remove('ui-fade-out-up');
                            items.classList.remove('open');
                        }, 200);
                    })(items);
                }
            }
        }
    };
    return Select;
})();
var Alert = (function () {
    function Alert(htmlElement) {
        this.element = null;
        this.button = document.createElement('button');
        this.span = document.createElement('span');
        this.p = document.createElement('p');
        this.i = document.createElement('i');
        this.strong = document.createElement('strong');
        this.icoSuccess = 'fa-check';
        this.icoInfo = 'fa-info';
        this.icoWarning = 'fa-exclamation-triangle';
        this.icoDanger = 'fa-times';
        this.icoWait = 'fa-circle-o-notch';
        this.animationIn = 'ui-fade-in';
        this.animationOut = 'ui-fade-out';
        this.typeAnimation = 'ui-ease-in-out';
        this.type = 'close';
        this.durationAnimation = 'ui-1s';
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close();
        };
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }
    Alert.prototype.close = function () {
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
            setTimeout(function () {
                self.element.classList.add('hidden');
            }, 1000);
        }
    };
    Alert.prototype.success = function (message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';
    };
    Alert.prototype.info = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();
    };
    Alert.prototype.warning = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    };
    Alert.prototype.danger = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    };
    Alert.prototype.wait = function (message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    };
    Alert.prototype.addAnimation = function () {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    };
    Alert.prototype.removeAnimation = function () {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    };
    return Alert;
})();
var Toggle = (function () {
    function Toggle() {
    }
    Toggle.init = function () {
        this.initNavBar();
        this.initDropDown();
    };
    Toggle.initNavBar = function () {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                };
            }
        }
    };
    Toggle.initDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = dropdownsToggle[i];
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
                    }
                    else {
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
                };
            }
        }
    };
    Toggle.clearDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var dropdown = dropdownsToggle[i].parentNode;
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
    };
    return Toggle;
})();
var Utils = (function () {
    function Utils() {
    }
    Utils.showActiveLink = function (element) {
        var anchors = element.querySelectorAll('.ui-link');
        var n = anchors.length;
        var url = window.location.pathname;
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
    };
    Utils.reloadCSS = function (element, href) {
        var queryString = '?reload=' + new Date().getTime();
        element.href = href.replace(/\?.*|$/, queryString);
    };
    return Utils;
})();
window.onload = function () {
    Toggle.init();
};
document.onclick = function () {
    Toggle.clearDropDown();
    Select.clear();
};
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
};
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
};
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
};
/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
};
/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
};
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
};
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
};
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
};
/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
/*
 * returns true if the date is valid
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
};
/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(), month = this.getMonth(), hours = this.getHours(), minutes = this.getMinutes(), seconds = this.getSeconds();
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
        }
        else {
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
Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
};
var author = 'Yonatan Alexis Quintero Rodriguez';
var version = '0.1';
