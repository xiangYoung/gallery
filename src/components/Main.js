require('normalize.css/normalize.css');
require('styles/App.css');

// 获取图片数据
var imageDatas = require('../data/imageData.json'); 

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
// 利用自执行函数 将图片信息转成url
imageDatas = (function getImageDataURL(imageDataArr){
  for(let i = 0, j = imageDataArr.length; i < j; i++){
    let singleImgData = imageDataArr[i];
    singleImgData.imageURL = require('../images/' + singleImgData.fileName);
    imageDataArr[i] = singleImgData;
  }
  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className='wrap'>
        <section className='imgArea'>
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
