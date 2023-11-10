import React ,{useCallback} from 'react'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"
//粒子 参数 配置信息 可参考  https://particles.js.org/ demo 中
// 粒子  动画效果
// 粒子 参数 配置信息
// const options:any={
//   // background: {
//   //     color: {
//   //         value: "#0d47a1",
//   //     },
//   // },
//   // fpsLimit 帧数，越低越卡,默认60
//   fpsLimit: 120,
//   fullScreen:{
//     zIndex:1
//   },
//   interactivity: {
//       events: {
//           onClick: {
//               enable: true,
//               mode: "push",
//           },
//           onHover: {
//               enable: true,
//               mode: "repulse",
//           },
//           resize: true,
//       },
//       modes: {
//           push: {
//             // 点击是添加1个粒子
//               quantity: 4,
//           },
//           //击退
//           // repulse: {
//           //   //鼠标移动时排斥粒子的距离
//           //     distance: 200,
//           //     //翻译是持续时间
//           //     duration: 0.4,
//           // },
//           //缓慢移动
//           slow:{
//             //移动速度
//             factor:0.1,
//              //影响范围
//             radius:200,
//           },
//           //吸引
//           attract:{
//              //鼠标移动时排斥粒子的距离
//              distance: 200,
//              //翻译是持续时间
//              duration: 0.4,
//              easing:'ease-out-quad',
//              factor:3,
//              maxSpeed:50,
//              speed:1,

//           },
//       },
//   },
//   // 粒子的参数
//   particles: {
//     // 粒子颜色
//       color: {
//           value: "#ffffff",
//       },
//       //是否启动粒子碰撞
//       collisions:{
//         enable:true
//       },
//       //粒子之间的线的参数
//       links: {
//           color: "#ffffff",
//           distance: 150,
//           enable: true,
//           opacity: 0.5,
//           width: 1,
//       },
//       move: {
//           direction: "none",
//           enable: true,
//           outModes: {
//               default: "bounce",
//           },
//           random: false,
//           speed: 6,
//           straight: false,
//       },
//       number: {
//           density: {
//               enable: true,
//               area: 800,
//           },
//           // 初始粒子数
//           value: 80,
//       },
//       //透明度
//       opacity: {
//           value: 0.5,
//       },
//       shape: {
//           type: "circle",
//       },
//       // 大小
//       size: {
//           value: { min: 1, max: 5 },
//       },
//   },
//   detectRetina: true,
// }
//  动画效果 - 配置2
const options:any={
  "autoPlay": true,
  "background": {
    "color": {
      "value": "rgb(35,39,65)"
    },
    "image": "",
    "position": "",
    "repeat": "",
    "size": "",
    "opacity": 1
  },
  "backgroundMask": {
    "composite": "destination-out",
    "cover": {
      "color": {
        "value": "#fff"
      },
      "opacity": 1
    },
    "enable": false
  },
  "defaultThemes": {},
  "delay": 0,
  "fullScreen": {
    "enable": true,
    "zIndex": 1
  },
  "detectRetina": true,
  "duration": 0,
  "fpsLimit": 120,
  "interactivity": {
    "detectsOn": "window",
    "events": {
      "onClick": {
        "enable": true,
        "mode": "push"
      },
      "onDiv": {
        "selectors": [],
        "enable": false,
        "mode": [],
        "type": "circle"
      },
      "onHover": {
        "enable": true,
        "mode": "repulse",
        "parallax": {
          "enable": false,
          "force": 2,
          "smooth": 10
        }
      },
      "resize": {
        "delay": 0.5,
        "enable": true
      }
    },
    "modes": {
      "trail": {
        "delay": 1,
        "pauseOnStop": false,
        "quantity": 1
      },
      "attract": {
        "distance": 200,
        "duration": 0.4,
        "easing": "ease-out-quad",
        "factor": 1,
        "maxSpeed": 50,
        "speed": 1
      },
      "bounce": {
        "distance": 200
      },
      "bubble": {
        "distance": 200,
        "duration": 0.4,
        "mix": false,
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "mix": false,
          "selectors": []
        }
      },
      "connect": {
        "distance": 80,
        "links": {
          "opacity": 0.5
        },
        "radius": 60
      },
      "grab": {
        "distance": 100,
        "links": {
          "blink": false,
          "consent": false,
          "opacity": 1
        }
      },
      "push": {
        "default": true,
        "groups": [],
        "quantity": 4
      },
      "remove": {
        "quantity": 2
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4,
        "factor": 100,
        "speed": 1,
        "maxSpeed": 50,
        "easing": "ease-out-quad",
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "factor": 100,
          "speed": 1,
          "maxSpeed": 50,
          "easing": "ease-out-quad",
          "selectors": []
        }
      },
      "slow": {
        "factor": 3,
        "radius": 200
      },
      "light": {
        "area": {
          "gradient": {
            "start": {
              "value": "#ffffff"
            },
            "stop": {
              "value": "#000000"
            }
          },
          "radius": 1000
        },
        "shadow": {
          "color": {
            "value": "#000000"
          },
          "length": 2000
        }
      }
    }
  },
  "manualParticles": [],
  "particles": {
    "bounce": {
      "horizontal": {
        "random": {
          "enable": false,
          "minimumValue": 0.1
        },
        "value": 1
      },
      "vertical": {
        "random": {
          "enable": false,
          "minimumValue": 0.1
        },
        "value": 1
      }
    },
    "collisions": {
      "absorb": {
        "speed": 2
      },
      "bounce": {
        "horizontal": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        },
        "vertical": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        }
      },
      "enable": false,
      "maxSpeed": 50,
      "mode": "bounce",
      "overlap": {
        "enable": true,
        "retries": 0
      }
    },
    "color": {
      // "value": "#ff0000",
      "animation": {
        "h": {
          "count": 0,
          "enable": false,
          "offset": 0,
          "speed": 1,
          "delay": 0,
          "decay": 0,
          "sync": true
        },
        "s": {
          "count": 0,
          "enable": false,
          "offset": 0,
          "speed": 1,
          "delay": 0,
          "decay": 0,
          "sync": true
        },
        "l": {
          "count": 0,
          "enable": false,
          "offset": 0,
          "speed": 1,
          "delay": 0,
          "decay": 0,
          "sync": true
        }
      }
    },
    "groups": {},
    "move": {
      "angle": {
        "offset": 0,
        "value": 90
      },
      "attract": {
        "distance": 200,
        "enable": false,
        "rotate": {
          "x": 3000,
          "y": 3000
        }
      },
      "center": {
        "x": 50,
        "y": 50,
        "mode": "percent",
        "radius": 0
      },
      "decay": 0,
      "distance": {},
      "direction": "none",
      "drift": 0,
      "enable": true,
      "gravity": {
        "acceleration": 9.81,
        "enable": false,
        "inverse": false,
        "maxSpeed": 50
      },
      "path": {
        "clamp": true,
        "delay": {
          "random": {
            "enable": false,
            "minimumValue": 0
          },
          "value": 0
        },
        "enable": false,
        "options": {}
      },
      "outModes": {
        "default": "out",
        "bottom": "out",
        "left": "out",
        "right": "out",
        "top": "out"
      },
      "random": false,
      "size": false,
      "speed": 2,
      "spin": {
        "acceleration": 0,
        "enable": false
      },
      "straight": false,
      "trail": {
        "enable": false,
        "length": 10,
        "fill": {}
      },
      "vibrate": false,
      "warp": false
    },
    "number": {
      "density": {
        "enable": true,
        "width": 1920,
        "height": 1080
      },
      "limit": 0,
      "value": 200
    },
    "opacity": {
      "random": {
        "enable": false,
        "minimumValue": 0.1
      },
      "value": {
        "min": 0.1,
        "max": 0.5
      },
      "animation": {
        "count": 0,
        "enable": true,
        "speed": 3,
        "decay": 0,
        "delay": 0,
        "sync": false,
        "mode": "auto",
        "startValue": "random",
        "destroy": "none"
      }
    },
    "reduceDuplicates": false,
    "shadow": {
      "blur": 0,
      "color": {
        "value": "#000"
      },
      "enable": false,
      "offset": {
        "x": 0,
        "y": 0
      }
    },
    "shape": {
      "close": true,
      "fill": true,
      "options": {},
      "type": "circle"
    },
    "size": {
      "random": {
        "enable": false,
        "minimumValue": 1
      },
      "value": {
        "min": 0.1,
        "max": 5
      },
      "animation": {
        "count": 0,
        "enable": true,
        "speed": 20,
        "decay": 0,
        "delay": 0,
        "sync": false,
        "mode": "auto",
        "startValue": "random",
        "destroy": "none"
      }
    },
    "stroke": {
      "width": 0
    },
    "zIndex": {
      "random": {
        "enable": false,
        "minimumValue": 0
      },
      "value": 0,
      "opacityRate": 1,
      "sizeRate": 1,
      "velocityRate": 1
    },
    "destroy": {
      "bounds": {},
      "mode": "none",
      "split": {
        "count": 1,
        "factor": {
          "random": {
            "enable": false,
            "minimumValue": 0
          },
          "value": 3
        },
        "rate": {
          "random": {
            "enable": false,
            "minimumValue": 0
          },
          "value": {
            "min": 4,
            "max": 9
          }
        },
        "sizeOffset": true,
        "particles": {}
      }
    },
    "roll": {
      "darken": {
        "enable": false,
        "value": 0
      },
      "enable": false,
      "enlighten": {
        "enable": false,
        "value": 0
      },
      "mode": "vertical",
      "speed": 25
    },
    "tilt": {
      "random": {
        "enable": false,
        "minimumValue": 0
      },
      "value": 0,
      "animation": {
        "enable": false,
        "speed": 0,
        "decay": 0,
        "sync": false
      },
      "direction": "clockwise",
      "enable": false
    },
    "twinkle": {
      "lines": {
        "enable": true,
        "frequency": 0.005,
        "opacity": 1,
        "color": {
          "value": "#ff0000"
        }
      },
      "particles": {
        "enable": true,
        "frequency": 0.05,
        "opacity": 1,
        "color": {
          "value": "#ffff00"
        }
      }
    },
    "wobble": {
      "distance": 5,
      "enable": false,
      "speed": {
        "angle": 50,
        "move": 10
      }
    },
    "life": {
      "count": 0,
      "delay": {
        "random": {
          "enable": false,
          "minimumValue": 0
        },
        "value": 0,
        "sync": false
      },
      "duration": {
        "random": {
          "enable": false,
          "minimumValue": 0.0001
        },
        "value": 0,
        "sync": false
      }
    },
    "rotate": {
      "random": {
        "enable": false,
        "minimumValue": 0
      },
      "value": 0,
      "animation": {
        "enable": false,
        "speed": 0,
        "decay": 0,
        "sync": false
      },
      "direction": "clockwise",
      "path": false
    },
    "orbit": {
      "animation": {
        "count": 0,
        "enable": false,
        "speed": 1,
        "decay": 0,
        "delay": 0,
        "sync": false
      },
      "enable": false,
      "opacity": 1,
      "rotation": {
        "random": {
          "enable": false,
          "minimumValue": 0
        },
        "value": 45
      },
      "width": 1
    },
    "links": {
      "blink": false,
      "color": {
        "value": "#ffffff"
      },
      "consent": false,
      "distance": 150,
      "enable": true,
      "frequency": 1,
      "opacity": 0.4,
      "shadow": {
        "blur": 5,
        "color": {
          "value": "#000"
        },
        "enable": false
      },
      "triangles": {
        "enable": false,
        "frequency": 1
      },
      "width": 1,
      "warp": false
    },
    "repulse": {
      "random": {
        "enable": false,
        "minimumValue": 0
      },
      "value": 0,
      "enabled": false,
      "distance": 1,
      "duration": 1,
      "factor": 1,
      "speed": 1
    }
  },
  "pauseOnBlur": true,
  "pauseOnOutsideViewport": true,
  "responsive": [],
  "smooth": false,
  "style": {},
  "themes": [],
  "zLayers": 100,
  "motion": {
    "disable": false,
    "reduce": {
      "factor": 4,
      "value": true
    }
  }
}
//  动画效果 - 配置3
// const options :any ={
//   "autoPlay": true,
//   "background": {
//     "color": {
//       "value": "rgb(35,39,65)"
//     },
//     "image": "",
//     "position": "50% 50%",
//     "repeat": "no-repeat",
//     "size": "cover",
//     "opacity": 1
//   },
//   "backgroundMask": {
//     "composite": "destination-out",
//     "cover": {
//       "color": {
//         "value": "#fff"
//       },
//       "opacity": 1
//     },
//     "enable": false
//   },
//   "defaultThemes": {},
//   "delay": 0,
//   "fullScreen": {
//     "enable": true,
//     "zIndex": 1
//   },
//   "detectRetina": true,
//   "duration": 0,
//   "fpsLimit": 120,
//   "interactivity": {
//     "detectsOn": "window",
//     "events": {
//       "onClick": {
//         "enable": true,
//         "mode": "push"
//       },
//       "onDiv": {
//         "selectors": [],
//         "enable": false,
//         "mode": [],
//         "type": "circle"
//       },
//       "onHover": {
//         "enable": true,
//         "mode": "bubble",
//         "parallax": {
//           "enable": false,
//           "force": 60,
//           "smooth": 10
//         }
//       },
//       "resize": {
//         "delay": 0.5,
//         "enable": true
//       }
//     },
//     "modes": {
//       "trail": {
//         "delay": 1,
//         "pauseOnStop": false,
//         "quantity": 1
//       },
//       "attract": {
//         "distance": 200,
//         "duration": 0.4,
//         "easing": "ease-out-quad",
//         "factor": 1,
//         "maxSpeed": 50,
//         "speed": 1
//       },
//       "bounce": {
//         "distance": 200
//       },
//       "bubble": {
//         "distance": 400,
//         "duration": 2,
//         "mix": false,
//         "opacity": 1,
//         "size": 40,
//         "divs": {
//           "distance": 200,
//           "duration": 0.4,
//           "mix": false,
//           "selectors": []
//         }
//       },
//       "connect": {
//         "distance": 80,
//         "links": {
//           "opacity": 0.5
//         },
//         "radius": 60
//       },
//       "grab": {
//         "distance": 400,
//         "links": {
//           "blink": false,
//           "consent": false,
//           "opacity": 1
//         }
//       },
//       "push": {
//         "default": true,
//         "groups": [],
//         "quantity": 4
//       },
//       "remove": {
//         "quantity": 2
//       },
//       "repulse": {
//         "distance": 200,
//         "duration": 0.4,
//         "factor": 100,
//         "speed": 1,
//         "maxSpeed": 50,
//         "easing": "ease-out-quad",
//         "divs": {
//           "distance": 200,
//           "duration": 0.4,
//           "factor": 100,
//           "speed": 1,
//           "maxSpeed": 50,
//           "easing": "ease-out-quad",
//           "selectors": []
//         }
//       },
//       "slow": {
//         "factor": 3,
//         "radius": 200
//       },
//       "light": {
//         "area": {
//           "gradient": {
//             "start": {
//               "value": "#ffffff"
//             },
//             "stop": {
//               "value": "#000000"
//             }
//           },
//           "radius": 1000
//         },
//         "shadow": {
//           "color": {
//             "value": "#000000"
//           },
//           "length": 2000
//         }
//       }
//     }
//   },
//   "manualParticles": [],
//   "particles": {
//     "bounce": {
//       "horizontal": {
//         "random": {
//           "enable": false,
//           "minimumValue": 0.1
//         },
//         "value": 1
//       },
//       "vertical": {
//         "random": {
//           "enable": false,
//           "minimumValue": 0.1
//         },
//         "value": 1
//       }
//     },
//     "collisions": {
//       "absorb": {
//         "speed": 2
//       },
//       "bounce": {
//         "horizontal": {
//           "random": {
//             "enable": false,
//             "minimumValue": 0.1
//           },
//           "value": 1
//         },
//         "vertical": {
//           "random": {
//             "enable": false,
//             "minimumValue": 0.1
//           },
//           "value": 1
//         }
//       },
//       "enable": false,
//       "maxSpeed": 50,
//       "mode": "bounce",
//       "overlap": {
//         "enable": true,
//         "retries": 0
//       }
//     },
//     "color": {
//       "value": "#ffffff",
//       "animation": {
//         "h": {
//           "count": 0,
//           "enable": false,
//           "offset": 0,
//           "speed": 1,
//           "delay": 0,
//           "decay": 0,
//           "sync": true
//         },
//         "s": {
//           "count": 0,
//           "enable": false,
//           "offset": 0,
//           "speed": 1,
//           "delay": 0,
//           "decay": 0,
//           "sync": true
//         },
//         "l": {
//           "count": 0,
//           "enable": false,
//           "offset": 0,
//           "speed": 1,
//           "delay": 0,
//           "decay": 0,
//           "sync": true
//         }
//       }
//     },
//     "groups": {},
//     "move": {
//       "angle": {
//         "offset": 0,
//         "value": 90
//       },
//       "attract": {
//         "distance": 200,
//         "enable": false,
//         "rotate": {
//           "x": 600,
//           "y": 1200
//         }
//       },
//       "center": {
//         "x": 50,
//         "y": 50,
//         "mode": "percent",
//         "radius": 0
//       },
//       "decay": 0,
//       "distance": {},
//       "direction": "none",
//       "drift": 0,
//       "enable": true,
//       "gravity": {
//         "acceleration": 9.81,
//         "enable": false,
//         "inverse": false,
//         "maxSpeed": 50
//       },
//       "path": {
//         "clamp": true,
//         "delay": {
//           "random": {
//             "enable": false,
//             "minimumValue": 0
//           },
//           "value": 0
//         },
//         "enable": false,
//         "options": {}
//       },
//       "outModes": {
//         "default": "bounce",
//         "bottom": "bounce",
//         "left": "bounce",
//         "right": "bounce",
//         "top": "bounce"
//       },
//       "random": false,
//       "size": false,
//       "speed": 6,
//       "spin": {
//         "acceleration": 0,
//         "enable": false
//       },
//       "straight": false,
//       "trail": {
//         "enable": false,
//         "length": 10,
//         "fill": {}
//       },
//       "vibrate": false,
//       "warp": false
//     },
//     "number": {
//       "density": {
//         "enable": true,
//         "width": 1920,
//         "height": 1080
//       },
//       "limit": 0,
//       "value": 170
//     },
//     "opacity": {
//       "random": {
//         "enable": false,
//         "minimumValue": 0.1
//       },
//       "value": 1,
//       "animation": {
//         "count": 0,
//         "enable": false,
//         "speed": 1,
//         "decay": 0,
//         "delay": 0,
//         "sync": false,
//         "mode": "auto",
//         "startValue": "random",
//         "destroy": "none",
//         "minimumValue": 0.1
//       }
//     },
//     "reduceDuplicates": false,
//     "shadow": {
//       "blur": 0,
//       "color": {
//         "value": "#000"
//       },
//       "enable": false,
//       "offset": {
//         "x": 0,
//         "y": 0
//       }
//     },
//     "shape": {
//       "close": true,
//       "fill": true,
//       "options": {
//         "character": {
//           "fill": false,
//           "font": "Verdana",
//           "style": "",
//           "value": "*",
//           "weight": "400"
//         },
//         "char": {
//           "fill": false,
//           "font": "Verdana",
//           "style": "",
//           "value": "*",
//           "weight": "400"
//         },
//         "polygon": {
//           "nb_sides": 5
//         },
//         "star": {
//           "nb_sides": 5
//         },
//         "image": {
//           "height": 32,
//           "replace_color": true,
//           "src": "/logo192.png", // 本地图片 public 文件夹中的 而public 为静态文件夹 直接指向被配置为静态文件夹的
//           "width": 32
//         },
//         "images": {
//           "height": 32,
//           "replace_color": true,
//           "src": "/logo192.png",
//           "width": 32
//         }
//       },
//       "type": "image"
//     },
//     "size": {
//       "random": {
//         "enable": false,
//         "minimumValue": 1
//       },
//       "value": 16,
//       "animation": {
//         "count": 0,
//         "enable": false,
//         "speed": 40,
//         "decay": 0,
//         "delay": 0,
//         "sync": false,
//         "mode": "auto",
//         "startValue": "random",
//         "destroy": "none",
//         "minimumValue": 0.1
//       }
//     },
//     "stroke": {
//       "width": 0,
//       "color": {
//         "value": "#000000",
//         "animation": {
//           "h": {
//             "count": 0,
//             "enable": false,
//             "offset": 0,
//             "speed": 1,
//             "delay": 0,
//             "decay": 0,
//             "sync": true
//           },
//           "s": {
//             "count": 0,
//             "enable": false,
//             "offset": 0,
//             "speed": 1,
//             "delay": 0,
//             "decay": 0,
//             "sync": true
//           },
//           "l": {
//             "count": 0,
//             "enable": false,
//             "offset": 0,
//             "speed": 1,
//             "delay": 0,
//             "decay": 0,
//             "sync": true
//           }
//         }
//       }
//     },
//     "zIndex": {
//       "random": {
//         "enable": false,
//         "minimumValue": 0
//       },
//       "value": 0,
//       "opacityRate": 1,
//       "sizeRate": 1,
//       "velocityRate": 1
//     },
//     "destroy": {
//       "bounds": {},
//       "mode": "none",
//       "split": {
//         "count": 1,
//         "factor": {
//           "random": {
//             "enable": false,
//             "minimumValue": 0
//           },
//           "value": 3
//         },
//         "rate": {
//           "random": {
//             "enable": false,
//             "minimumValue": 0
//           },
//           "value": {
//             "min": 4,
//             "max": 9
//           }
//         },
//         "sizeOffset": true,
//         "particles": {}
//       }
//     },
//     "roll": {
//       "darken": {
//         "enable": false,
//         "value": 0
//       },
//       "enable": false,
//       "enlighten": {
//         "enable": false,
//         "value": 0
//       },
//       "mode": "vertical",
//       "speed": 25
//     },
//     "tilt": {
//       "random": {
//         "enable": false,
//         "minimumValue": 0
//       },
//       "value": 0,
//       "animation": {
//         "enable": false,
//         "speed": 0,
//         "decay": 0,
//         "sync": false
//       },
//       "direction": "clockwise",
//       "enable": false
//     },
//     "twinkle": {
//       "lines": {
//         "enable": false,
//         "frequency": 0.05,
//         "opacity": 1
//       },
//       "particles": {
//         "enable": false,
//         "frequency": 0.05,
//         "opacity": 1
//       }
//     },
//     "wobble": {
//       "distance": 5,
//       "enable": false,
//       "speed": {
//         "angle": 50,
//         "move": 10
//       }
//     },
//     "life": {
//       "count": 0,
//       "delay": {
//         "random": {
//           "enable": false,
//           "minimumValue": 0
//         },
//         "value": 0,
//         "sync": false
//       },
//       "duration": {
//         "random": {
//           "enable": false,
//           "minimumValue": 0.0001
//         },
//         "value": 0,
//         "sync": false
//       }
//     },
//     "rotate": {
//       "random": {
//         "enable": false,
//         "minimumValue": 0
//       },
//       "value": 0,
//       "animation": {
//         "enable": false,
//         "speed": 0,
//         "decay": 0,
//         "sync": false
//       },
//       "direction": "clockwise",
//       "path": false
//     },
//     "orbit": {
//       "animation": {
//         "count": 0,
//         "enable": false,
//         "speed": 1,
//         "decay": 0,
//         "delay": 0,
//         "sync": false
//       },
//       "enable": false,
//       "opacity": 1,
//       "rotation": {
//         "random": {
//           "enable": false,
//           "minimumValue": 0
//         },
//         "value": 45
//       },
//       "width": 1
//     },
//     "links": {
//       "blink": false,
//       "color": {
//         "value": "#323031"
//       },
//       "consent": false,
//       "distance": 150,
//       "enable": false,
//       "frequency": 1,
//       "opacity": 0.4,
//       "shadow": {
//         "blur": 5,
//         "color": {
//           "value": "#000"
//         },
//         "enable": false
//       },
//       "triangles": {
//         "enable": false,
//         "frequency": 1
//       },
//       "width": 1,
//       "warp": false
//     },
//     "repulse": {
//       "random": {
//         "enable": false,
//         "minimumValue": 0
//       },
//       "value": 0,
//       "enabled": false,
//       "distance": 1,
//       "duration": 1,
//       "factor": 1,
//       "speed": 1
//     }
//   },
//   "pauseOnBlur": true,
//   "pauseOnOutsideViewport": true,
//   "responsive": [],
//   "smooth": false,
//   "style": {},
//   "themes": [],
//   "zLayers": 100,
//   "motion": {
//     "disable": false,
//     "reduce": {
//       "factor": 4,
//       "value": true
//     }
//   }
// }
// 粒子动画效果 - 封装
export default function MyParticles() {
  const particlesInit = useCallback(async (engine:any) => {
    // console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
}, []);
const particlesLoaded = useCallback(async (container:any) => {
  // await console.log(container);
}, []);
  return (
    <Particles id="tsparticles"  options={options} init={particlesInit} loaded={particlesLoaded} />
  )
}
