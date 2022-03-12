window.addEventListener("load", foo);

function foo(){
	document.getElementById("canvas").addEventListener("dblclick", create_vertex);
}

var count = 0;

//和dijkstra类似，这里就不做过多的注释了
var Graph = new Object();

Graph.Vertices = new Array();	
Graph.Edges = new Array();		

function _add_vertex(vertex){

	var V = new Object();	
	V.element = vertex;
	V.Adj = new Array();
	V.visited = false;
	V.discovered = false;

	Graph.Vertices.push(V);
}


function _add_edge(origin,endpoint,line,weight){
	edge = new Object();	
	edge.origin = origin;		
	edge.endpoint = endpoint;
	edge.weight = weight;
	edge.line = line;

	Graph.Edges.push(edge);

	s = get_graph_vertex(origin);
	d = get_graph_vertex(endpoint);

	if (check_duplicates_in_Adj(s,d))	
	{
		s.Adj.push(d);
		d.Adj.push(s);
	}

	else
	{
		alert("边已经存在了，不能有多条边！");
		line.parentNode.removeChild(line);	
	}

}


function check_duplicates_in_Adj(u,v){

	var i;
	var j;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		for(j=0; j < Graph.Vertices.length; j++)
		{
			if (Graph.Vertices[i] == u && Graph.Vertices[i].Adj[j] == v)
			{
				return false;
			}
		}
	}
	return true;
}


function get_graph_vertex(div){


	var i;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		if (Graph.Vertices[i].element.id == div.id)
		{
			return Graph.Vertices[i];
		}
	}
}

function _show_edges(){			
	var i;
	for(i=0; i < this.Edges.length; i++)
	{
		alert(this.Edges[i].weight);
	}
}

function _show_vertices(){		
	var i;
	var j;
	var s = "";
	for(i=0; i < this.Vertices.length; i++)
	{
		s = s + this.Vertices[i].element.id + " : ";
		for(j=0; j< this.Vertices[i].Adj.length; j++)
		{
			s = s + this.Vertices[i].Adj[j].element.id + "--";
		}
		s = s + "\n";
	}
	alert(s);
}

function _weight(origin,endpoint){
	s = origin.element.id;
	d = endpoint.element.id;

	var i;
	for(i=0; i < Graph.Edges.length; i++)
	{
		if(Graph.Edges[i].origin.id == s && Graph.Edges[i].endpoint.id == d){
			return Graph.Edges[i].weight;
		}

		if(Graph.Edges[i].endpoint.id == s && Graph.Edges[i].origin.id == d){
			return Graph.Edges[i].weight;
		}
	}
}


Graph.add_vertex = _add_vertex;
Graph.add_edge = _add_edge;
Graph.show_vertices = _show_vertices;
Graph.show_edges = _show_edges;
Graph.weight = _weight;

//样式部分
var start_x = null;
var start_y = null;
var start_div = null;

var end_x = null;
var end_y = null;
var end_div = null;

function create_vertex(e){
	x = parseInt(e.clientX);		
	x = x - 30;						
	y = parseInt(e.clientY);		
	y = y - 90;						

	var div = document.createElement("div");
	var div_text = document.createElement("p");

	count = count + 1

	
	div.style.zIndex = "2";
	div.style.position = "absolute";
	div.id = count;
	div_text.innerHTML = count;
	div_text.style.position = "relative";
	div_text.style.marginLeft = "15px";
	div_text.style.marginTop = "10px";
	div.style.backgroundColor = "white";
	div.style.border = "2px solid #404040";
	div.style.borderRadius = "50%";
	div.style.color = "black";
	div.style.transitionProperty = "background-color";
	div.style.transitionDuration = "1s";


	div.style.height = "40px";
	div.style.width = "40px";

	
	div.style.marginLeft = x + "px";
	div.style.marginTop = y + "px";
	
	div.appendChild(div_text);

	
	div.addEventListener("mousedown", get_origin_coordinates);
	div.addEventListener("mouseup", get_destination_coordinates);

	document.getElementById("canvas").appendChild(div);

	Graph.add_vertex(div);
}

function get_origin_coordinates(){
	start_x = parseInt(this.style.marginLeft) + 20;		
	start_y = parseInt(this.style.marginTop) + 20;		
	start_div = this;
}

function get_destination_coordinates(){
	end_x = parseInt(this.style.marginLeft) + 20;		
	end_y = parseInt(this.style.marginTop) + 20;		
	end_div = this;

	if(start_x != null && start_y != null && end_x != null && end_y != null) 
	{	
		createLine(start_div,end_div, start_x, start_y, end_x, end_y); 		
	}

	start_x = null;			
	start_y = null;		
	end_x = null;			
	end_y = null;		
	start_div = null;
	end_div = null;	
}


function createLine(start_div, end_div, x1, y1, x2, y2){

	var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));	
	var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;	
	var transform = 'rotate('+angle+'deg)';						
	var weight = window.prompt("请输入边的长度：");

	var line = document.createElement("div");	
	s = "<span style=\"font-size:20px;position:absolute;margin-top:10px;font-weight:bold;\">" + weight +"</span>";	

	line.id = "edge_" + start_div.id + "_" + end_div.id;		
	line.className = "line";
	
	line.style.position = "absolute";
	line.style.transform = transform;
	line.style.width = length;
	line.style.marginLeft = x1;
	line.style.marginTop = y1;
	line.style.textAlign = "center";
	line.innerHTML = s;
	
	document.getElementById("canvas").appendChild(line);
	Graph.add_edge(start_div,end_div,line,weight);
}



//kruskal实现
function _insert(edge){
	this._data.push(edge);
	this._size = this._size + 1;
}

function _extract_min(){
	var i;
	var min = 0;
	for(i=0; i < this._data.length; i++)
	{
		if(parseInt(this._data[i].weight) < parseInt(this._data[min].weight))
		{
				min = i;
		}	
	}

	var last = this._data.length - 1;

	var temp = this._data[last];
	this._data[last] = this._data[min];
	this._data[min] = temp;
	this._size = this._size - 1;

	var deleted = this._data[last];
	this._data.pop()

	return deleted;
}

function _is_empty(){
	return this._size == 0;
}



var PriorityQueue = new Object();
PriorityQueue._data = new Array();
PriorityQueue._size = 0;

PriorityQueue.is_empty = _is_empty;
PriorityQueue.insert = _insert;
PriorityQueue.extract_min = _extract_min;


function show_arr(arr){
	var i;
	var s = " ";
	
	for(i=0; i < arr.length; i++)
	{

		s = s + arr[i]._name + ", ";
	}

	

	alert(s);
}

var MST = new Object();
MST.Vertices = new Array();
MST.edge_count = 0;

function MST_add_vertex(n){
  var MSTVertex = new Object();
  MSTVertex._name = n;
  MSTVertex.Adj = new Array();
  MSTVertex.visited = false;
  MST.Vertices.push(MSTVertex);

  return MSTVertex;
}

function MST_add_edge(origin,endpoint){
  if(MST_check_duplicates(origin,endpoint)){



    	origin.Adj.push(endpoint);
    	endpoint.Adj.push(origin);


    	this.edge_count = this.edge_count + 1;
 
  }
}

function MST_check_duplicates(u,v){
  var i,j;
  for(i=0; i < MST.Vertices.length; i++)
  {
    if(MST.Vertices[i] == u){
      for(j=0; j < MST.Vertices.length; j++)
      {
        if(MST.Vertices[i].Adj[j] == v){
          return false;
        }
      }
    }
  } 
  return true;
}

function MST_get_vertex(n){
	var i;
	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == n){
			return MST.Vertices[i];
		}
	}
}

MST.add_vertex = MST_add_vertex;
MST.add_edge = MST_add_edge;
MST.get_vertex = MST_get_vertex;



function creates_cycle(edge){

	var s = edge.origin.id;
	var d = edge.endpoint.id;


	var ufound = false;
	var vfound = false;

	var i;
	var j;

	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == s){
			ufound = true;
			break;
		}
	}

	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == d){
			vfound = true;
			break; 
		}
	}


	if(ufound == true && vfound == true){

		var u = MST_get_vertex(s);
		var v = MST_get_vertex(d);
		var result = MST_DFS(u,v);
		if(result == false){
			MST_add_edge(u,v);
		}

		return result;
	}

	else if(ufound == false && vfound == false){
	
		var u = MST.add_vertex(s);
		var v = MST.add_vertex(d);
		MST.add_edge(u,v);
		return false;
	}

	else if(ufound == true && vfound == false){
		
			var u = MST.get_vertex(s);
			var v = MST.add_vertex(d);
			MST.add_edge(u,v);
			return false;
		}

	else if(ufound == false && vfound == true){
			
			var u = MST.add_vertex(s);
			var v = MST.get_vertex(d);
			MST.add_edge(u,v);
			return false;
		}

	return true;
}

function MST_DFS(u,d){


	u.visited = true;

	for(i=0; i < MST.Vertices.length; i++)
	{
		MST.Vertices[i].visited = false;
	}

	MST_DFS_Visit(u);

	if(d.visited == true){

		return true;
	}



	return false;
}

function MST_DFS_Visit(u){



	var j;

	for(j=0; j < u.Adj.length; j++)
	{
		v = u.Adj[j];

		if (v.visited == false)
		{
			v.visited = true;
			MST_DFS_Visit(v);
		}
	}


}

function show_me_the_vertices(){
  var i;
  for(i=0; i < MST.Vertices.length; i++)
  {
    alert(MST.Vertices[i]._name);
  }
}



function Kruskal(){
	var i;
	var count = 0;
	for(i=0; i < Graph.Edges.length; i++)
	{
		PriorityQueue.insert(Graph.Edges[i]);
	}



	while(MST.edge_count != Graph.Vertices.length - 1)
	{
		var e = PriorityQueue.extract_min();
		if(! creates_cycle(e)){
			color_edge(e, count, "#8cff66");
		}

		else{
			color_edge(e, count, "#ff9933");
		}
		count = count + 1;

	}
}


function color_edge(edge,count,color){
	var edge_line = edge.line;
	edge_line.style.transitionDelay = count + "s";
	edge_line.style.backgroundColor = color;
	edge_line.color = "white";
}


function get_vertex(name){
	var i;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		if(Graph.Vertices[i].element.id == name){
			return Graph.Vertices[i];
		}
	}
}


function Restart(){
	var i;

	for(i=0; i<Graph.Vertices.length; i++)
	{
		Graph.Vertices[i].element.style.transitionDelay = "0s";
		Graph.Vertices[i].element.style.backgroundColor = "white";
	}

	for(i=0; i<Graph.Edges.length; i++)
	{
		Graph.Edges[i].line.style.transitionDelay = "0s";
		Graph.Edges[i].line.style.backgroundColor = "black";
		Graph.Edges[i].line.style.color = "black";
	}

	while(MST.Vertices.length != 0)
	{
		MST.Vertices.pop();
	}

	while(! PriorityQueue.is_empty())
	{
		PriorityQueue.extract_min();
	}
}

function CleanCanvas(){
	location.reload();
}
