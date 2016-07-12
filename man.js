/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getMousePos(ev)
{
    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
    return {x: ev.clientX+scrollLeft, y: ev.clientY+scrollLeft};
}
function randomNum(min,max)
{
    return parseInt(Math.random()*999)%(max-min+1)+min;
}
window.onload = function()
{
    var oDiv1 = document.getElementById('div1');
    var oMain = document.getElementById('main');
    var oStart = document.getElementById('start');
    var oMan = document.getElementById('man');
    
    var oB = getByClass(oMain,'bullet')[0];
    var oEnd = getByClass(oDiv1,'end')[0];
    
    var oLevel = getByClass(oDiv1,'level')[0];
    var oScore = getByClass(oDiv1,'score')[0];
    var oProgress=document.getElementById('progress');
    var oProgressSpan = oProgress.getElementsByTagName('span')[0];
    
    var iTimer = null;
    var arrBullet = [];
    var MAX_SPEED=5;
    var MIN_SPEED=2;
    var NUM_BULLET = 10;
    var iLevel = 1;
    var iScore = 0;
    
    
//    alert(oDiv1.offsetLeft+":"+oMain.offsetWidth);
    oStart.onclick = function(ev)
    {
        oStart.style.display = 'none';
        oMan.style.display='block';
        (document.onmousemove = function (ev)
        {
            var oEvent = ev || event;
            var pos = getMousePos(oEvent);
            var l = oEvent.clientX - oDiv1.offsetLeft - oMan.offsetWidth / 2;
            var t = oEvent.clientY - oDiv1.offsetTop - oMan.offsetHeight;
            if (l < 0)
            {
                l = 0;
            } else if (l >= oMain.offsetWidth - oMan.offsetWidth)
            {
                l = oMain.offsetWidth - oMan.offsetWidth;
            }
            if (t < 0)
            {
                t = 0;
            } else if (t >= oMain.offsetHeight - oMan.offsetHeight)
            {
                t = oMain.offsetHeight - oMan.offsetHeight;
            }
            oMan.style.left = l + 'px';
            oMan.style.top = t + 'px';
//            document.title=oMan.offsetLeft+":"+oMan.offsetTop+":"+oB.offsetLeft+":"+oB.offsetTop;
        })(ev);
        for(var i = 0; i< NUM_BULLET; i++)
        {
            createBullet();
        }
        
        var before = (new Date()).getTime();
        var after = (new Date()).getTime();
        
        iTimer = setInterval(function()
        {
            for(var i = 0; i<arrBullet.length; i++)
            {
                arrBullet[i].x += arrBullet[i].speedX;
                arrBullet[i].y += arrBullet[i].speedY;
                arrBullet[i].obj.style.left = arrBullet[i].x+'px';
                arrBullet[i].obj.style.top = arrBullet[i].y+'px';
                if(arrBullet[i].x<0||arrBullet[i].x>oMain.offsetWidth||arrBullet[i].y<0||arrBullet[i].y>oMain.offsetHeight)
                {
                    removeBullet(arrBullet[i]);
                    createBullet();
                    i--;
                }
                //game over
                if(collisionDetection(arrBullet[i].obj,oMan))
                {
                    clearInterval(iTimer);
                    document.onmousemove = null;
                    oEnd.style.display = 'block';
                }
                
            }
            var t = (new Date()).getTime()-after;
           
            var iScore = parseInt(t/300);
            
            oScore.innerHTML='得分:'+iScore;
            oLevel.innerHTML='难度:'+iLevel;
            var t=(new Date()).getTime()-before;
            var scale=100*(1-t/(3*1000));
            document.title=scale;
            if(scale<0)
            {
                oProgressSpan.style.width = 0 + '%';
                before = (new Date()).getTime();
                createBullet();
                //NUM_BULLET++;
                MAX_SPEED += 0.2;
                iLevel++;
            }else
            {
                oProgressSpan.style.width=scale+'%';
            }
        },30);
        
        function createBullet()
        {
            var x, y, speedX=0, speedY=0;
            var random = randomNum(1,4);
            switch(random)
            {
                case 1:   //up
                    x= randomNum(0, oMain.offsetWidth);
                    y= 0;
                    speedX=randomNum(-MAX_SPEED,MAX_SPEED);
                    speedY=randomNum(MIN_SPEED,MAX_SPEED);
                    break;
                case 2:    //left
                    x=0;
                    y=randomNum(0,oMain.offsetHeight);
                    speedX=randomNum(MIN_SPEED,MAX_SPEED);
                    speedY=randomNum(-MAX_SPEED,MAX_SPEED);
                    break;
                case 3:    //bottom
                    x=randomNum(0,oMain.offsetWidth);
                    y=oMain.offsetWidth;
                    speedX=randomNum(-MAX_SPEED,MAX_SPEED);
                    speedY=randomNum(-MAX_SPEED,-MIN_SPEED);
                    break;
                case 4:   //right
                    x= oMain.offsetWidth;
                    y= randomNum(0,oMain.offsetHeight);
                    speedX=randomNum(-MAX_SPEED,-MIN_SPEED);
                    speedY=randomNum(-MAX_SPEED,MAX_SPEED);
                    break;
            }
            var oBullet = document.createElement('div');
            oBullet.className='bullet';
            oBullet.style.left= x+'px';
            oBullet.style.top= y+'px';
            oMain.appendChild(oBullet);
            arrBullet.push({obj:oBullet, x: x, y: y, speedX: speedX, speedY: speedY});
        }
        function removeBullet(oBullet)
        {
            var result = [];
            for(var i = 0; i< arrBullet.length; i++)
            {
                if(arrBullet[i]!==oBullet)
                {
                    result.push(arrBullet[i]);
                }
            }
            oMain.removeChild(oBullet.obj);
            arrBullet=result;
        }
        function collisionDetection(oBullet, oMouse)
        {
            var left1 = oBullet.offsetLeft;
            var right1 = oBullet.offsetLeft+oBullet.offsetWidth;
            var top1 = oBullet.offsetTop;
            var bottom1 = oBullet.offsetTop+oBullet.offsetHeight;
            
            var left2 = oMouse.offsetLeft;
            var right2 = oMouse.offsetLeft+oMouse.offsetWidth;
            var top2 = oMouse.offsetTop;
            var bottom2 = oMouse.offsetTop+oMouse.offsetHeight;
            if(left1>right2||left2>right1||top1>bottom2||top2>bottom1)
            {
                return false;
            }else
                return true;
        }
    };
    
};

