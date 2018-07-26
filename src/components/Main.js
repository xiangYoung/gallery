require('normalize.css/normalize.css');
require('styles/App.css');

// 获取图片数据
var imageDatas = require('../data/imageData.json');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');
// 利用自执行函数 将图片信息转成url
imageDatas = (function getImageDataURL(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImgData = imageDataArr[i];
    singleImgData.imageURL = require('../images/' + singleImgData.fileName);
    imageDataArr[i] = singleImgData;
  }
  return imageDataArr;
})(imageDatas);

class SingleFigure extends React.Component{
  render(){
    let styleObj = {};

    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    const { data } = this.props
    return (
      <figure className='imgFigure' style={styleObj}>
        <img src={data.imageURL} alt={data.title} style={{ width: 240, height: 240}}/>
        <figcaption>
          <h2 className='imgTitle'>{data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}
class AppComponent extends React.Component {
  state = {
    Constant:{
      centerPos : {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {
        x: [0,0],
        topY: [0,0]
      }
    },
    imgArrangeArr : [
      {
        pos:{
          left:0,
          top:0
        }
      }
    ]
  }
  componentDidMount(){
    const { Constant } = this.state;
    let wrapDOM = ReactDOM.findDOMNode(this.refs.wrap),
    stageW = wrapDOM.scrollWidth,
    stageH = wrapDOM.scrollHeight,
    halfStageW = Math.ceil(stageW / 2),
    halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    // 计算左右侧区域
    Constant.hPosRange.leftSecX[0] = -halfImgW;
    Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    Constant.hPosRange.y[0] = -halfImgH;
    Constant.hPosRange.y[1] = stageH - halfImgH;
    
    Constant.vPosRange.topY[0] = -halfImgH;
    Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    Constant.vPosRange.x[0] = halfStageW - imgW;
    Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  // 获取区间随机值
  getRangeRandom(low,high){
    return Math.floor(Math.random() * (high - low) + low);
  }
  // 重新布局
  rearrange(centerIndex){
    let { imgArrangeArr, Constant :{ centerPos,hPosRange:{leftSecX,rightSecX,y},vPosRange:{topY,x}} } = this.state;

    let imgsArrangeTopArr = [];
    let topImgNum = Math.floor(Math.random() * 2);//0 1
    let topImgSpliceIndex = 0;

    let imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);
    // 布局中间
    imgsArrangeCenterArr[0].pos = centerPos;

    topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);
    
    // 布局于上侧
    imgsArrangeTopArr.forEach( (value,index) => {
      imgsArrangeTopArr[index].pos = {
        top: this.getRangeRandom(topY[0],topY[1]),
        left: this.getRangeRandom(x[0],x[1])
      }
    })

    // 布局左右两侧
    for(let i = 0,j = imgArrangeArr.length, k = j / 2; i < j; i++){
      let hposRangeLOX = null;
      if(i < k){
        hposRangeLOX = leftSecX;
      }
      else{
        hposRangeLOX = rightSecX;
      }

      imgArrangeArr[i].pos = {
        top: this.getRangeRandom(y[0],y[1]),
        left: this.getRangeRandom(hposRangeLOX[0],hposRangeLOX[1])
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }

    imgArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgArrangeArr: imgArrangeArr
    });

  }
  render() {
    const controller = [], imgFigures = [];
    imageDatas.forEach((item, index) => {
      if(!this.state.imgArrangeArr[index]){
        this.state.imgArrangeArr[index] = {
          pos:{
            left: 0,
            top: 0
          }
        }
      }
      imgFigures.push(<SingleFigure key={index} data={item} ref={'imgFigure' + index} arrange={this.state.imgArrangeArr[index]} />)
    });
    return (
      <section className='wrap' ref='wrap'>
        <section className='imgArea'>
          {imgFigures}
        </section>
        <nav className='controllArea'>
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
