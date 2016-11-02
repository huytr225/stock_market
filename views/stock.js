$(function () {
    var names = ["GOOG", "AAPL"];
        
    var socket = io();
    $('form').submit(function(){
        var name = $('#addname').val();
        $.getJSON('/check/'+name,  function (data){
            if(data.statusCode == "not found"){
                alert("Incorrect or not existing stock code");
            } else if(!compareName(names,name)){
                alert('Already existing stock code');
                
            } else {
                socket.emit('add name', name);
            }
        });
        $('#addname').val('');
        return false;
    });
    
    $('.btn').click(function(e){
        e.preventDefault();
        alert("hi");
        alert($(this).attr("value"));
       /*$('h3').remove("#")*/
    });
    socket.on('create stock', function(name){
        names.push(name);
        generateChart(names,function() {});
        $('#companyname').append("<h3><button class='btn btn-danger' val='"+ name +"'>X</button> "+name+"</h3>");
    });
    function compareName(arr, name){
        name = name.toUpperCase();
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == name) return false;
        }
        return true;
    }
    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
     
     
    function createChart(seriesOptions) {

        $('#container').highcharts('StockChart', {
            title: {
                text: 'Stock Live'
            },
            subtitle: {
                text: 'by Huy Tran'
            },
            chart: {
                backgroundColor:'#FFFFFF'
            },
            rangeSelector: {
                selected: 2,
                enabled: false
            },
            navigator: {
                enabled: false
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },
            scrollbar:{
                enabled : false
            },
            
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series: seriesOptions
        });
    }
    function generateChart(arr, callback){
        var seriesOptions = [],  seriesCounter = 0;
        $.each(arr, function (i, name) {
            $.getJSON('/stock/'+name,  function (data){
            seriesOptions[i] = {
                name: name,
                data: data
            };
            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;
    
            if (seriesCounter === arr.length) {
                createChart(seriesOptions);
                callback();
            }
            });
        });
    }
    generateChart(names,function(){});
     
    
});