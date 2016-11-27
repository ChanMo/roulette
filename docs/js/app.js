$(function(){
    /** remove loading **/
    $(".loading").hide();
  /** create result box **/
  //show_box();
  /** prevent default touchmove event **/
  $("body").bind('touchmove dbclick', function(e){
    e.preventDefault();
  });

});

/**
 * set rottle main
 */
function set_rottle(prize_list){
  /** define global var **/
  var height = $("body").height();
  var width = $("body").width();
  var cx = width/2; //circle cx
  var cy = height*0.45; //circle cy
  var r = (cx*0.8>200) ? 200 : cx*0.8; //max is 200px
  var degree, radian;
  var rottle = Snap("100%","100%");

  /** bg **/
  rottle.image("https://s-media-cache-ak0.pinimg.com/564x/21/93/da/2193da2c0ea61d7efbc0de5a9d4dfc44.jpg", 0, 0, "100%", "100%");

  /** main rottle **/
  // background
  rottle.circle(cx,cy,r).attr({fill:"snow"});

  /** marquee **/
  var marquee = rottle.circle(cx, cy, r-10).attr({
    stroke:"green",
    'stroke-width':'15px',
    'fill-opacity':0
  });

  // light
  var light;
  var m_cx = cx - Math.sin(2/36*Math.PI)*(r-10);
  var m_cy = cy - Math.cos(2/36*Math.PI)*(r-10);
  for(var i=0;i<36;i++){
    light = (i%2) ? "light-on" : "light-off";
    rottle.circle(m_cx,m_cy,4).attr({
      class: "marquee-item " + light,
      transform:"rotate("+360/36*i+" "+cx+","+cy+")"
    });
  }

  /** prize **/
  var p_r = r-20;
  var prize_count = prize_list.length;  // prize count
  degree = 360/prize_count;
  radian = 2/prize_count*Math.PI;

  var p_cx1 = cx - Math.sin(radian*(-0.5))*p_r;
  var p_cy1 = cy - Math.cos(radian*(-0.5))*p_r;
  var p_cx2 = cx - Math.sin(radian*(+0.5))*p_r;
  var p_cy2 = cy - Math.cos(radian*(+0.5))*p_r;
  var t_x = cx - Math.sin(2*Math.PI)*(p_r-20);
  var t_y = cy - Math.cos(2*Math.PI)*(p_r-20);
  var g = rottle.g().attr({
    id: "prizes"
  });

  for(i=0;i<prize_count;i++){
    var background = (i%2) ? "#ffeb7b" : "#ffff91";
    var path = rottle.path("M"+p_cx1+" "+p_cy1+" A"+p_r+" "+p_r+" 0,0,0 "+p_cx2+" "+p_cy2+" L"+cx+" "+cy+" Z").attr({
      transform:"rotate("+degree*i+" "+cx+","+cy+")",
      fill:background,
      'data-id': prize_list[i].id
    });

    // prize name
    var text = rottle.text(t_x,t_y,prize_list[i].name).attr({
      transform:"rotate("+degree*i+" "+cx+","+cy+")",
      'text-anchor':"middle",
      fill: '#bc00c7',
      'font-size': 14
    });

    // prize image
    var image = rottle.image(prize_list[i].image,t_x-10,t_y+10,"20","20").attr({
      transform:"rotate("+degree*i+" "+cx+","+cy+")"
    });
    g.add(path,text,image);
  }

  /** point **/
  var point_w = 50;
  rottle.image(
    "img/icons/5.png",
    cx-point_w/2,
    cy-point_w*1.5/1.5,
    point_w,
    point_w*1.5
  ).attr({
    onclick: 'rottle()'
  });


  /** extra icons **/
  //rottle.image("img/icons/santa.png", "10%", "65%", 80, 80);
  rottle.image("img/icons/santa.png", "65%", "65%", 80, 80);


  /************************ create result box ***********************/
  var result = Snap("100%","100%").attr({class:"result-box"});
  var cx2 = width/2;
  var cy2 = height/2.2;

  /** create stars **/
  /**
  for(i=0; i<10; i++){
    result.image("http://qifeng.chirongkeji.com/static/prize/img/star.png", cx2-15, cy2-15, "30", "30").attr({
      class:'result-box-star'
    });
  }
  **/
  //set_star_ani();

  /** set title **/
  var title = result.image("http://qifeng.chirongkeji.com/static/prize/img/result_title.png", (width-327/3)/2, "20%", 327/3, 104/3);

  /** set prize info **/
  var prize_image_width = 100;
  var prize_image = result.image(
    "img/icons/1.png",
    cx2-prize_image_width/2,
    cy2-prize_image_width/2,
    prize_image_width,
    prize_image_width
  ).attr({
    class: "result-box-image"
  });
  var prize_name = result.text(
    cx2,
    cy2+prize_image_width/2+20,
    "Blackberry Priv"
  ).attr({
    class: "result-box-name",
    'text-anchor':"middle",
    fill:"white"
  });
  var prize = result.g(prize_image, prize_name);

  /** close button **/
  var close = result.image("http://qifeng.chirongkeji.com/static/prize/img/close.png", (width-316/2.5)/2, "70%", 316/2.5, 106/2.5);
  close.attr({class:'result-box-close',onclick:'close_box()'});
}


/**
 * set result box animation
 */
/**
function set_star_ani(){
  var stars = $(".result-box-star");
  for(var i=0; i<stars.length; i++){
    TweenMax.to(stars[i], 5, {
      x: Math.random()*200*get_random_pn(),
      y: Math.random()*200*get_random_pn(),
      opacity: 0,
      delay: Math.random() * 10,
      ease: Strong.easeInOut,
      repeat: -1
    });
  }
}
**/

function get_random_pn(){
  return (Math.random() < 0.5) ? -1 : 1;
}


/**
 * start
 **/
function rottle(){
  var prizes = $("#prizes");
  var index = parseInt(Math.random() * prizes.find("path").length);
  var degree = -index * 360 / 12;
  var end_degree = 360*10 + degree;

  /** use TweenMax **/
  TweenMax.to(prizes, 5, {
    rotation: end_degree,
    transformOrigin: "50% 50%",
    ease: Quad.easeInOut,
    //overwrite: 'preexisting',
    immediateRender: 'false',
    onComplete:function(){
      var text = prizes.find("text").eq(index).html();
      var image = prizes.find("image").eq(index).attr("href");
      $(".result-box-image").attr("href", image);
      $(".result-box-name").html(text);
      show_box();
    }
  });
}


/**
 * show box
 */
function show_box(){
  //document.getElementById("open-audio").play();
  $("#result-bg").show();
  TweenMax.fromTo($(".result-box"), .5, {
    left: "50%",
    top: "50%",
    width: 0,
    height: 0
  },{
    left:0,
    top:0,
    width:"100%",
    height:"100%",
    ease:Elastic.easeOut
  });
}


/**
 * close box
 */
function close_box(){
  document.getElementById("open-audio").play();
  TweenMax.to($(".result-box"), .1, {
    left:"50%",
    top:"50%",
    width:0,
    height:0
  });
  $("#result-bg").hide();
}
