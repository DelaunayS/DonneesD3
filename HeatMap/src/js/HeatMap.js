
/*Déclarations des variables*/
const dataUrl ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

let dataJson  //stocke les données du fichier json
let values=[] //tableau avec les valeurs date et variation
let baseTemperature  //temperature de bas de la Terre
let year,month

let yScale,xScale,legendScale

const margin={top: 50, right: 30, bottom: 10, left: 70},
width=1000,
height=700

/*Zone du svg Container*/ 
let svgContainer = d3.select('#graphContainer')

const drawSvgContainer = () =>{
    svgContainer.attr("width", width)
                .attr("height", height)  
}

/*Definit les propriétes des échelles des axes x et y*/
const propertyScales = () =>{

    /*Echelle des y*/   
    yScale = d3.scaleTime()
                .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])      
                .range([margin.bottom,height-margin.top])
                
                
    
    /*Echelle des x*/
    xScale=d3.scaleTime()
            .domain([d3.min(year),d3.max(year)])
            .range([margin.left,width-margin.right])            
        
}
console.log(Math.ceil((height-margin.top-margin.bottom)/12))
/*Dessine toutes les barres rectangulaires du graphique*/
const drawBars = () =>{

    svgContainer.selectAll('rect')
                .data(values)
                .enter()
                .append('rect')
                .attr('class','cell')
                .attr('fill', (item) => {
                    if(item['variance']<-2.5){
                        return '#660099'  
                    }else if(item['variance']<-1.5){
                        return '#0000ff'  
                    }else if(item['variance']<-0.5){
                        return '#00ffff'
                    }else if(item['variance']<0.5){
                        return '#00ff00'
                    }else if(item['variance']<1.5){
                        return '#ffff00'
                    }else if(item['variance']<2.5){
                        return '#ED7F10'
                    }else{
                        return '#ff0000'}                   
        
                })
                .attr('data-month',(item) => {
                    return item['month']-1
                })
                .attr('data-year', (item) => {
                    return item['year']
                })
                .attr('data-temp', (item) => {
                    return item['variance']+baseTemperature
                })
                .attr('height', Math.ceil((height-margin.top-margin.bottom)/12)-1)
                .attr('y', (item) => {
                    return yScale(new Date (0,item['month']-1,0,0,0,0,0))
                })
                
                .attr('width', 
                (width-margin.left-margin.right)/((d3.max(year))-(d3.min(year)))
                )
                .attr('x', (item) =>{
                    return xScale(item['year'])
                })   
                .on('mouseover',(event,item) =>{                    
                    tooltip.transition()
                            .style('opacity',0.9)
                            .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                            .style('left', (event.pageX+10)+'px') 
                            
                    tooltip.html(
                        afficheMois(item['month']-1)+' - '+item['year']
                        +"</br>"
                        + 'Température = '+ Math.round((baseTemperature+item['variance'])*100)/100+'°C'
                        +"</br>"
                        + 'Variation = '+item['variance']+'°C'
                        
                        
                    )                          
                      
                    document.querySelector('#tooltip').setAttribute('data-year',item['year'])
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
                .text('Mois')

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

    let timeFormat = d3.timeFormat('%B') //Temps au format mois
    
    let yAxis=d3.axisLeft(yScale)
                .tickFormat(timeFormat)
                
    svgContainer.append("g")
                .call(yAxis)                
                .attr('id','y-axis')
                .attr('transform','translate('+(margin.left)+',0)')   
}

/*Création de  la legende*/
const createLegend = () =>{

    let svgLegend = d3.select('#legend')
                 
    let arg
    
    /*ajout d'une explication*/
    svgLegend.append('text') 
            .attr('y','25')
            .attr('x','20')                     
            .text('Variation / température de base (8,66°C) : ')

    /*définit l'ajout d'un rectangle dans la légende*/
    const addRect = (arg) => {                  
    
        let color

        switch (arg) {
            case 0:
                color='#660099'            
                break;
            case 1:
                color='#0000ff'            
                break;    
            case 2:
                color='#00ffff'            
                break;
            case 3:
                color='#00ff00'            
                break;
            case 4:
                color='#ffff00'            
                break;
            case 5:
                color='#ED7F10'
                break;
            case 6:
                color='#ff0000'
                break;        
        default:
                break;
        }
        
        svgLegend.append('rect')
            .attr('class','legendCell') 
            .attr('fill',color)     
            .attr('width','50')
            .attr('height','25')
            .attr('y','10')
            .attr('x',(arg*50)+400)
    }  
    /*définit l'axe de la légende et ses valeurs*/

    let scaleLegend=d3.scaleLinear()
        .domain([-2.5,2.5])
        .range([450,700])
    
    let legend_axis=d3.axisBottom()
                      .scale(scaleLegend)

      
        svgLegend.attr("width", width)
                .attr("height", 60)         

        for (let i=0;i<7;i++){
            addRect(i)
        }   
        
        svgLegend.append('g') 
                .call(legend_axis) 
                .attr('class','legend_axis')                  
                .attr('transform','translate(0,35)')    
}     

/*récupération et utilisation des données dataJson*/
d3.json(dataUrl).then(function(dataJson,error){   
   
    if (error){
        throw console.log(error)
    }else{

        baseTemperature=dataJson.baseTemperature // alimente la variable avec la constante de température
        values=dataJson.monthlyVariance //alimente la variable avec l'objet monthlyVariance
            
        //alimente la variable en années d'observation
        year=values.map( (item) => {
            return (item['year'])
        })
    
        drawSvgContainer()
        propertyScales()
        drawBars ()
        nameAxes ()
        createAxes()
        createLegend () 
    }    
})  

/*Info bulle*/
const tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')               
                .style("opacity", 0)      

const afficheMois = (numberOfMonth) => {
    switch (numberOfMonth) {
        case 0:
            return 'Janvier'            
            break;
        case 1:
            return 'Février'
            break;
        case 2:
            return 'Mars'            
            break;
        case 3:
            return 'Avril'
            break;
        case 4:
            return 'Mai'            
            break;
        case 5:
            return 'Juin'
            break;
        case 6:
            return 'Juillet'            
            break;
        case 7:
            return 'Août'
            break;        
        case 8:
            return 'Septembre'
            break;
        case 9:
            return 'Octobre'            
            break;
        case 10:
            return 'Novembre'
            break;
        case 11:
            return 'Décembre'            
            break;
                            
        default:
            return 'Non renseigné'
            break;
    }
}