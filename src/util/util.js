const util = {
    /*
        （ base64 或  blob） url 转 blob对象
        如 图片的临时路径 调用方式如下：
        blob  如：createObjectBlob({url:'blob:http://localhost:3000/e4ea9f3c-e2a3-43c4-aa8f-01870985e825',success(res){console.log(res)}})
       base64 如： createObjectBlob({url:'data:text/plain;base64,b2ZmaWNlMjAxOea/gOa0u+WvhumSpe',success(res){console.log(res)}})
    */
    /**
    *  
    * @param String url  base64 或  blob 的 url
    * @param String success 回调函数
    * @param String fail MIME 类型： 默认为 text/plain 文本文件，具体估计文件后缀名 如 png, 类型为 image/png
    */
   /**（ base64 或  blob） url 转 blob对象
    * 
    * url临时访问地址转file对象  base64 或  blob 的 url
    *  如 图片的临时路径 调用方式如下：
        blob  如：createObjectBlob({url:'blob:http://localhost:3000/e4ea9f3c-e2a3-43c4-aa8f-01870985e825',success(res){console.log(res)}})
       base64 如： createObjectBlob({url:'data:text/plain;base64,b2ZmaWNlMjAxOea/gOa0u+WvhumSpe',success(res){console.log(res)}})

    * @param { url , success, fail } 临时地址 ，成功回调，失败回调
    */
    createObjectBlob :({url,success,fail})=> {
        return new Promise( async (resolve, rejects) => {
            try {
                if (url.startsWith('data')) {
                    let arr = url.split(','),
                        type = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]),
                        n = bstr.length,
                        u8arr = new Uint8Array(n);
                    while (n--) u8arr[n] = bstr.charCodeAt(n);
                    // success({
                    //     blob: new Blob([u8arr], { type })
                    // })
                    return resolve({blob: new Blob([u8arr], { type })})
                } else {
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.open('get', url)
                    xhr.onload =   function(){
                       return resolve({blob: xhr.response})
                    }
                    //  xhr.onload =   () =>  resolve({blob: xhr.response})
                    // xhr.onload = () =>  success({
                    //     blob: xhr.response
                    // })
                    xhr.onerror = rejects;
                    xhr.send();
                }
            } catch (error) {
                rejects(error)
            }
        })
       
    },
    /**
    * blob转file对象
    * @param String blob 对象
    * @param String filename 文件名
    * @param String type MIME 类型： 默认为 text/plain 文本文件，具体估计文件后缀名 如 png, 类型为 image/png
    */
    createObjectFile:(blob,filename,type='text/plain')=>{
        return new File([blob],filename,{type})
    }
    // createObjectFile:(e)=>{
    //     const {url,filename}=e;
    //     const encode = e.encode || 'utf-8';
    //     const type = e.type || 'text/plain';
    //     let reader = new FileReader();
    //     reader.onloadend = ()=>{
    //         if (url.startsWith('data')) type = url.split(',')[0].match(/:(.*?);/)[1];
    //         let file = new File([reader.result],filename,{type})
    //         e.success({file})
    //     }
    //     if(e.fail) reader.onerror=e.fail;
    //     if(type.startsWith('text')) reader.readAsText(url,encode); // 读取文本
    //     else  if(type.startsWith('image')) reader.readAsDataURL(url,encode);
    // }
}
export default util