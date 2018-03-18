/**
 * @Created By: Ademola Aina
 * @Email:  aina.ademolac@gmaill.com
 * @Year :  2018 Production
 *
 * DOCUMENTATION:
 * ==============
 * www.noahsarkeducation.co/code-lab/js/simple-table-data
 *
 * LICENSE:
 * ========
 *
 * TERMS OF USE - Simple TableData
 *
 * Open source under the BSD License.
 *
 * Copyright © 2018 Ademola Aina
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var Simple = (typeof Simple === 'undefined') ? {} : Simple;

Simple.TableData = function(options){
    var table = this;

    /**@Private Property Below */
    table.utility    = new Simple.Utility();
    table.sort       = new Simple.SortTableData();
    table.view       = new Simple.TableDataView();
    table.controller = null; //Will be set after initialization
    table.instanceId = table.utility.generateRandomInteger();


    /**@Default Properties */
    var defaultOption = {}, pagingControlsContainer = "#pagingControls"+this.instanceId;

    defaultOption.tableSelector = "#tableId";       //Table ID or Class
    defaultOption.tableRowsPerPage = 10;
    defaultOption.currentPage = 1;
    /** How many Page Number should be visible while navigating. Minimum allowed is 3  (previous, current & next) */
    defaultOption.displayedPages = 10;
    defaultOption.searchPhrase = '';
    defaultOption.searchBoxSelector = '.td-search'+this.instanceId;
    defaultOption.showingInfoSelector = ".showing"+this.instanceId;
    /**Show / Hide Control Buttons : Default to TRUE */
    defaultOption.showGotoFirst = true;
    defaultOption.showGotoLast = true;
    defaultOption.showPrevious = true;
    defaultOption.showNext = true;
    /** all Text can accept an icon using a <span> OR <i> tag. */
    defaultOption.btnFirstText = "<i class='fa fa-arrow-circle-o-left'></i> First";
    defaultOption.btnPreviousText = "<i class='fa fa-chevron-circle-left'></i> Previous";
    defaultOption.btnNextText = "Next <i class='fa fa-chevron-circle-right'></i>";
    defaultOption.btnLastText = "Last <i class='fa fa-arrow-circle-o-right'></i>";
    /**CSS properties */
    defaultOption.css = {};
    defaultOption.css.paginationLayout = "<style>" +
                                            pagingControlsContainer+" { margin-top:10px; position:absolute; right:0px; } " +
                                            pagingControlsContainer+" ul{display:inline; padding-left: 0.1em} " +
                                            pagingControlsContainer+" li{display:inline; padding-left: 0.1em}" +
                                            "</style>";
    defaultOption.css.tableInfoLayout = "pull-left";
    defaultOption.css.btnNumberingClass = "btn btn-sm btn-primary";
    defaultOption.css.btnActiveClass = "btn btn-sm btn-default";
    defaultOption.css.btnFirstClass = defaultOption.css.btnNumberingClass;
    defaultOption.css.btnLastClass = defaultOption.css.btnNumberingClass;
    defaultOption.css.btnNextClass = defaultOption.css.btnNumberingClass;
    defaultOption.css.btnPreviousClass = defaultOption.css.btnNumberingClass;
    defaultOption.css.sortColumnIcon = 'fa fa-sort';
    defaultOption.css.sortDownIcon = 'fa fa-sort-desc';
    defaultOption.css.sortUpIcon = 'fa fa-sort-asc';
    /**@Advanced Implementation default using a custom Json Data Source */
    defaultOption.dataSource = {};
    /**@Using_Ajax as DataSource */
    defaultOption.ajax = {};
    defaultOption.ajax.params = {};
    defaultOption.ajax.url = '';


    if (typeof options === 'undefined') {
        options = defaultOption;
    }

    var getOption = function(field){
        return (typeof options[field] === 'undefined') ? defaultOption[field] : options[field];
    };

    var getCssOption = function(cssFieldName){
        var value = getOption('css'), defaultValue = defaultOption['css'];
        return (typeof value[cssFieldName] === 'undefined') ? defaultValue[cssFieldName] : value[cssFieldName];
    };

    var getAjaxOption = function(ajaxFieldName){
        var value = getOption('ajax'), defaultValue = defaultOption['ajax'];
        return (typeof value[ajaxFieldName] === 'undefined') ? defaultValue[ajaxFieldName] : value[ajaxFieldName];
    };

    this.tableRowsPerPage = getOption('tableRowsPerPage');
    this.currentPage = getOption('currentPage');
    this.tableSelector = getOption('tableSelector');
    this.displayedPages = getOption('displayedPages');
    this.showGotoFirst = getOption('showGotoFirst');
    this.showGotoLast = getOption('showGotoLast');
    this.showPrevious = getOption('showPrevious');
    this.showNext = getOption('showNext');
    this.btnFirstText = getOption('btnFirstText');
    this.btnLastText = getOption('btnLastText');
    this.btnPreviousText = getOption('btnPreviousText');
    this.btnNextText = getOption('btnNextText');
    this.searchPhrase = getOption('searchPhrase');
    this.searchBoxSelector = getOption('searchBoxSelector');
    this.showingInfoSelector = getOption('showingInfoSelector');
    this.numOfPages = 0;
    this.dataSource = getOption('dataSource');
    this.ajax = getOption('ajax');
    this.ajax.params = getAjaxOption('params');
    this.ajax.url = getAjaxOption('url');
    this.css = getOption('css');
    this.css.paginationLayout = getCssOption('paginationLayout');
    this.css.tableInfoLayout = getCssOption('tableInfoLayout');
    this.css.btnNumberingClass = getCssOption('btnNumberingClass');
    this.css.btnActiveClass = getCssOption('btnActiveClass');
    this.css.btnFirstClass = getCssOption('btnFirstClass');
    this.css.btnLastClass = getCssOption('btnLastClass');
    this.css.btnNextClass = getCssOption('btnNextClass');
    this.css.btnPreviousClass = getCssOption('btnPreviousClass');
    this.css.sortColumnIcon = getCssOption('sortColumnIcon');
    this.css.sortDownIcon = getCssOption('sortDownIcon');
    this.css.sortUpIcon = getCssOption('sortUpIcon');

    /** 'addDataTypes' >>> Use this object to Add More Sorting DataTypes functions. */
    if (options['addDataTypes']){
        this.sort.DataTypesOptions = this.utility.mergeObjects(this.sort.DataTypesOptions, options['addDataTypes']);
    }


    this.init = function () {
        $(this.view.getPaginationHtml(pagingControlsContainer,this.css.tableInfoLayout, this.instanceId)).insertAfter(this.tableSelector);
        $(this.view.getSearchBoxHtml(this.tableRowsPerPage, this.instanceId)).insertBefore(this.tableSelector);

        this.tableSelector = $(this.tableSelector);
        this.tableRowSelector = $("tbody tr", this.tableSelector);
        if (this.displayedPages < 3){
            console.log("Minimum Displayed Page Numbers Allowed While Navigating is 3. " +
                "\nTo avoid pagination control malfunction, please set this to >= 3, even if you have lesser items to display.");
            this.displayedPages = 3;
        }

        this.sort.init(this.instanceId, this.tableSelector, this.css.sortColumnIcon);
    };


    /**
     * @getController
     * @returns {Simple.TableDataControls|*}
     */
    this.getController = function(){
        if (this.controller == null) {
            this.init();
            this.controller = new Simple.TableDataControls(this);
        }
        return this.controller;
    };

    /**
     * @getView
     * @returns {Simple.TableDataView|*}
     */
    this.getView = function(){
        return this.view;
    };

    /**
     * @search
     * @param trString
     * @param words
     * @returns {boolean}
     */
    this.search = function(trString, words){
        for (var i = 0; i < words.length; i++) {
            if (trString.indexOf(words[i]) > -1) {
                return true;
            }
        }
        return false;
    };


    /**
     * @getTableRowData
     * @returns {*}
     */
    this.getTableRowData = function(){
        var words = table.searchPhrase.toLowerCase().split(" "), dataSource = table.tableRowSelector;
        if (table.dataSource.length > 0){
            /**@Advanced Implementation Using a Custom Json Data Source */
            dataSource = table.dataSource;
        }
        if (table.searchPhrase.length > 0){
            /**@Filter By Search Phrase */
            return dataSource.filter(function(key, value){
                return table.search($(value).html().replace(/<[^>]+>/g,"").toLowerCase(), words);
            });
        }
        /**@NoFilter */
        return dataSource;
    };


    /**
     * @showCurrentPage
     */
    this.showCurrentPage = function(){
        if (this.controller == null) {
            this.init();
        }
        var html = '', start = 0, end = 'all';
        if (table.tableRowsPerPage != 'all'){
            start = (table.currentPage-1) * table.tableRowsPerPage;
            end = start+table.tableRowsPerPage;
        }

        if (table.ajax.url != '' && table.ajax.url!='undefined'){
            /**@Ajax Implementation */
            var response = {html:'', currentPage:table.currentPage, start:start, end:end, totalRows:0};
            table.ajax.params = table.utility.mergeObjects(table.ajax.params,response);
            $.post(table.ajax.url, table.ajax.params, function(response){
                table.tableSelector.find("tbody").html(response.html);
                if (table.tableRowsPerPage == 'all'){
                    table.tableRowsPerPage = response.totalRows;
                    totalRows = response.totalRows;
                    start = response.start;
                    end = response.end;
                }
            }, 'json');
        }
        else{
            /**@Basic_OR_Advanced Implementation */
            var data = table.getTableRowData(), totalRows = data.length;
            if (table.tableRowsPerPage=='all'){
                table.tableRowsPerPage = totalRows;
                start = (table.currentPage-1) * table.tableRowsPerPage;
                end = start+table.tableRowsPerPage;
            }
            data.slice(start, end).each(function(){ html += this.outerHTML; });
            table.tableSelector.find("tbody").html(html);
        }

        $(pagingControlsContainer).html('');
        this.numOfPages = 0;
        if (totalRows > this.tableRowsPerPage){
            /** Auto-Calculate the number of Pages. */
            this.numOfPages = Math.ceil(totalRows / this.tableRowsPerPage);
            /**@render Pagination Controls */
            $(pagingControlsContainer).html(this.view.getPaginationControlsHtml(this));
            if (this.controller == null){
                this.controller = new Simple.TableDataControls(this);
            }
        }
        $(this.showingInfoSelector).html("Showing "+(start+1)+' to '+(end > totalRows ? totalRows : end)+' of '+totalRows+' Entries');
    };

};

/**
 * @SortTableData
 * @constructor
 */
Simple.SortTableData = function(){
    var sortMaster = this;

    this.init = function(instanceId, tableSelector, sortIcon){
        tableSelector.find("thead tr th").each(function(){
            if ( $(this).data("sort") != "undefined" && $(this).data("sort")!=undefined){
                $(this).css("cursor", "pointer");
                $(this).addClass("td-sort-arrow"+instanceId);
                $(this).append("<span class='pull-right' data-state='-1'><i class='"+sortIcon+"'></i></span>");
            }
        });
    };

    sortMaster.sortOrderOption = {ASC: "asc", DESC: "desc"};

    sortMaster.DataTypesOptions = {
        int : function(a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        },
        float : function(a, b) {
            return parseFloat(a) - parseFloat(b);
        },
        string: function(a, b) {        //String Case Sensitive
            return a.localeCompare(b);
        },
        string_in: function(a, b) {       //String Case Insensitive
            a = a.toLocaleLowerCase();
            b = b.toLocaleLowerCase();
            return a.localeCompare(b);
        }
    };

    /**@sortProperties : Default Properties*/
    sortMaster.tableRowSelector = null;
    sortMaster.nr = 0;
    sortMaster.order = sortMaster.sortOrderOption.ASC;
    sortMaster.dataType = "string_in";

    sortMaster.sortTable = function(tableRowSelector, order, nr, dataType){
        if (typeof tableRowSelector !== 'undefined' && tableRowSelector!==null){
            sortMaster.tableRowSelector = tableRowSelector;
        }
        if (typeof order !== 'undefined' && order!==null){
            sortMaster.order = order;
        }
        if (typeof nr !== 'undefined' && nr!==null){
            sortMaster.nr = nr;
        }
        if (typeof dataType !== 'undefined' && dataType!==null){
            sortMaster.dataType = dataType;
        }
        return  sortMaster.tableRowSelector.sort(function(a, b){
                    if (sortMaster.order == sortMaster.sortOrderOption.ASC) {
                        return sortMaster.DataTypesOptions[sortMaster.dataType](
                            $("td:nth-child("+sortMaster.nr+")", a).text(),
                            $("td:nth-child("+sortMaster.nr+")", b).text()
                        )
                    }
                    else{
                        return sortMaster.DataTypesOptions[sortMaster.dataType](
                            $("td:nth-child("+sortMaster.nr+")", b).text(),
                            $("td:nth-child("+sortMaster.nr+")", a).text()
                        )
                    }
            });
    };

};

/**
 * @TableDataView
 * @constructor
 */
Simple.TableDataView = function(){

    this.getPaginationHtml = function(pagingControlsContainer, tableInfoLayout, instanceId){
        return "<div style='display: inline-block;'>"+
            "<div id='"+pagingControlsContainer.replace("#", "")+"'></div>"+
            "<div class='"+tableInfoLayout+" showing"+instanceId+"'></div>" +
            "</div>";
    };

    /**
     * APPEND SEARCH BOX HTML TO TABLE
     * @returns {string}
     */
    this.getSearchBoxHtml = function(tableRowsPerPage, instanceId){
        return "<div class = 'col-md-4 pull-right ml-2 mr-2 mt-2 mb-2'>" +
            "<div class='input-group'>" +

            "<span class='input-group-addon'><i class='fa fa-search'></i></span>" +

            "<div class='form-control'>" +
            "<input type='text' aria-label='...' placeholder='Search...' value='' name='td-search"+instanceId+"' " +
            "class='form-control td-search"+instanceId+"'>" +
            "</div>" +

            "<div class='input-group-btn dropdown'>" +
            "<button type='button' class='btn btn-default dropdown-toggle' type='button' id='btn_filter"+instanceId+"' " +
            "data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"+tableRowsPerPage+
            "</button>" +
            "<div class='dropdown-menu num_filter' aria-labelledby='btn_filter"+instanceId+"'>" +
            "<div class='dropdown-header'>Number Per Page</div>"  +
            "<a href='#' class='dropdown-item td-item-per-row"+instanceId+"'>10</a>"    +
            "<a href='#' class='dropdown-item td-item-per-row"+instanceId+"'>25</a>"    +
            "<a href='#' class='dropdown-item td-item-per-row"+instanceId+"'>50</a>"    +
            "<a href='#' class='dropdown-item td-item-per-row"+instanceId+"'>100</a>"   +
            "<div role='separator' class='dropdown-divider'></div>" +
            "<a href='#' class='dropdown-item td-item-per-row"+instanceId+"'>all</a>"   +
            "</div>"  +
            "</div>" +

            "</div>" +
            "</div>";
    };

    var createButton = function (Label, btnClasses, isDisabled) {
        return '<li><a href="" class="'+btnClasses+' '+(isDisabled ? "disabled" : "")+'">'+Label+'</a></li>';
    };

    /**
     * @getPaginationControlsHtml
     */
    this.getPaginationControlsHtml = function (table) {
        var currentPage = table.currentPage,
            numOfPages = table.numOfPages,
            displayedPages = table.displayedPages;   //How many Page Number should be visible while navigating

        var pagingControls = table.css.paginationLayout + "<ul>";

        if (table.showGotoFirst){
            pagingControls += createButton(table.btnFirstText, 'td-first'+table.instanceId+' '+table.css.btnFirstClass, currentPage==1);
        }
        if (table.showPrevious){
            pagingControls += createButton(table.btnPreviousText, 'td-prev'+table.instanceId+' '+table.css.btnPreviousClass, currentPage==1);
        }

        var starting = 1, upTo = numOfPages-2, secondToLastPage = numOfPages-1, lastPage = numOfPages,
            maximumStartingPoint = (numOfPages - displayedPages)+1;
        if (displayedPages < numOfPages) {
            upTo = displayedPages - 2;
            if (currentPage > upTo) {
                //Shift one down to allow the visibility of currently active page.
                starting += (currentPage-upTo);
                upTo += (currentPage-upTo);
                if (starting > maximumStartingPoint){
                    //Normalize any escalating starting points...and subsequently upTo
                    starting = maximumStartingPoint;
                    upTo = secondToLastPage-1;
                }
            }
        }

        while(starting <= upTo){
            if (starting != currentPage){
                pagingControls += createButton(starting, 'td-page-num'+table.instanceId+' '+table.css.btnNumberingClass, false);
            }
            else{
                pagingControls += createButton(starting, 'td-active-page'+table.instanceId+' '+table.css.btnActiveClass, false);
            }
            starting++;
        }

        if ( starting != (numOfPages-1)){
            pagingControls += createButton('...', 'td-page-num'+table.instanceId+' '+table.css.btnActiveClass, true);
        }

        if (secondToLastPage==currentPage){
            pagingControls += createButton(secondToLastPage, 'td-active-page'+table.instanceId+' '+table.css.btnActiveClass, false);
        }
        else{
            pagingControls += createButton(secondToLastPage, 'td-page-num'+table.instanceId+' '+table.css.btnNumberingClass, false);
        }

        if (lastPage==currentPage){
            pagingControls += createButton(lastPage, 'td-active-page'+table.instanceId+' '+table.css.btnActiveClass, false);
        }
        else{
            pagingControls += createButton(lastPage, 'td-page-num'+table.instanceId+' '+table.css.btnNumberingClass, false);
        }

        if (table.showNext){
            pagingControls += createButton(table.btnNextText, 'td-next'+table.instanceId+' '+table.css.btnNextClass, currentPage==numOfPages);
        }
        if (table.showGotoLast){
            pagingControls += createButton(table.btnLastText, 'td-last'+table.instanceId+' '+table.css.btnLastClass, currentPage==numOfPages);
        }
        pagingControls += '</ul>';

        return pagingControls;
    };
    
};

/**
 * @Simple.TableDataControls
 * @param table
 * @constructor
 */
Simple.TableDataControls = function(table){

    var body = $('body'), controller = this, instanceId = table.instanceId;

    /**
     * @showPage
     * @param page
     */
    controller.showPage = function(page){
        table.currentPage = page;
        table.showCurrentPage();
        return table.currentPage;
    };

    /**
     * @returns {number}
     */
    controller.showFirstPage = function() {
        return controller.showPage(1);
    };

    /**
     * @returns {number|*}
     */
    controller.showLastPage = function() {
        return controller.showPage(table.numOfPages);
    };

    /**
     * @returns {number|*}
     */
    controller.showPreviousPage = function(){
        return controller.showPage(parseInt(body.find('.td-active-page'+instanceId).html())-1);
    };

    /**
     * @returns {number|*}
     */
    controller.showNextPage = function(){
        return controller.showPage(parseInt(body.find('.td-active-page'+instanceId).html())+1);
    };

    /**
     * @onPageClick
     * @param pageNumber    Optional Parameter
     * @param event         Optional Parameter
     * @returns {boolean}
     */
    controller.onPageClick = function (pageNumber, event) {
        return true;
    };

    /**@before Table Sort */
    controller.beforeTableSort = function(th, event){
        return true;
    };

    /**@after Table Sort */
    controller.afterTableSort = function(th, event){
        return true;
    };

    /**@Sort onclick column */
    body.on("click", ".td-sort-arrow"+instanceId, function(e){
        e.preventDefault();
        controller.beforeTableSort($(this), e);
        var this_th = $(this),
            dataType = this_th.data('sort'),
            nr = this_th.index()+1,
            order = this_th.find("span").data('state');
        if (order == 'undefined' || order == '-1' || order == table.sort.sortOrderOption.DESC){
            order = table.sort.sortOrderOption.ASC;
        }
        else {
            order = table.sort.sortOrderOption.DESC;
        }
        if (dataType==null || dataType=='undefined'){
            return 0;
        }
        else{
            this_th.find("span").data('state', order);
            this_th.find("span > i").attr('class', '');
            this_th.find("span > i").attr('class', order==table.sort.sortOrderOption.ASC? table.css.sortUpIcon: table.css.sortDownIcon);
            table.sort.sortTable(table.tableSelector.find("tbody tr"), order, nr, dataType).appendTo(table.tableSelector.find("tbody"));
            controller.afterTableSort(this_th, e);
        }
    });


    /**@search Text field control */
    body.on("keyup", table.searchBoxSelector, function(e){
        table.searchPhrase = $(this).val();
        controller.showFirstPage();
    });

    /**@dropDown for selecting Numbers Per Page */
    body.on("click", ".td-item-per-row"+instanceId, function(e){
        e.preventDefault();
        table.tableRowsPerPage = ($(this).html()=='all') ? $(this).html() : parseInt($(this).html());
        body.find("#btn_filter"+instanceId).html(table.tableRowsPerPage+" ");
        controller.showFirstPage();
    });

    /**@onClick Page Number */
    body.on('click', '.td-page-num'+instanceId, function (e) {
        e.preventDefault();
        var pageNum = parseInt($(this).html());
        controller.showPage(pageNum);
        controller.onPageClick(pageNum, e);
    });

    /**@onClick Previous Button */
    body.on('click', '.td-prev'+instanceId, function (e) {
        e.preventDefault();
        var pageNum = controller.showPreviousPage();
        controller.onPageClick(pageNum, e);
    });

    /**@onClick Next Button */
    body.on('click', '.td-next'+instanceId, function (e) {
        e.preventDefault();
        var pageNum = controller.showNextPage();
        controller.onPageClick(pageNum, e);
    });

    /**@onClick First Button */
    body.on('click', '.td-first'+instanceId, function (e) {
        e.preventDefault();
        var pageNum = controller.showFirstPage();
        controller.onPageClick(pageNum, e);
    });

    /**@onClick Last Button */
    body.on('click', '.td-last'+instanceId, function (e) {
        e.preventDefault();
        var pageNum = controller.showLastPage();
        controller.onPageClick(pageNum, e);
    });

};

/**
 * @Utility
 * @constructor
 */
Simple.Utility = function(){

    /**
     * GENERATE A RANDOM UNIQUE ID
     * @param length
     * @returns {string}
     */
    this.generateRandomId = function(length) {
        return (Math.random()+10).toString(36).substring(length);
    };

    this.generateRandomInteger = function(){
        return Math.floor(Math.random() * 20);
    };

    this.getRandomNumber = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * @mergeObjects
     * @param obj1
     * @param obj2
     * @returns {*}
     */
    this.mergeObjects = function(obj1, obj2){
        for(var key in obj2){
            if (obj2.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
            }
        }
        return obj1;
    };

};


(function($) {

    $.fn.simpleTableData = function (newOptions) {
        return $.simpleTableData(this, newOptions);
    };

    $.simpleTableData = function (tableSelector, newOptions) {
        newOptions['tableSelector'] = tableSelector;
        var table = new Simple.TableData(newOptions);
        table.showCurrentPage();
        return table;
    };

})(jQuery);