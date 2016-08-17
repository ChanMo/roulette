$(function(){
  show_box(".code-box", "10%", "25%", "80%", 200);
  /** prevent default touchmove event **/
  $("body").bind('touchmove dbclick', function(e){
    e.preventDefault();
  });

});

/**
 * input code
 */
function check_code(){
  var code = $(".code-box").find("input").val();
  if(code == ''){
    $(".code-box").find("span").html('您的抽奖码不正确');
  }else{
    $.get('http://qifeng.chirongkeji.com/prize/check_code/?code='+code, function(data){
      console.log(data);
      if(data.code == '001'){
        $("body").data("code", code);
        close_box(".code-box");
      }else{
        $(".code-box").find("span").html('您的抽奖码不正确');
      }
    });
  }
}

/**
 * set rottle main
 */
function set_rottle(prize_list){
  /** define global var **/
  var height = $("body").height();
  var width = $("body").width();
  var cx = width/2; //circle cx
  var cy = height*0.48; //circle cy
  var r = (cx*0.9>200) ? 200 : cx*0.8; //max is 200px
  var degree, radian;
  var rottle = Snap("100%","100%");

  /** bg **/
  rottle.image("img/bg.png", 0, 0, "100%", "100%");

  /** main rottle **/
  rottle.circle(cx,cy,r).attr({fill:"#ca7a00"});

  /** marquee **/
  var marquee = rottle.circle(cx, cy, r-10).attr({
    stroke:"#7e0052",
    'stroke-width':'15px',
    'fill-opacity':0
  });
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
  var prize_count = prize_list.length;
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

    var text = rottle.text(t_x,t_y,prize_list[i].name).attr({
      transform:"rotate("+degree*i+" "+cx+","+cy+")",
      'text-anchor':"middle",
      fill: '#bc00c7',
      'font-size': 14
    });

    var image = rottle.image(prize_list[i].image,t_x-10,t_y+10,"20","20").attr({
      transform:"rotate("+degree*i+" "+cx+","+cy+")"
    });
    g.add(path,text,image);
  }

  /** point **/
  // rottle.circle(cx,cy,"40").attr({
  //   fill: "#ddd",
  //   onclick: 'rottle()'
  // });
  var point_w = 50;
  rottle.image(
    "img/point.png",
    cx-point_w/2,
    cy-point_w*120/106,
    point_w,
    point_w*172/106
  ).attr({
    onclick: 'rottle(this)'
  });

  /** rule **/
  var rule_top = height*0.8;
  var rule_left = width*0.1;
  var rule_right = width*0.9;
  rottle.text(rule_left, rule_top-10, "活动规则").attr({fill:"#b886a9"});
  var line1_top = 0;
  var line1 = "M"+rule_left+" "+(rule_top+line1_top)+" L"+rule_right+" "+(rule_top+line1_top)+" O";
  var line2_top = 85;
  var line2 = "M"+rule_left+" "+(rule_top+line2_top)+" L"+rule_right+" "+(rule_top+line2_top)+" O";
  rottle.path(line1).attr({
    'stroke-dasharray':"5,5",
    stroke:"#b886a9"
  });
  rottle.path(line2).attr({
    'stroke-dasharray':"5,5",
    stroke:"#b886a9"
  });
  var rules = new Array(
    "1、每一个抽奖码，对应一次抽奖机会",
    "2、抽到红包，会“自动存入”到您的微信零钱",
    "3、抽到奖品，我们会尽快联系寄送奖品给您",
    "祝你好运哦~"
  );
  for(i=0;i<rules.length;i++){
    rottle.text(rule_left, rule_top+18*(i+1), rules[i]).attr({
      'font-size': 13,
      fill:"#b886a9"
    });
  }

  /** icon **/
  rottle.image("img/prize.png", "10%", "65%", 80, 80*129/168);
  rottle.image("img/girl.png", "70%", "60%", 60, 60*224/94);


  /************************ create result box ***********************/
  var result = Snap("100%","100%").attr({class:"result-box"});
  var cx2 = width/2;
  var cy2 = height/2;

  /** create stars **/
  for(i=0; i<10; i++){
    result.image("img/star.png", cx2-15, cy2-15, "30", "30").attr({
      class:'result-box-star'
    });
  }
  set_star_ani();

  /** set title **/
  var title = result.image("img/result_title.png", (width-327/3)/2, "20%", 327/3, 104/3);

  /** set prize info **/
  var prize_image_width = 80;
  var prize_image = result.image(
    "img/wallet.png",
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
    fill:"#4c3116"
  });
  var prize = result.g(prize_image, prize_name);

  /** close button **/
  var close = result.image("img/close.png", (width-316/2.5)/2, "70%", 316/2.5, 106/2.5);
  close.attr({class:'result-box-close',onclick:'close_box(".result-box");$("#result-bg").hide();'});
}


/**
 * set result box animation
 */
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

function get_random_pn(){
  return (Math.random() < 0.5) ? -1 : 1;
}


/**
 * start
 **/
function rottle(ele){
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
    onStart: function(){
      /** remove element rottle event **/
      $(ele).removeAttr("onclick");
    },
    onComplete:function(){
      /** add element new click event **/
      $(ele).bind("click", function(){
        show_box(".error-alert", "10%", "30%", "80%", 160);
      });

      var text = prizes.find("text").eq(index).html();
      var image = prizes.find("image").eq(index).attr("href");
      $(".result-box-image").attr("href", image);
      $(".result-box-name").html(text);

      document.getElementById("open-audio").play();
      $("#result-bg").show();
      show_box(".result-box", 0, 0, "100%", "100%");
    }
  });
}


/*****************8 common function *************************/

/**
 * show_box
 */
function show_box(e, left, top, width, height){
  $(".bg").show();
  TweenMax.fromTo(e, .5, {
    left: "50%",
    top: "50%",
    width: 0,
    height: 0,
    display: 'none'
  },{
    left: left,
    top: top,
    width: width,
    height: height,
    display: 'block',
    ease:Elastic.easeOut
  });
}
function close_box(e){
  $(".bg").hide();
  TweenMax.to(e, .1, {
    left:"50%",
    top:"50%",
    width:0,
    height:0,
    display: 'none'
  });
}
