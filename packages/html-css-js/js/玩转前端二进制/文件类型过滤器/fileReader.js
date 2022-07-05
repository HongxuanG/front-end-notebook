
const fileRef = document.getElementById('fileReader')
// 取blob中取一部分进行读取文件
const readBuffer = (blob, start = 0, end = 2) => {
  return new Promise((resolve,reject)=>{

    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      reject()
    }
    reader.readAsArrayBuffer(blob.slice(start, end))
  })
}
// 
fileRef.onchange = async (event) => {
  const fileList = event.target.files
  const singleFile = fileList[0]

  console.log(singleFile)
  try{
    const buffer = await readBuffer(singleFile, 0, 8)
    const uint8array = new Uint8Array(buffer)
    console.log('uint8array', uint8array)
    console.log(buffer)
    console.log('是不是png格式的图片', isPNG(uint8array))
  }catch(e){
    console.error(e);
  }


}
/**
 * 输入文件类型对应的魔数，返回一个return类型为boolean的判断函数
 * @param {array} fileHeader 魔数
 * @returns {function}
 */
const checkMagicNumber = (fileHeader) => {
  return (buffer, options = {offset: 0}) => {
    console.log('buffer', buffer)
    return fileHeader.every((hexadecimal, index) => hexadecimal === buffer[options.offset + index])
  }
}
// 因为pdf的魔数是0x25 0x50 0x44 0x46  代表字符串 %PDF
function stringToBytes(string) {
  return [...string].map((character) => character.charCodeAt(0))
}
// [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]就是png格式的魔数 
// 魔数就是文件的前几个字节，因为都是固定的，所以可以用来判断文件类型
const isPNG = checkMagicNumber([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const isJPEG = checkMagicNumber([0xff, 0xd8, 0xff])
const isPDF = checkMagicNumber(stringToBytes('%PDF'))
