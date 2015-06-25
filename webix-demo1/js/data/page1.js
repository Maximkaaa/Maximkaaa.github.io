(function() {

    var page1 = {
        label: 'Movie data table',
        view: {
            id: 'page1',
            view:"datatable",
            leftSplit:2, rightSplit:2,
            columns:[
                { id:"rank",	header:"", css:"rank",  		width:40,	css:"rank left_area"},
                { id:"title",	header:"Film title",width:200, css:"left_area"},

                { id:"2008_1", header:[{text:"2008", colspan:12}, "January"] },
                { id:"2008_2", header:[null, "February"] },
                { id:"2008_3", header:[null, "March"] },
                { id:"2008_4", header:[null, "April"] },
                { id:"2008_5", header:[null, "May"] },
                { id:"2008_6", header:[null, "June"] },
                { id:"2008_7", header:[null, "July"] },
                { id:"2008_8", header:[null, "August"] },
                { id:"2008_9", header:[null, "September"] },
                { id:"2008_10", header:[null, "October"] },
                { id:"2008_11", header:[null, "November"] },
                { id:"2008_12", header:[null, "December"] },

                { id:"2009_1", header:[{text:"2009", colspan:12}, "January"] },
                { id:"2009_2", header:[null, "February"] },
                { id:"2009_3", header:[null, "March"] },
                { id:"2009_4", header:[null, "April"] },
                { id:"2009_5", header:[null, "May"] },
                { id:"2009_6", header:[null, "June"] },
                { id:"2009_7", header:[null, "July"] },
                { id:"2009_8", header:[null, "August"] },
                { id:"2009_9", header:[null, "September"] },
                { id:"2009_10", header:[null, "October"] },
                { id:"2009_11", header:[null, "November"] },
                { id:"2009_12", header:[null, "December"] },

                { id:"year",	header:"Released" , width:80, css:"right_area"},
                { id:"votes",	header:"Votes", 	width:100, css:"right_area"}
            ],
            url: 'data/bigDataSet.json'
        }
    };

    window.app.data.push(page1);

})();
