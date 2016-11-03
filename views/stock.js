$(function () {
    var names = ["FB", "AAPL", "MSFT"];
        
    var socket = io();
    $('form').submit(function(){
       $("#loader").addClass("loader");
        var name = $('#addname').val().toUpperCase();
        $.getJSON('/check/'+name,  function (data){
            if(data.statusCode == "not found"){
                alert("Incorrect or not existing stock code");
                $("#loader").removeClass("loader");
            } else if(!compareName(names,name)){
                alert('Already existing stock code');
                $("#loader").removeClass("loader");
            } else {
                socket.emit('add name', data);
            }
        });
        $('#addname').val('');
        return false;
    });
    
    $('#companyname').on('click','button', function(){
        if(names.length > 1){
            var name =  $(this).attr("val");
            $("#loader").addClass("loader");
            socket.emit('remove name', name);
        } else {
            alert("Cannot delete");    
        }   
    });
    
    socket.on('create stock', function(data){
        var name = data.name.slice(0, data.name.indexOf(" Prices, Dividends, Splits and Trading Volume"));
        names.push(data.symbol);
        generateChart(names,function() {
            $('#companyname').append("<h3 id='"+data.symbol+"' ><button class='btn btn-danger' val='"+ data.symbol +"' >X</button> "+name+"</h3>");
            $("#loader").removeClass("loader");
        });
    });
    socket.on('remove stock', function(name){
        var index = names.indexOf(name);
        names.splice(index,1);
        generateChart(names,function(){
            $('#'+name).remove();
            $("#loader").removeClass("loader");
        });
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
            chart: {
                borderColor: '#183152',
                borderWidth: 4,
                backgroundColor:'#F5F5F5'
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