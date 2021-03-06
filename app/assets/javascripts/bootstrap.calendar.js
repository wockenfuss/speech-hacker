
/*!
 * bootstrap-calendar plugin
 * Original author: @ahmontero
 * Licensed under the MIT license
 *
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'Calendar',

        defaults = {
            weekStart: 1,
            msg_days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            msg_months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            msg_today: 'Today',
            msg_events_header: 'Today\'s Meeting',
            events: null
        },

        template =  ''+
                        '<h1 class="year"></h1>'+
                        '<h3 class="month"></h3>'+
                        '<table class="calendar" id="calendar">'+
                            '<thead class="calendar-header"></thead>'+
                            '<tbody class="calendar-body"></tbody>'+
                            '<tfoot>'+
                                '<th colspan="2" class="sel" id="last"><div class="arrow"><i class="icon-arrow-left"></i></div></th>'+
                                '<th colspan="3" class="sel" id="current">' +defaults.msg_today+ '</th>'+
                                '<th colspan="2" class="sel" id="next"><div class="arrow"><i class="icon-arrow-right"></i></div></th>'+
                            '</tfoot>'+
                        '</table>'+
                    '',

        daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

        today = new Date();

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options
        this.weekStart = this.options.weekStart||1;
        this.days = this.options.msg_days;
        this.months = this.options.msg_months;
        this.msg_today = this.options.msg_today;
        this.msg_events_hdr = this.options.msg_events_header;
        this.events = this.options.events;

        this.calendar = $(template).appendTo(this.element).on({
                                click: $.proxy(this.click, this)
                        });

        this.live_date = new Date();

        var now = new Date();
        this.mm = now.getMonth();
        this.yy = now.getFullYear();

        var mon = new Date(this.yy, this.mm, 1);
        this.yp = mon.getFullYear();
        this.yn = mon.getFullYear();


        if (this.component){
            this.component.on('click', $.proxy(this.show, this));
        } else {
            this.element.on('click', $.proxy(this.show, this));
        }

        this.renderCalendar(now);
    };

    Plugin.prototype.renderEvents = function (events, elem) {
        var live_date = this.live_date;
        var msg_evnts_hdr = this.msg_events_hdr;
        for(var i=1; i<=daysInMonth[live_date.getMonth()]; i++){

            $.each(events.event, function(){
                var year = 1900 + live_date.getYear();
                var month = live_date.getMonth();

                var view_date = new Date(year, month, i, 0,0,0,0);
                var event_date = new Date(this.date);


                if( event_date.getDate() == view_date.getDate()
                    && event_date.getMonth() == view_date.getMonth()
                    && event_date.getFullYear() == view_date.getFullYear()


                ){
                    elem.parent('div:first').find('#day_' + i)
                    .removeClass("day")
                    .addClass('holiday')
                    .empty()
                    .append('<span class="weekday">' +i+ '</span>')
                    // .popover({
                    //     'title': this.location,
                    //     'content': this.time,
                    //     'delay': { 'show': 250, 'hide': 250 }
                    // });
                }
            });
        }
        this.monthlyList( events );
    };

    Plugin.prototype.loadEvents = function () {
        if(!(this.events === null)){
            if(typeof this.events == 'function'){
                this.renderEvents(this.events.apply(this, []), this.calendar);
            }
        }
    };

    Plugin.prototype.renderCalendar = function (date) {
        var mon = new Date(this.yy, this.mm, 1);
        var live_date = this.live_date;

        this.element.parent('div:first').find('.year').empty();
        this.element.parent('div:first').find('.month').empty();

        this.element.parent('div:first').find('.year').append(mon.getFullYear());
        this.element.parent('div:first').find('.month').append(this.months[mon.getMonth()]);

        if(this.isLeapYear(date.getYear())){
            daysInMonth[1] = 29;
        }else{
            daysInMonth[1] = 28;
        }

        this.calendar.find('.calendar-header').empty();
        this.calendar.find('.calendar-body').empty();

        // Render Days of Week
        this.renderDays();

        var fdom = mon.getDay(); // First day of month
        var mwks = 6 // Weeks in month

        // Render days
        var dow = 0;
        var first = 0;
        var last = 0;
        for(var i=0; i>=last; i++){

            var _html = "";

            for(var j=this.weekStart; j<this.days.length + this.weekStart; j++){

                cls = "";
                msg = "";
                id = "";

                // Determine if we have reached the first of the month
                if(first >= daysInMonth[mon.getMonth()]){
                    dow = 0;
                }else if(((dow%7)>0 && (first%7)>0) || ((j%7)==(fdom%7))){
                    dow++;
                    first++;
                }

                // Get last day of month
                if(dow==daysInMonth[mon.getMonth()]){
                    last = daysInMonth[mon.getMonth()];
                }

                // Set class
                if(cls.length == 0){
                    if(
                        today.getDate() == date.getDate()
                        && dow == date.getDate()
                        && date.getMonth() == date.getMonth()
                        && date.getFullYear() == date.getFullYear()

                    ){
                        cls = "today";
                    }else if(j%7 == 0 || j%7 == 6){
                        cls = "weekend";
                    }else{
                        cls = "day";
                    }
                }

                // Set ID
                id = "day_" + dow;

                month_ = date.getMonth() + 1;
                year = date.getFullYear();

                // Render HTML
                if(dow == 0){
                    _html += '<td>&nbsp;</td>';
                }else if(msg.length > 0){
                    _html += '<td class="' +cls+ '" id="'+id+'" year="' + year + '" month="' + month_ + '" day="' + dow + '"><span class="weekday">' +dow+ '</span></td>';
                }else{
                    _html += '<td class="' +cls+ '" id="'+id+'" year="' + year + '" month="' + month_ + '" day="' + dow + '">' +dow+ '</td>';
                }

            }
            _html = "<tr>" +_html+ "</tr>";
            this.calendar.find('.calendar-body').append(_html);
        }
        this.loadEvents();
    };

    Plugin.prototype.renderDays = function () {
        var html = '';
        for(var j=this.weekStart; j<this.weekStart + 7; j++){
            html += "<th>" +this.days[j%7]+ "</th>";
        }

        var _html = "<tr>" +html+ "</tr>";
        this.calendar.find('.calendar-header').append(_html);
    };

    Plugin.prototype.click = function (e) {
        e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest('td, th');

            if (target.length == 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'td':
                        if (target.is('.day')){
                            var day = parseInt(target.attr('day'), 10)||1;
                            var month = parseInt(target.attr('month'), 10)||1;
                            var year = parseInt(target.attr('year'), 10)||1;

                            this.element.trigger({
                                type: 'changeDay',
                                day: day,
                                month: month,
                                year: year,
                            });
                        }else if(target.is('.holiday')){
                            var day = parseInt(target.attr('day'), 10)||1;
                            var month = parseInt(target.attr('month'), 10)||1;
                            var year = parseInt(target.attr('year'), 10)||1;

                            this.element.trigger({
                                type: 'onEvent',
                                day: day,
                                month: month,
                                year: year,
                            });
                        }else if(target.is('.today')){
			                var day = parseInt(target.attr('day'), 10)||1;
                            var month = parseInt(target.attr('month'), 10)||1;
                            var year = parseInt(target.attr('year'), 10)||1;

			                this.element.trigger({
                                type: 'changeDay',
                                day: day,
                                month: month,
                                year: year,
                            });
			}
                        break;
                    case 'th':
                        if (target.is('.sel')){
                            switch(target.attr("id")){
                                case 'last':
                                    this.update_date('prv');
                                    var prv = new Date(this.yp, this.mm, 1);
                                    this.live_date = prv;
                                    this.renderCalendar(prv, this.events);
                                    this.element.trigger({
                                        type: 'onPrev',
                                        month: this.mm,
                                    });
                                    break;
                                case 'current':
                                    this.update_date('crt');
                                    var now = new Date();
                                    this.live_date = now;
                                    this.renderCalendar(now, this.events);
                                    this.element.trigger({
                                        type: 'onCurrent',
                                        month: this.mm,
                                    });
                                    break;
                                case 'next':
                                    this.update_date('nxt');
                                    var nxt = new Date(this.yn, this.mm, 1);
                                    this.live_date = nxt;
                                    this.renderCalendar(nxt, this.events);
                                    this.element.trigger({
                                        type: 'onNext',
                                        month: this.mm,
                                    });
                                    break
                            }
                        }
                        break;
                    break;
                }
            }
    };

    Plugin.prototype.update_date = function (action) {
        var now = new Date();

        switch(action){
            case 'prv':
                now = new Date(this.yy, this.mm-1, 1);
                break;
            case 'nxt':
                now = new Date(this.yy, this.mm+1, 1);
                break;
            case 'crt':
                break;
        }

        this.mm = now.getMonth();
        this.yy = now.getFullYear();

        var mon = new Date(this.yy, this.mm, 1);
        this.yp = mon.getFullYear();
        this.yn = mon.getFullYear();
    };

    Plugin.prototype.isLeapYear = function (year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

    Plugin.prototype.monthlyList = function(events) {
        $('#meeting-list div')[0].innerHTML = "";
        var year = this.yy;
        var month = this.mm + 1;
        var counter = 0;
        $.each(events.event, function(){
            if( month == this.month && year == this.year) {


                $('#meeting-list div')[0].innerHTML += '<div class="accordion accordion-group"><div class="accordion-heading">' +
                    '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse' + counter + '">' +
                    '<strong>' + this.date + '</strong>' + " | " + this.time + " | " + this.location + " " +
                    '</a></div><div id="collapse' + counter + '" class="accordion-body collapse out">' +
                    '<div class="accordion-inner"><div class="indentation">' +

                    //date
                    //time
                    //location
                    //link to sign up for meeting
                    //attending or not
                    //user's meeting role
                    //all meeting roles?
                    // 'date = ' + this.date + "<br/>" +
                    // 'time = ' + this.time + "<br/>" +
                    // 'location = ' + this.location + "<br/>" +
                    '<em>' + this.description + '</em>' + '<br/>' +

                    // attendingOrNot(this.attending, this.meeting_role) + "<br/>" +
                    '<a href="meetings/' + this.meeting_id  + '">Sign up</a>' +

                    '</br></div></div></div></div>';
                //$('#monthly-list')[1].innerHTML += "<strong>" + this.date + " " + "</strong>" + this.time + " " + this.location + "</p>";
                counter += 1;
            }

        });
    };

    function attendingOrNot(status, role) {
      if (status) {
        return "You are currently attending as " + role.title.toLowerCase() + ".";
      } else {
        return "You are not currently attending this meeting.";
      };
    };





})( jQuery, window, document );





