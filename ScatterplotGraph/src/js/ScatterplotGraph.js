/*Déclarations des variables*/
const dataUrl ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

let dataJson=[], dataValues=[]   //stocke les données du fichier json
  
let time         //stocke les temps de course
let year         //stocke les années de course

let yScale,xScale

const margin={top: 50, right: 30, bottom: 10, left: 70},
width=800,
height=600

/*Zone du svg Container*/ 
let svgContainer = d3.select('#graphContainer')

const drawSvgContainer = () =>{
    svgContainer.attr("width", width)
                .attr("height", height)  
}

/*Definit les propriétes des échelles des axes x et y*/
const propertyScales = () =>{

    /*Echelle des y*/ 
    yScale = d3.scaleLinear()
                    .domain([d3.min(time), d3.max(time)])      
                    .range([margin.bottom,height-margin.top]); 

    /*Echelle des x*/    
    xScale=d3.scaleLinear()
                .domain([d3.min(year)-1,d3.max(year)+1])
                .range([margin.left,width-margin.right])
}
            
/*Dessine tous les points du graphique*/
const drawPlots = () =>{

    svgContainer.selectAll('circle')
                    .data(dataValues)
                    .enter()                    
                    .append('circle')
                    .attr('class','dot')
                    .attr('r','5')
                    .attr('data-xvalue', (item) =>{
                        return item['Year']
                    })
                    .attr('data-yvalue', (item)=> {
                        return new Date(item['Seconds']*1000)
                    })
                    .attr('cx', (item) => {
                        return xScale(item['Year'])
                    })
                    .attr('cy', (item) => {
                        return yScale(item['Seconds']*1000)
                    })
                    .attr('fill', (item) => {
                        if(item['Doping']!= ''){
                            return '#F27438'
                        }else{
                            return '#7AA95C'
                        }
                    })
                    .on('mouseover',(event,item) =>{
                    
                        tooltip.transition()
                                .style('opacity',0.9)
                                .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                                .style('left', (event.pageX+10)+'px') 
                                
                        tooltip.html(
                            item['Name']+' '+item['Nationality']
                            +"</br>"
                            +'Année: '+item['Year']+',  Temps: '+item['Time']
                            +(item['Doping'] ? '<br/>' +item['Doping'] : '')
                        )                          
                          
                        document.querySelector('#tooltip').setAttribute('data-year',item['Year'])
                    })
                    .on('mouseout', (item) => {
                        tooltip.transition()
                                .style('opacity',0)
                    })
}

/*Crée le titre des axes*/
const nameAxes =() =>{
    
    /*titre axe des y*/
    svgContainer.append('text')
                .attr('transform','rotate(-90)')
                .attr('x',(-height)/2)
                .attr('y',margin.right/2)
                .style('font-size',16)
                .text('Temps en minutes : secondes')

    /*titre axe des x*/
    svgContainer.append('text')                
                .attr('x',width/2)
                .attr('y',height-margin.bottom/2)
                .style('font-size',16)
                .text('Année')
}

/*Crée les axes x et y*/
const createAxes = () =>{

    let xAxis=d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
  
    svgContainer.append("g")
                .call(xAxis)
                .attr('id','x-axis')
                .attr('transform','translate(0,'+(height-margin.top)+')')

    let timeFormat = d3.timeFormat('%M:%S') //Temps au format minute : seconde
    let yAxis=d3.axisLeft(yScale)
                .tickFormat(timeFormat)

    svgContainer.append("g")
                .call(yAxis)
                .attr('id','y-axis')
                .attr('transform','translate('+(margin.left)+',0)')     
       
}

/*récupération et utilisation des données dataJson*/
d3.json(dataUrl).then(function(dataJson){   
   
    dataValues=dataJson //alimente dataValues pour le .data des cercles
     
    //alimente la variable en temps de course
    time=dataJson.map( (item) => {
        return (item['Seconds']*1000)
    })
    
    //alimente la variable en années de course
    year=dataJson.map( (item) => {
        return (item['Year'])
    })
    
    drawSvgContainer()
    propertyScales()
    drawPlots ()
    nameAxes()
    createAxes()
})  

/*Info bulle*/
const tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')               
                .style("opacity", 0)            